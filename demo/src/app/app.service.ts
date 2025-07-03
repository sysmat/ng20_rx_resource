import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay } from 'rxjs';

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
  readonly #http = inject(HttpClient);

  getUser(userId: number) {
    return this.#http.get<User>('/assets/user.json').pipe(delay(1000));
  }

  getProfile(profileId: number) {
    return this.#http.get<Profile>('/assets/profile.json').pipe(delay(1000));
  }
}
