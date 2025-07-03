import {
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { AppService } from './app.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, of } from 'rxjs';
import UserDetailsComponent from './user.details.component';
import { injectDocumentVisibility } from 'ngxtension/inject-document-visibility';

@Component({
  selector: 'app-user',
  imports: [UserDetailsComponent],
  template: `
    <h2>user {{ userId() }}</h2>
    @if(userR.value()) { username = {{ userR.value()?.username }}
    <app-user-details [user]="userR.value()"></app-user-details>
    }
    <br />
    @if(profileR.value()) { role = {{ profileR.value()?.role }}
    }
  `,
})
export default class UserComponent {
  readonly userId = input.required({ alias: 'id', transform: numberAttribute });

  readonly #appService = inject(AppService);
  readonly #visibilityState = injectDocumentVisibility();
  isVisible = computed(() => this.#visibilityState() === 'visible');

  readonly userR = rxResource({
    params: () => ({
      userId: this.userId(),
      visible: this.isVisible(),
    }),
    stream: ({ params }) => {
      if (!params.userId) {
        return of(null);
      }
      return this.#fetchUser(params.userId);
    },
  });

  readonly profileR = rxResource({
    params: () => ({
      user: this.userR.value(),
    }),
    stream: ({ params }) => {
      if (!params.user) {
        return of(null);
      }
      return this.#fetchProfile(params.user.profileId);
    },
  });

  #fetchUser(userId: number) {
    return this.#appService.getUser(userId).pipe(
      catchError((e) => {
        console.error('EditComponent:fetchUser:error:reason=', e.error?.reason);
        return EMPTY;
      })
    );
  }

  #fetchProfile(id: number) {
    return this.#appService.getProfile(id).pipe(
      catchError((e) => {
        console.error(
          'EditComponent:fetchProfile:error:reason=',
          e.error?.reason
        );
        return EMPTY;
      })
    );
  }
}
