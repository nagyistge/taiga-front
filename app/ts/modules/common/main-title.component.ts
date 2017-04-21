import {Component, Input} from "@angular/core"

@Component({
    selector: "tg-main-title",
    template: require("./main-title.jade")()
})
export class MainTitle {
    @Input() sectionName
    @Input() projectName
}

