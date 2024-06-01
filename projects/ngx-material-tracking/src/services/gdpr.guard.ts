import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { GdprService, NGX_GDPR_SERVICE } from './gdpr.service';

/**
 * A guard that automatically opens the gdpr dialog when the user has not made choices regarding his tracking preferences.
 */
export const GdprGuard: CanActivateFn = () => {
    const gdprService: GdprService = inject<GdprService>(NGX_GDPR_SERVICE);
    if (!gdprService.hasMadeGdprChoices) {
        void gdprService.openDialog();
    }
    return true;
};