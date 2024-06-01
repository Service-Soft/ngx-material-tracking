
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { GdprService, cookieStorage } from 'ngx-material-tracking';

@Component({
    // eslint-disable-next-line angular/component-selector
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        RouterModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule
    ]
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