import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';

export type User = {
  id: number;
  username: string;
  profileId: number;
};

export type Profile = {
  id: number;
  role: string;
};

@Injectable({
  providedIn: 'root',
})
export class AppService {
  getUser(userId: number) {
    return of<User>({ id: userId, username: 'test', profileId: 12 }).pipe(
      delay(1000)
    );
  }

  getProfile(profileId: number) {
    return of<Profile>({ id: profileId, role: 'admin' }).pipe(delay(1000));
  }
}
