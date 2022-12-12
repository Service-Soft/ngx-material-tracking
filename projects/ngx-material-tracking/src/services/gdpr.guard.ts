import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanActivate } from '@angular/router';
import { GdprDialogComponent } from '../components/gdpr-dialog/gdpr-dialog.component';
import { BaseTrackingMetadata } from './base-tracking.service';
import { GdprService, NGX_GDPR_SERVICE } from './gdpr.service';

/**
 * A guard that automatically opens the gdpr dialog when the user has not made choices regarding his tracking preferences.
 */
@Injectable({ providedIn: 'root' })
export class GdprGuard implements CanActivate {
    constructor(
        @Inject(NGX_GDPR_SERVICE)
        private readonly gdprService: GdprService<BaseTrackingMetadata>,
        private readonly dialog: MatDialog
    ) { }

    // eslint-disable-next-line jsdoc/require-jsdoc
    canActivate(): boolean {
        if (!this.gdprService.hasMadeGdprChoices) {
            this.dialog.open(GdprDialogComponent);
        }
        return true;
    }
}