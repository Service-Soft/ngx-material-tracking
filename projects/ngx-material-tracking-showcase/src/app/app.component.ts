/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { BaseTrackingMetadata, GdprService } from 'ngx-material-tracking';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(
        private readonly gdprService: GdprService<BaseTrackingMetadata>
    ) {}

    openGdpr(): void {
        void this.gdprService.openDialog();
    }
}