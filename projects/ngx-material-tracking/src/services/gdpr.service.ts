import { Dialog } from '@angular/cdk/dialog';
import { isPlatformBrowser } from '@angular/common';
import { inject, Inject, Injectable, InjectionToken, Injector, PLATFORM_ID } from '@angular/core';

import { SnackbarService } from './snackbar.service';
import { BaseTrackingMetadata, BaseTrackingService } from './tracking/base-tracking.service';
import { GdprDialogComponent } from '../components/gdpr-dialog/gdpr-dialog.component';
import { DntSettings } from '../models/dnt-settings.model';
import { GDPR_DIALOG_PANEL_CLASS, GdprDialogData } from '../models/gdpr-dialog-data.model';
import { Tracking } from '../models/tracking.model';

/**
 * Provides configuration data for handling do not track requests.
 */
export const NGX_GDPR_DNT_SETTINGS: InjectionToken<DntSettings> = new InjectionToken<DntSettings>(
    'configuration data for handling do not track requests',
    {
        providedIn: 'root',
        factory: () => {
            return {
                respect: true,
                snackbarDuration: 5000,
                snackbarMessage: 'We have seen your "do not track request" and disabled all tracking automatically.'
            };
        }
    }
);

/**
 * Provides configuration data for the gdpr dialog.
 */
export const NGX_GDPR_DIALOG_DATA: InjectionToken<GdprDialogData> = new InjectionToken<GdprDialogData>(
    'Data for the gdpr dialog',
    {
        providedIn: 'root',
        factory: () => {
            return {};
        }
    }
);

/**
 * Provider for the trackings used in the gdpr-service.
 */
export const NGX_GDPR_TRACKINGS: InjectionToken<Tracking[]> = new InjectionToken<Tracking[]>(
    'Provider for the trackings used in the gdpr-service.',
    {
        providedIn: 'root',
        factory: (() => {
            // eslint-disable-next-line no-console
            console.error(
                // eslint-disable-next-line stylistic/max-len
                'No trackings have been provided for the token NGX_GDPR_TRACKINGS\nAdd this to your app.module.ts provider array:\n{\n    provide: NGX_GDPR_TRACKINGS,\n    useValue: [...]\n}'
            );
        // eslint-disable-next-line typescript/no-explicit-any
        }) as () => Tracking<any>[]
    }
);

/**
 * Provider for the trackings used in the gdpr-service.
 */
export const NGX_GDPR_SERVICE: InjectionToken<GdprService> = new InjectionToken<GdprService>(
    'Provider for the trackings used in the gdpr-service.',
    {
        providedIn: 'root',
        factory: () => {
            return inject(GdprService);
        }
    }
);

/**
 * Defines how long the users gdpr choices are saved.
 * @default 1 month
 */
export const NGX_HAS_MADE_GDPR_CHOICES_DURATION_IN_MS: InjectionToken<number> = new InjectionToken<number>(
    'Defines how long the users gdpr choices are saved.',
    {
        providedIn: 'root',
        factory: () => 2629746000 // 1 month
    }
);

/**
 * Administers tracking services.
 */
@Injectable({ providedIn: 'root' })
export class GdprService {

    /**
     * The key where the information about whether the user has made gdpr choices is stored.
     */
    protected readonly HAS_MADE_GDPR_CHOICES_KEY: string = 'hasMadeGdprChoices';

