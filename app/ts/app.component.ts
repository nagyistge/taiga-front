import { Component } from '@angular/core';

@Component({
  selector: 'body',
  template: `
    <router-outlet></router-outlet>
    <div ng-view></div>
  `,
})
export class AppComponent { }

