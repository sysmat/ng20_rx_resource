import { Component, inject, input } from '@angular/core';
import { AppService, User } from './app.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, of } from 'rxjs';

@Component({
  selector: 'app-user-details',
  template: `
    <h2>user {{ user()?.id }}</h2>
    @if(userR.value()) { username = {{ userR.value()?.username }}
    }
    <br />
    @if(profileR.value()) { role = {{ profileR.value()?.role }}
    }
  `,
})
export default class UserDetailsComponent {
  readonly user = input.required<User | null | undefined>();
  readonly #appService = inject(AppService);

  readonly userR = rxResource({
    params: () => ({
      userId: this.user()?.id,
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
