import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { GdprService, NGX_GDPR_SERVICE } from './gdpr.service';
import { BaseTrackingMetadata } from './tracking/base-tracking.service';

/**
 * A guard that automatically opens the gdpr dialog when the user has not made choices regarding his tracking preferences.
 */
export const GdprGuard: CanActivateFn = () => {
    const gdprService: GdprService<BaseTrackingMetadata> = inject<GdprService<BaseTrackingMetadata>>(NGX_GDPR_SERVICE);
    if (!gdprService.hasMadeGdprChoices) {
        void gdprService.openDialog();
    }
    return true;
};