    // eslint-disable-next-line jsdoc/require-returns
    /**
     * Whether the user has already saved his preferences inside the gdpr dialog.
     */
    get hasMadeGdprChoices(): boolean {
        if (!isPlatformBrowser(this.platformId)) {
            return true;
        }

        const localData: string | null = localStorage.getItem(this.HAS_MADE_GDPR_CHOICES_KEY);
        if (localData == undefined) {
            if (this.dntEnabled) {
                this.disableAllTrackings();
                localStorage.setItem(this.HAS_MADE_GDPR_CHOICES_KEY, JSON.stringify({ createdAt: new Date() }));
                this.snackbar.open(this.dntSettings.snackbarMessage, { duration: this.dntSettings.snackbarDuration });
                return true;
            }
            return false;
        }
        try {
            // eslint-disable-next-line stylistic/max-len
            const res: Pick<BaseTrackingMetadata, 'createdAt'> | null = JSON.parse(localData) as Pick<BaseTrackingMetadata, 'createdAt'> | null;
            if (res?.createdAt && ((Date.now() - new Date(res.createdAt).getTime()) < this.HAS_MADE_GDPR_CHOICES_DURATION_IN_MS)) {
                return true;
            }
            localStorage.removeItem(this.HAS_MADE_GDPR_CHOICES_KEY);
            return false;
        }
        catch {
            localStorage.removeItem(this.HAS_MADE_GDPR_CHOICES_KEY);
            return false;
        }
    }

    set hasMadeGdprChoices(value: boolean) {
        if (value && isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.HAS_MADE_GDPR_CHOICES_KEY, JSON.stringify({ createdAt: new Date() }));
        }
    }

    private get dntEnabled(): boolean {
        return this.dntSettings.respect
            && (
                ('globalPrivacyControl' in navigator && navigator.globalPrivacyControl == true)
                || navigator.doNotTrack == '1'
                || navigator.doNotTrack == 'yes'
                || ('doNotTrack' in window && window.doNotTrack == '1')
            );
    }

    constructor(
        private readonly injector: Injector,
        private readonly dialog: Dialog,
        @Inject(NGX_GDPR_TRACKINGS)
        readonly trackings: Tracking[],
        @Inject(NGX_HAS_MADE_GDPR_CHOICES_DURATION_IN_MS)
        private readonly HAS_MADE_GDPR_CHOICES_DURATION_IN_MS: number,
        @Inject(NGX_GDPR_DIALOG_DATA)
        private readonly dialogData: GdprDialogData,
        @Inject(NGX_GDPR_DNT_SETTINGS)
        private readonly dntSettings: DntSettings,
        private readonly snackbar: SnackbarService,
        @Inject(PLATFORM_ID)
        private readonly platformId: Object
    ) { }

    /**
     * Opens the gdpr dialog lazily.
     */
    async openDialog(): Promise<void> {
        // eslint-disable-next-line stylistic/max-len
        const dialogComponent: typeof GdprDialogComponent = Object.values(await import('../components/gdpr-dialog/gdpr-dialog.component'))[0];
        this.dialog.open(dialogComponent, {
            data: this.dialogData,
            autoFocus: '.allow-all-button',
            restoreFocus: false,
            panelClass: GDPR_DIALOG_PANEL_CLASS,
            disableClose: true,
            maxHeight: 'calc(100vh - 30px)',
            maxWidth: 'calc(100vw - 30px)'
        });
    }

    /**
     * Disables all tracking services that aren't technical necessary.
     */
    disableAllTrackings(): void {
        for (const tracking of this.trackings) {
            this.disableTracking(tracking);
        }
    }

    /**
     * Disables the given tracking service if it is not technical necessary.
     * @param tracking - The tracking service to disable.
     */
    disableTracking<TrackingMetadata extends BaseTrackingMetadata>(tracking: Tracking<TrackingMetadata>): void {
        this.injector.get<BaseTrackingService<TrackingMetadata>>(tracking.TrackingServiceClass).disable();
    }

    /**
     * Enables all tracking services.
     */
    async enableAllTrackings(): Promise<void> {
        for (const tracking of this.trackings) {
            await this.enableTracking(tracking);
        }
    }

    /**
     * Enables the given tracking service.
     * @param tracking - The tracking service to enable.
     */
    async enableTracking<TrackingMetadata extends BaseTrackingMetadata>(tracking: Tracking<TrackingMetadata>): Promise<void> {
        await this.injector.get<BaseTrackingService<TrackingMetadata>>(tracking.TrackingServiceClass).enable();
    }
}