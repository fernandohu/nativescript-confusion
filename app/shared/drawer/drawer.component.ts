import {Component} from "@angular/core";
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { login, LoginResult } from "ui/dialogs";
import { getString, setString } from "application-settings";

@Component({
    selector: 'drawer-content',
    templateUrl: './shared/drawer/drawer.component.html',
})
export class DrawerComponent {

    constructor(private fonticon: TNSFontIconService) {
    }
}