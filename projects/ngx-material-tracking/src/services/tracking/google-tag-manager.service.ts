import { Injectable, InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BaseTrackingMetadata, BaseTrackingService } from './base-tracking.service';
import { GdprCategory } from '../../models/gdpr-category.enum';
import { GoogleAnalyticsEvent } from '../../models/google-analytics-event.model';
import { ScriptService } from '../script.service';

/**
 * Provider for the id used for google analytics.
 */
export const NGX_GOOGLE_TAG_MANAGER_ID: InjectionToken<string> = new InjectionToken<string>(
    'Provider for the id used for the google tag manager.',
    {
        providedIn: 'root',
        factory: (() => {
            // eslint-disable-next-line no-console
            console.error(
                // eslint-disable-next-line stylistic/max-len
                'No google tag manager id has been provided for the token NGX_GOOGLE_TAG_MANAGER_ID\nAdd this to your app.module.ts provider array:\n{\n    provide: NGX_GOOGLE_TAG_MANAGER_ID,\n    useValue: \'myTagManagerId\'\n}'
            );
        }) as () => string
    }
);

/**
 * The window type with the data layer.
 */
type WindowType = Window & typeof globalThis & {
    /**
     * The data layer used by tracking services such as google tag manager.
     */
    dataLayer?: unknown[]
};

/**
 * Service that provides google tag manager out of the box.
 */
@Injectable({ providedIn: 'root' })
export class GoogleTagManagerService extends BaseTrackingService<BaseTrackingMetadata> {
    override readonly METADATA_LOCATION: 'localStorage' | 'sessionStorage' | 'cookie' = 'cookie';
    override readonly METADATA_KEY: string = 'googleTagManager';
    override readonly GDPR_CATEGORY: GdprCategory = GdprCategory.DISABLED_BY_DEFAULT;

    private isLoaded: boolean = false;
    private readonly GTM_ID: string;
    private readonly GTM_SCRIPT_ID: string = 'gtm-script';
    private readonly scriptService: ScriptService;

    constructor(router: Router) {
        super(router, { enabled: false }, inject(PLATFORM_ID));
        this.GTM_ID = inject(NGX_GOOGLE_TAG_MANAGER_ID);
        this.scriptService = inject(ScriptService);
    }

    override async enable(): Promise<void> {
        super.enable();
        await this.loadGTMScript();
    }

    override onNavigationEnd(): void {
        if (this.metadata.enabled) {
            void this.pushTag({
                event: 'page',
                pageName: window.location.href
            });
        }
    }

    override disable(): void {
        super.disable();
        this.scriptService.removeScriptById(this.GTM_SCRIPT_ID);
        this.isLoaded = false;
    }

    /**
     * Tracks the given event by pushing it to the data layer.
     * @param name - The name of the event to track.
     * @param event - The event data to track.
     */
    async trackEvent(name: string, event: GoogleAnalyticsEvent): Promise<void> {
        if (this.metadata.enabled) {
            await this.pushTag({
                ...event,
                event: name
            });
        }
    }

    /**
     * Pushes the given item to the dataLayer.
     * @param item - The item to push.
     */
    private async pushTag(item: object): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.loadGTMScript()
                // eslint-disable-next-line promise/prefer-await-to-then
                .then(() => {
                    this.pushOnDataLayer(item);
                    resolve();
                })
                // eslint-disable-next-line promise/prefer-await-to-then, promise/prefer-await-to-callbacks
                .catch(error => reject(error));
        });
    }

    private applyGtmQueryParams(url: string): string {
        if (!url.includes('?')) {
            url += '?';
        }
        url += `id=${this.GTM_ID}`;
        return url;
    }

    private getDataLayer(): unknown[] {
        const w: WindowType = window;
        w.dataLayer = w.dataLayer ?? [];
        return w.dataLayer;
    }

    private pushOnDataLayer(obj: object): void {
        const dataLayer: unknown[] = this.getDataLayer();
        dataLayer.push(obj);
    }

    private async loadGTMScript(): Promise<void> {
        if (this.isLoaded) {
            return;
        }

        this.pushOnDataLayer({
            'gtm.start': Date.now(),
            event: 'gtm.js'
        });

        try {
            await this.scriptService.loadPermanentJsScript('', this.applyGtmQueryParams('https://www.googletagmanager.com/gtm.js'), 'head', this.GTM_SCRIPT_ID);
            this.isLoaded = true;
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Failed to load GTM Script from ${this.applyGtmQueryParams('https://www.googletagmanager.com/gtm.js')}`);
            this.disable();
            return;
        }
    }
}