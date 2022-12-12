import { inject, Injectable, InjectionToken } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PixelEventName, PixelEventProperties } from '../models/facebook-pixel.model';
import { GdprCategory } from '../models/gdpr-category.enum';
import { BaseTrackingMetadata, BaseTrackingService } from './base-tracking.service';
import { ScriptService } from './script.service';

export const NGX_PIXEL_ID: InjectionToken<string> = new InjectionToken<string>(
    'Provider for the id used for the pixel.',
    {
        providedIn: 'root',
        factory: (() => {
            // eslint-disable-next-line no-console
            console.error(
                // eslint-disable-next-line max-len
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
    readonly METADATA_LOCATION: 'localStorage' | 'sessionStorage' | 'cookie' = 'cookie';
    readonly METADATA_KEY: string = 'facebookPixel';
    readonly GDPR_CATEGORY: GdprCategory = GdprCategory.DISABLED_BY_DEFAULT;
    readonly PIXEL_ID: string;
    readonly PIXEL_SCRIPT_ID: string = 'pixel-script';

    constructor(router: Router) {
        super(router);
        this.PIXEL_ID = inject(NGX_PIXEL_ID);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    override enable(): void {
        super.enable();
        this.loadPixelScript();
    }

    /**
     * Adds the Facebook Pixel tracking script to the application.
     */
    protected loadPixelScript(): void {
        const scriptService: ScriptService = inject(ScriptService);
        if (document.getElementById(this.PIXEL_SCRIPT_ID)) {
            return;
        }
        scriptService.loadPermanentJsScript(
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
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    override disable(): void {
        super.disable();
        document.getElementById(this.PIXEL_SCRIPT_ID)?.remove();
    }

    // eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-unused-vars
    onNavigationEnd(event: NavigationEnd): void {
        if (this.metadata.enabled) {
            this.trackEvent('track', 'PageView');
        }
    }

    /**
     * Tracks an event with the pixel.
     *
     * @param method - Either 'track' or 'customTrack'.
     * @param eventName - The name of the event.
     * @param properties - Any additional properties that should be added to the event.
     */
    trackEvent(method: 'track' | 'trackCustom', eventName: PixelEventName | string, properties?: PixelEventProperties): void {
        fbq(method, eventName, properties);
    }
}