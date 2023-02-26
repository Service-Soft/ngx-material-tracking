import { Inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { BaseTrackingMetadata } from './base-tracking.service';
import { GdprService, NGX_GDPR_SERVICE } from './gdpr.service';

/**
 * A guard that automatically opens the gdpr dialog when the user has not made choices regarding his tracking preferences.
 */
@Injectable({ providedIn: 'root' })
export class GdprGuard implements CanActivate {
    constructor(
        @Inject(NGX_GDPR_SERVICE)
        private readonly gdprService: GdprService<BaseTrackingMetadata>
    ) { }

    // eslint-disable-next-line jsdoc/require-jsdoc
    canActivate(): boolean {
        if (!this.gdprService.hasMadeGdprChoices) {
            void this.gdprService.openDialog();
        }
        return true;
    }
}