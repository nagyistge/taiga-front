import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { IState } from "./app.store";

@Component({
  selector: 'tg-view',
  template: `
    <router-outlet></router-outlet>
    <div class="master" ng-view></div>
  `,
})
export class AppComponent {
    constructor(private store: Store<IState>) {
        this.store.dispatch({
            type: "FETCH_CURRENT_USER_DATA",
            payload: null,
        });
    }
}
