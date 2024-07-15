import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { BaseTrackingMetadata, BaseTrackingService } from './base-tracking.service';
import { GdprCategory } from '../../models/gdpr-category.enum';
import { PixelEventName, PixelEventProperties } from '../../models/meta-pixel.model';
import { ScriptService } from '../script.service';

/**
 * Provider for the id used for the pixel.
 */
export const NGX_PIXEL_ID: InjectionToken<string> = new InjectionToken<string>(
    'Provider for the id used for the pixel.',
    {
        providedIn: 'root',
        factory: (() => {
            // eslint-disable-next-line no-console
            console.error(
                // eslint-disable-next-line stylistic/max-len
                'No pixel id has been provided for the token NGX_PIXEL_ID\nAdd this to your app.module.ts provider array:\n{\n    provide: NGX_PIXEL_ID,\n    useValue: \'myPixelId\'\n}'
            );
        }) as () => string
    }
);

declare let fbq: Function;

/**
 * Service that provides meta(facebook) pixel out of the box.
 */
@Injectable({ providedIn: 'root' })
export class PixelService extends BaseTrackingService<BaseTrackingMetadata> {
    override readonly METADATA_LOCATION: 'localStorage' | 'sessionStorage' | 'cookie' = 'cookie';
    override readonly METADATA_KEY: string = 'facebookPixel';
    override readonly GDPR_CATEGORY: GdprCategory = GdprCategory.DISABLED_BY_DEFAULT;
    /**
     * The pixel id.
     */
    readonly PIXEL_ID: string;
    /**
     * The css id of the pixel script inside the html.
     */
    readonly PIXEL_SCRIPT_ID: string = 'pixel-script';
    private readonly scriptService: ScriptService;
    private isLoaded: boolean = false;

    constructor(router: Router) {
        super(router, { enabled: false }, inject(PLATFORM_ID));
        this.PIXEL_ID = inject(NGX_PIXEL_ID);
        this.scriptService = inject(ScriptService);
    }

    override async enable(): Promise<void> {
        super.enable();
        await this.loadPixelScript();
    }

    /**
     * Adds the Facebook Pixel tracking script to the application.
     */
    protected async loadPixelScript(): Promise<void> {
        try {
            await this.scriptService.loadPermanentJsScript(
                `
                    var pixelCode = function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${this.PIXEL_ID}');
                    fbq('track', 'PageView');
                `,
                undefined,
                'head',
                this.PIXEL_SCRIPT_ID
            );
            this.isLoaded = true;
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Failed to load Pixel Script with PIXEL_ID ${this.PIXEL_ID}`);
            this.disable();
        }
    }

    override disable(): void {
        super.disable();
        this.scriptService.removeScriptById(this.PIXEL_SCRIPT_ID);
        this.isLoaded = false;
    }

    override onNavigationEnd(): void {
        if (this.metadata.enabled) {
            void this.trackEvent('track', 'PageView');
        }
    }

    /**
     * Tracks an event with the pixel.
     * @param method - Either 'track' or 'customTrack'.
     * @param eventName - The name of the event.
     * @param properties - Any additional properties that should be added to the event.
     */
    async trackEvent(
        method: 'track' | 'trackCustom',
        eventName: PixelEventName | string,
        properties?: PixelEventProperties
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isLoaded) {
                fbq(method, eventName, properties);
                resolve();
                return;
            }
            this.loadPixelScript()
                // eslint-disable-next-line promise/prefer-await-to-then
                .then(() => {
                    fbq(method, eventName, properties);
                    resolve();
                })
                // eslint-disable-next-line promise/prefer-await-to-then, promise/prefer-await-to-callbacks
                .catch(error => reject(error));
        });
    }
}