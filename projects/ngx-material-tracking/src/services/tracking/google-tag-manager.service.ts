import { Injectable, InjectionToken, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GdprCategory } from '../../models/gdpr-category.enum';
import { GoogleAnalyticsEvent } from '../../models/google-analytics-event.model';
import { BaseTrackingMetadata, BaseTrackingService } from './base-tracking.service';

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
                // eslint-disable-next-line max-len
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

    constructor(router: Router) {
        super(router, { enabled: false });
        this.GTM_ID = inject(NGX_GOOGLE_TAG_MANAGER_ID);
    }

    override onNavigationEnd(): void {
        if (this.metadata.enabled) {
            void this.pushTag({
                event: 'page',
                pageName: window.location.href
            });
        }
    }

    /**
     * Tracks the given event by pushing it to the data layer.
     * @param event - The event data to track.
     */
    trackEvent(event: GoogleAnalyticsEvent): void {
        if (this.metadata.enabled) {
            void this.pushTag({
                event: event.name,
                ...event.additionalParameters
            });
        }
    }

    /**
     * Pushes the given item to the dataLayer.
     * @param item - The item to push.
     */
    private async pushTag(item: object): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this.isLoaded) {
                this.addGtmToDom()
                    .then(() => {
                        this.pushOnDataLayer(item);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                        return;
                    });
            }
            else {
                this.pushOnDataLayer(item);
                resolve();
                return;
            }
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

    private async addGtmToDom(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this.isLoaded) {
                resolve(this.isLoaded);
                return;
            }
            this.pushOnDataLayer({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });

            const gtmScript: HTMLScriptElement = document.createElement('script');

            gtmScript.id = 'GTMscript';
            gtmScript.async = true;
            gtmScript.src = this.applyGtmQueryParams('https://www.googletagmanager.com/gtm.js');
            gtmScript.addEventListener('load', () => {
                this.isLoaded = true;
                resolve(this.isLoaded);
            });
            gtmScript.addEventListener('error', () => {
                reject(false);
            });
            document.head.insertBefore(gtmScript, document.head.firstChild);
        });
    }
}