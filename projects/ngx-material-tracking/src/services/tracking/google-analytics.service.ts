import { inject, Injectable, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';

import { BaseTrackingMetadata, BaseTrackingService } from './base-tracking.service';
import { GdprCategory } from '../../models/gdpr-category.enum';
import { GoogleAnalyticsEvent } from '../../models/google-analytics-event.model';
import { ScriptService } from '../script.service';

/**
 * Provider for the id used for google analytics.
 */
export const NGX_GOOGLE_ANALYTICS_ID: InjectionToken<string> = new InjectionToken<string>(
    'Provider for the id used for google analytics.',
    {
        providedIn: 'root',
        factory: (() => {
            // eslint-disable-next-line no-console
            console.error(
                // eslint-disable-next-line stylistic/max-len
                'No google analytics id has been provided for the token NGX_GOOGLE_ANALYTICS_ID\nAdd this to your app.module.ts provider array:\n{\n    provide: NGX_GOOGLE_ANALYTICS_ID,\n    useValue: \'myAnalyticsId\'\n}'
            );
        }) as () => string
    }
);

/**
 * Provider for the google analytics anonymize ip option.
 */
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
    override readonly METADATA_LOCATION: 'localStorage' | 'sessionStorage' | 'cookie' = 'cookie';
    override readonly METADATA_KEY: string = 'googleAnalytics';
    override readonly GDPR_CATEGORY: GdprCategory = GdprCategory.DISABLED_BY_DEFAULT;
    /**
     * The google analytics id.
     */
    readonly ANALYTICS_ID: string;
    /**
     * Whether or not the ip should be anonymized.
     */
    readonly ANONYMIZE_IP: boolean;
    private readonly ANALYTICS_SCRIPT_ID: string = 'analytics-script';
    private readonly GTAG_SCRIPT_ID: string = 'gtag-script';
    private readonly scriptService: ScriptService;
    private isLoaded: boolean = false;

    constructor(router: Router) {
        super(router, { enabled: false });
        this.ANALYTICS_ID = inject(NGX_GOOGLE_ANALYTICS_ID);
        this.ANONYMIZE_IP = inject(NGX_GOOGLE_ANALYTICS_ANONYMIZE_IP);
        this.scriptService = inject(ScriptService);
    }

    override async enable(): Promise<void> {
        super.enable();
        await this.loadScripts();
    }

    /**
     * Loads all google analytics scripts.
     */
    protected async loadScripts(): Promise<void> {
        if (this.isLoaded) {
            return;
        }

        try {
            await this.scriptService.loadPermanentJsScript('', `https://www.googletagmanager.com/gtag/js?id=${this.ANALYTICS_ID}`, 'head', this.ANALYTICS_SCRIPT_ID);
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Failed to load Google Analytics Script from https://www.googletagmanager.com/gtag/js?id=${this.ANALYTICS_ID}`);
            this.disable();
            return;
        }
        try {
            await this.scriptService.loadPermanentJsScript(
                `
                    window.dataLayer = window.dataLayer || [];
                    function gtag() { dataLayer.push(arguments); }
                    // gtag('js', new Date());
                `,
                undefined,
                'head',
                this.GTAG_SCRIPT_ID
            );
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to load GTAG Script:', error);
            this.disable();
            return;
        }

        this.isLoaded = true;
    }

    override async onNavigationEnd(): Promise<void> {
        if (!this.metadata.enabled) {
            return;
        }
        return new Promise<void>((resolve, reject) => {
            this.loadScripts()
                // eslint-disable-next-line promise/prefer-await-to-then
                .then(() => {
                    gtag('config', this.ANALYTICS_ID, {
                        anonymize_ip: this.ANONYMIZE_IP,
                        page_path: window.location.href
                    });
                    resolve();
                })
                // eslint-disable-next-line promise/prefer-await-to-then, promise/prefer-await-to-callbacks
                .catch(error => reject(error));
        });
    }

    override disable(): void {
        super.disable();
        this.scriptService.removeScriptById(this.ANALYTICS_SCRIPT_ID);
        this.scriptService.removeScriptById(this.GTAG_SCRIPT_ID);
        this.isLoaded = false;
    }

    /**
     * Tracks a specific event that happened on the website.
     * @param name - The name of the event to track.
     * @param event - Data about the event.
     */
    trackEvent(name: string, event: GoogleAnalyticsEvent): void {
        if (this.metadata.enabled) {
            gtag('event', name, {
                ...event,
                send_to: this.ANALYTICS_ID,
                anonymize_ip: this.ANONYMIZE_IP
            });
        }
    }
}