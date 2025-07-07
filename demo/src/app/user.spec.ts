import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppService, Profile, User } from './app.service';
import UserComponent from './user.component';

describe('Testing UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let appService: AppService;

  const testProfile: Profile = {
    id: 1,
    role: 'test',
  };

  const testUser: User = {
    id: 1,
    username: 'test',
    profileId: 2,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: '**', component: UserComponent }]),
      ],
    }).compileComponents();

    appService = TestBed.inject(AppService);

    // appService = fixture.debugElement.injector.get(AppService);
  });

  it('should create component and show erro message when id is null', () => {
    fixture = TestBed.createComponent(UserComponent);
    fixture.componentRef.setInput('id', null);
    fixture.detectChanges();
  });

  it('should fetch user', async () => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;

    spyOn(appService, 'getUser').and.returnValue(of(testUser));

    fixture.componentRef.setInput('id', 1);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(appService.getUser).toHaveBeenCalled();

    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.userR.value()?.id).toEqual(testUser.id);
  });

  it('should fetch profile', async () => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;

    spyOn(appService, 'getProfile').and.returnValue(of(testProfile));
    spyOn(appService, 'getUser').and.returnValue(of(testUser));

    fixture.componentRef.setInput('id', 1);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(appService.getUser).toHaveBeenCalled();
    await fixture.whenStable();
    expect(component.userR.value()?.id).toEqual(testUser.id);

    TestBed.tick();

    await fixture.whenStable();
    expect(appService.getProfile).toHaveBeenCalled();
    await fixture.whenStable();
    expect(component.profileR.value()?.id).toEqual(testProfile.id);
  });

  it('should show error on failed user fetch', async () => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;

    spyOn(appService, 'getUser').and.returnValue(throwError(() => 'error'));
    fixture.componentRef.setInput('id', 1);

    await fixture.whenStable();
    fixture.detectChanges();
    expect(appService.getUser).toHaveBeenCalled();
  });

  it('should show error on failed profile fetch ', async () => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;

    spyOn(appService, 'getProfile').and.returnValue(throwError(() => 'error'));
    spyOn(appService, 'getUser').and.returnValue(of(testUser));

    fixture.componentRef.setInput('id', 1);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(appService.getUser).toHaveBeenCalled();
    await fixture.whenStable();
    expect(component.userR.value()?.id).toEqual(testUser.id);

    TestBed.tick();
    await fixture.whenStable();
    expect(appService.getProfile).toHaveBeenCalled();
    await fixture.whenStable();
    expect(component.profileR.status()).toEqual('error');
  });
});
