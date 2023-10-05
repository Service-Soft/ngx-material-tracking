import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TrackingEvent } from '../models/event.model';
import { TrackingVisit } from '../models/visit.model';
import { cookieStorage } from '../utilities/cookie-storage.utilities';
import { BaseTrackingMetadata, BaseTrackingService } from './base-tracking.service';

/**
 * The base tracking metadata type for custom tracking services.
 * Contains a date that specifies the first visit of the user.
 */
export interface BaseCustomTrackingMetadata extends BaseTrackingMetadata {
    /**
     * The timestamp at which the user first visited this site.
     * Is reset every 30 days.
     */
    firstVisit: Date
}

/**
 * Base class for implementing your own tracking.
 */
export abstract class CustomTrackingService<
    TrackingMetadata extends BaseCustomTrackingMetadata,
    TrackingVisitType extends TrackingVisit,
    TrackingEventType extends TrackingEvent
> extends BaseTrackingService<TrackingMetadata> {

    /**
     * The domain for which any tracking should be done.
     */
    abstract readonly DOMAIN: string;

    /**
     * The url to which website visits should be sent.
     */
    abstract readonly VISIT_API_URL: string;

    /**
     * The url to which events should be sent.
     */
    abstract readonly EVENT_API_URL: string;

    readonly METADATA_LOCATION: 'localStorage' | 'sessionStorage' | 'cookie' = 'localStorage';

    /**
     * The duration after which a visit is counted as new.
     *
     * @default 2629746000 // (1 month)
     */
    readonly FIRST_VISIT_DURATION_IN_MS: number = 2629746000;

    private readonly platformId: Object;

    // eslint-disable-next-line jsdoc/require-returns
    /**
     * Whether or not the visitor has already been on this website.
     */
    get firstVisit(): boolean {
        if (this.metadata.firstVisit == null) {
            this.metadata = { ...this.metadata, firstVisit: new Date() };
            return true;
        }

        const firstVisitInMs: number = new Date(this.metadata.firstVisit).getTime();
        if ((Date.now() - firstVisitInMs) > this.FIRST_VISIT_DURATION_IN_MS) {
            this.metadata = { ...this.metadata, firstVisit: new Date() };
            return true;
        }
        return false;
    }

    constructor(
        router: Router,
        private readonly http: HttpClient,
        metadataDefaultValue: Omit<TrackingMetadata, 'createdAt' | 'firstVisit'>
    ) {
        super(router, metadataDefaultValue as Omit<TrackingMetadata, 'createdAt'>);
        this.platformId = inject(PLATFORM_ID);
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected override getMetadataFromCookie(): TrackingMetadata {
        const res: TrackingMetadata = super.getMetadataFromCookie();
        const firstVisitInMs: number = new Date(res.firstVisit).getTime();
        if ((Date.now() - firstVisitInMs) > this.FIRST_VISIT_DURATION_IN_MS) {
            this.metadata = { ...res, firstVisit: new Date() };
        }
        return JSON.parse(cookieStorage.getItem(this.METADATA_KEY) as string) as TrackingMetadata;
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected override getMetadataFromLocalStorage(): TrackingMetadata {
        const res: TrackingMetadata = super.getMetadataFromLocalStorage();
        const firstVisitInMs: number = new Date(res.firstVisit).getTime();
        if ((Date.now() - firstVisitInMs) > this.FIRST_VISIT_DURATION_IN_MS) {
            this.metadata = { ...res, firstVisit: new Date() };
        }
        return JSON.parse(localStorage.getItem(this.METADATA_KEY) as string) as TrackingMetadata;
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected override getMetadataFromSessionStorage(): TrackingMetadata {
        const res: TrackingMetadata = super.getMetadataFromSessionStorage();
        const firstVisitInMs: number = new Date(res.firstVisit).getTime();
        if ((Date.now() - firstVisitInMs) > this.FIRST_VISIT_DURATION_IN_MS) {
            this.metadata = { ...res, firstVisit: new Date() };
        }
        return JSON.parse(sessionStorage.getItem(this.METADATA_KEY) as string) as TrackingMetadata;
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    override onNavigationEnd(event: NavigationEnd): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const visit: Omit<TrackingVisit, 'domain' | 'firstVisit'> = {
            referrer: this.formatUrl(document.referrer),
            targetSite: this.formatUrl(event.urlAfterRedirects)
        };
        this.trackVisit(visit as Omit<TrackingVisitType, 'domain' | 'firstVisit'>);
    }

    /**
     * Formats the given url.
     * By default this removes http:, https:, www., // and everything after ? Or #.
     *
     * @param url - The url to format.
     * @returns The formatted url.
     */
    protected formatUrl(url: string): string {
        if (!url.length || url.length === 1) {
            return '/';
        }
        return url.replace('https:', '')
            .replace('http:', '')
            .replace('www.', '')
            .replace('//', '')
            .split('?')[0]
            .split('#')[0];
    }

    /**
     * Tracks the visit of a specific page on the website.
     *
     * @param visit - Data about the visit.
     */
    trackVisit(visit: Omit<TrackingVisitType, 'domain' | 'firstVisit'>): void {
        if (this.metadata.enabled) {
            const reqBody: TrackingVisit = {
                ...visit,
                domain: this.DOMAIN,
                firstVisit: this.firstVisit
            };
            // eslint-disable-next-line no-console
            void firstValueFrom(this.http.post(this.VISIT_API_URL, reqBody)).catch(e => console.error(e));
        }
    }

    /**
     * Tracks a specific event that happened on the website.
     *
     * @param event - Data about the event.
     */
    trackEvent(event: Omit<TrackingEventType, 'domain'>): void {
        if (this.metadata.enabled) {
            const reqBody: TrackingEventType = {
                ...event,
                domain: this.DOMAIN
            } as TrackingEventType;
            // eslint-disable-next-line no-console
            void firstValueFrom(this.http.post(this.EVENT_API_URL, reqBody)).catch(e => console.error(e));
        }
    }
}