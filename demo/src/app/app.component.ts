import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import UserComponent from './user.component';

@Component({
  selector: 'app-root',
  imports: [UserComponent],
  template: `
  <h1>angular 20</h1>  
  <app-user [id]="1"> 
  `,
})
export class AppComponent {}
