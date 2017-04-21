import {Pipe, PipeTransform, Injectable} from "@angular/core";
import * as MessageFormat from "messageformat"

@Injectable()
@Pipe({name: "messageformat"})
export class MessageFormatPipe implements PipeTransform {
    private messageformat: MessageFormat;

    constructor() {
        this.messageformat = new MessageFormat('en');
    }

    transform(value: string, args: Object): string {
        return this.messageformat.compile(value)(args);
    }
}
