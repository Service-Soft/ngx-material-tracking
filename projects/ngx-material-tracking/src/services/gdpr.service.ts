import { inject, Inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { Tracking } from '../models/tracking.model';
import { BaseTrackingMetadata, BaseTrackingService } from './base-tracking.service';

// eslint-disable-next-line max-len, @typescript-eslint/no-explicit-any
export const NGX_GDPR_TRACKINGS: InjectionToken<Tracking<any>[]> = new InjectionToken<Tracking<any>[]>('Provider for the trackings used in the gdpr-service.', {
    providedIn: 'root',
    factory: (() => {
        // eslint-disable-next-line no-console
        console.error(
            // eslint-disable-next-line max-len
            'No trackings have been provided for the token NGX_GDPR_TRACKINGS\nAdd this to your app.module.ts provider array:\n{\n    provide: NGX_GDPR_TRACKINGS,\n    useValue: [...]\n}'
        );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as () => Tracking<any>[]
});

// eslint-disable-next-line max-len, @typescript-eslint/no-explicit-any
export const NGX_GDPR_SERVICE: InjectionToken<GdprService<any>> = new InjectionToken<GdprService<any>>(
    'Provider for the trackings used in the gdpr-service.',
    {
        providedIn: 'root',
        factory: () => {
            return inject(GdprService<BaseTrackingMetadata>);
        }
    }
);

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
export class GdprService<TrackingMetadata extends BaseTrackingMetadata> {

    /**
     * The key where the information about whether the user has made gdpr choices is stored.
     */
    protected readonly HAS_MADE_GDPR_CHOICES_KEY: string = 'hasMadeGdprChoices';

    // eslint-disable-next-line jsdoc/require-returns
    /**
     * Whether the user has already saved his preferences inside the gdpr dialog.
     */
    get hasMadeGdprChoices(): boolean {
        // eslint-disable-next-line max-len
        const res: Omit<BaseTrackingMetadata, 'enabled'> | null = JSON.parse(localStorage.getItem(this.HAS_MADE_GDPR_CHOICES_KEY) ?? '') as Omit<BaseTrackingMetadata, 'enabled'> | null;
        if (
            res
            && (
                (Date.now() - new Date(res.createdAt).getTime()) < this.HAS_MADE_GDPR_CHOICES_DURATION_IN_MS
            )
        ) {
            return true;
        }
        localStorage.removeItem(this.HAS_MADE_GDPR_CHOICES_KEY);
        return false;
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    set hasMadeGdprChoices(value: boolean) {
        if (value) {
            localStorage.setItem(this.HAS_MADE_GDPR_CHOICES_KEY, JSON.stringify(new Date()));
        }
    }

    constructor(
        private readonly injector: Injector,
        @Inject(NGX_GDPR_TRACKINGS)
        readonly trackings: Tracking<TrackingMetadata>[],
        @Inject(NGX_HAS_MADE_GDPR_CHOICES_DURATION_IN_MS)
        private readonly HAS_MADE_GDPR_CHOICES_DURATION_IN_MS: number
    ) { }

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
     *
     * @param tracking - The tracking service to disable.
     */
    disableTracking(tracking: Tracking<TrackingMetadata>): void {
        this.injector.get<BaseTrackingService<TrackingMetadata>>(tracking.TrackingServiceClass).disable();
    }

    /**
     * Enables all tracking services.
     */
    enableAllTrackings(): void {
        for (const tracking of this.trackings) {
            this.enableTracking(tracking);
        }
    }

    /**
     * Enables the given tracking service.
     *
     * @param tracking - The tracking service to enable.
     */
    enableTracking(tracking: Tracking<TrackingMetadata>): void {
        this.injector.get<BaseTrackingService<TrackingMetadata>>(tracking.TrackingServiceClass).enable();
    }
}