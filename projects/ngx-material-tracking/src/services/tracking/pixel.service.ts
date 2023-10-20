import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { PixelEventName, PixelEventProperties } from '../../models/facebook-pixel.model';
import { GdprCategory } from '../../models/gdpr-category.enum';
import { ScriptService } from '../script.service';
import { BaseTrackingMetadata, BaseTrackingService } from './base-tracking.service';

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
    private readonly platformId: Object;

    constructor(router: Router) {
        super(router, { enabled: false });
        this.PIXEL_ID = inject(NGX_PIXEL_ID);
        this.platformId = inject(PLATFORM_ID);
    }


    override enable(): void {
        super.enable();
        this.loadPixelScript();
    }

    /**
     * Adds the Facebook Pixel tracking script to the application.
     */
    protected loadPixelScript(): void {
        const scriptService: ScriptService = inject(ScriptService);
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


    override disable(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        super.disable();
        document.getElementById(this.PIXEL_SCRIPT_ID)?.remove();
    }

    override onNavigationEnd(): void {
        if (this.metadata.enabled) {
            this.trackEvent('track', 'PageView');
        }
    }

    /**
     * Tracks an event with the pixel.
     * @param method - Either 'track' or 'customTrack'.
     * @param eventName - The name of the event.
     * @param properties - Any additional properties that should be added to the event.
     */
    trackEvent(method: 'track' | 'trackCustom', eventName: PixelEventName | string, properties?: PixelEventProperties): void {
        fbq(method, eventName, properties);
    }
}