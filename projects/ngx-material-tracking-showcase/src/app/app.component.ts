/* eslint-disable jsdoc/require-jsdoc */
import { Component } from '@angular/core';
import { GdprService, cookieStorage } from 'ngx-material-tracking';

@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(
        private readonly gdprService: GdprService
    ) {}

    async openGdpr(): Promise<void> {
        await this.gdprService.openDialog();
    }

    clearLocalData(): void {
        localStorage.clear();
        sessionStorage.clear();
        cookieStorage.clear();
    }
}