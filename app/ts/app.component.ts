import { Component } from '@angular/core';

@Component({
  selector: 'tg-view',
  template: `
    <router-outlet></router-outlet>
    <div class="master" ng-view></div>
  `,
})
export class AppComponent { }
