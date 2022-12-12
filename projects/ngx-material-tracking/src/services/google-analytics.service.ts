import { inject, Injectable, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import { GdprCategory } from '../models/gdpr-category.enum';
import { GoogleAnalyticsEvent } from '../models/google-analytics-event.model';
import { BaseTrackingMetadata, BaseTrackingService } from './base-tracking.service';
import { ScriptService } from './script.service';

export const NGX_GOOGLE_ANALYTICS_ID: InjectionToken<string> = new InjectionToken<string>(
    'Provider for the id used for google analytics.',
    {
        providedIn: 'root',
        factory: (() => {
            // eslint-disable-next-line no-console
            console.error(
                // eslint-disable-next-line max-len
                'No google analytics id has been provided for the token NGX_GOOGLE_ANALYTICS_ID\nAdd this to your app.module.ts provider array:\n{\n    provide: NGX_GOOGLE_ANALYTICS_ID,\n    useValue: \'myAnalyticsId\'\n}'
            );
        }) as () => string
    }
);

export const NGX_GOOGLE_ANALYTICS_ANONYMIZE_IP: InjectionToken<boolean> = new InjectionToken<boolean>(
    'Provider for the google analytics anonymize ip option.',
    {
        providedIn: 'root',
        factory: () => true
    }
);

declare let gtag: Function;

/**
 * Service that provides google analytics out of the box.
 */
@Injectable({ providedIn: 'root' })
export class GoogleAnalyticsService extends BaseTrackingService<BaseTrackingMetadata> {
    readonly METADATA_LOCATION: 'localStorage' | 'sessionStorage' | 'cookie' = 'cookie';
    readonly METADATA_KEY: string = 'googleAnalytics';
    readonly GDPR_CATEGORY: GdprCategory = GdprCategory.DISABLED_BY_DEFAULT;
    readonly ANALYTICS_ID: string;
    readonly ANONYMIZE_IP: boolean;

    constructor(router: Router) {
        super(router);
        this.ANALYTICS_ID = inject(NGX_GOOGLE_ANALYTICS_ID);
        this.ANONYMIZE_IP = inject(NGX_GOOGLE_ANALYTICS_ANONYMIZE_IP);
        this.loadScripts();
    }

    /**
     * Loads all google analytics scripts.
     */
    protected loadScripts(): void {
        const scriptService: ScriptService = inject(ScriptService);
        scriptService.loadPermanentJsScript('', `https://www.googletagmanager.com/gtag/js?id=${this.ANALYTICS_ID}`, 'head');
        scriptService.loadPermanentJsScript(
            `
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());
            `,
            undefined,
            'head'
        );
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    onNavigationEnd(): void {
        if (this.metadata.enabled) {
            gtag('config', this.ANALYTICS_ID, {
                'anonymize_ip': this.ANONYMIZE_IP,
                'page_path': window.location.href
            });
        }
    }

    /**
     * Tracks a specific event that happened on the website.
     *
     * @param event - Data about the event.
     */
    trackEvent(event: GoogleAnalyticsEvent): void {
        if (this.metadata.enabled) {
            gtag('event', event.name, {
                'send_to': this.ANALYTICS_ID,
                'anonymize_ip': this.ANONYMIZE_IP,
                ...event.additionalParameters
            });
        }
    }
}