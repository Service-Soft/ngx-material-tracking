/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GdprDialogComponent } from 'ngx-material-tracking';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(
        private readonly dialog: MatDialog
    ) {}

    openGdpr(): void {
        this.dialog.open(GdprDialogComponent, {
            autoFocus: '.allow-all-button'
        });
    }
}