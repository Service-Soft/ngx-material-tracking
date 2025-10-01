import { Component, Inject } from '@angular/core';

import { SNACKBAR_MESSAGE, SnackbarComponentInterface } from './snackbar-component.interface';

@Component({
    selector: 'ngx-mat-tracking-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.scss'],
    standalone: true
})
// eslint-disable-next-line jsdoc/require-jsdoc
export class SnackbarComponent implements SnackbarComponentInterface {
    constructor(
        @Inject(SNACKBAR_MESSAGE)
        readonly message: string
    ) { }
}