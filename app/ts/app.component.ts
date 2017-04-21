import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { IState } from "./app.store";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'tg-view',
  template: require("./app.jade")()
})
export class AppComponent {
    user:any
    projects:any
    errorHandling:any = {}

    constructor(private store: Store<IState>, private translate: TranslateService) {
        this.user = this.store.select((state) => state.getIn(["global", "user"]))
        this.projects = this.store.select((state) => state.getIn(["global", "projects"]))
        this.store.dispatch({
            type: "FETCH_CURRENT_USER_DATA",
            payload: null,
        });
        this.translate.use("en");
    }
}
