import { NavigationEnd, Router } from '@angular/router';
import { GdprCategory } from '../../models/gdpr-category.enum';
import { cookieStorage } from '../../utilities/cookie-storage.utilities';

/**
 * The base information for any tracking data.
 */
export interface BaseTrackingMetadata {
    /**
     * Whether this tracking is enabled (was accepted by the user).
     */
    enabled: boolean,
    /**
     * When this data has been created.
     */
    createdAt: Date
}

/**
 * The base service for any tracking.
 */
export abstract class BaseTrackingService<TrackingMetadata extends BaseTrackingMetadata> {

    /**
     * Where the metadata about this tracking is saved.
     */
    abstract readonly METADATA_LOCATION: 'localStorage' | 'sessionStorage' | 'cookie';

    /**
     * The key under which the metadata is saved.
     */
    abstract readonly METADATA_KEY: string;

    /**
     * The category of the tracking service.
     */
    abstract readonly GDPR_CATEGORY: GdprCategory;

    /**
     * The default value of the metadata.
     */
    metadataDefaultValue: Omit<TrackingMetadata, 'createdAt'>;

    // eslint-disable-next-line jsdoc/require-jsdoc
    get metadata(): TrackingMetadata {
        switch (this.METADATA_LOCATION) {
            case 'localStorage':
                return this.getMetadataFromLocalStorage();
            case 'sessionStorage':
                return this.getMetadataFromSessionStorage();
            case 'cookie':
                return this.getMetadataFromCookie();
        }
    }


    /**
     * Any locally stored data of this tracking service.
     */
    set metadata(value: TrackingMetadata) {
        value.createdAt = value.createdAt ?? new Date();
        switch (this.METADATA_LOCATION) {
            case 'localStorage':
                localStorage.setItem(this.METADATA_KEY, JSON.stringify(value));
                break;
            case 'sessionStorage':
                sessionStorage.setItem(this.METADATA_KEY, JSON.stringify(value));
                break;
            case 'cookie':
                cookieStorage.setItem(this.METADATA_KEY, JSON.stringify(value));
                break;
        }
    }

    constructor(private readonly router: Router, metadataDefaultValue: Omit<TrackingMetadata, 'createdAt'>) {
        this.metadataDefaultValue = metadataDefaultValue;
        this.initNavigationTracking();
    }

    /**
     * Enables the tracking.
     * By default this simply sets the metadata to enabled.
     */
    enable(): void {
        if (!this.metadata.enabled) {
            this.metadata = { ...this.metadata, enabled: true };
        }
    }

    /**
     * Disables the tracking.
     * By default this sets the default metadata and '{ enabled: false }'.
     */
    disable(): void {
        if (this.metadata.enabled && this.GDPR_CATEGORY !== GdprCategory.TECHNICAL_NECESSARY) {
            this.setDefaultMetadata();
            this.metadata = { ...this.metadata, enabled: false };
        }
    }

    /**
     * Initializes the navigation tracking by subscribing to router events.
     */
    initNavigationTracking(): void {
        this.router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                this.onNavigationEnd(e);
            }
        });
    }

    /**
     * This method is run whenever the user navigates.
     * It can be used to track visits over the website etc.
     */
    abstract onNavigationEnd(event: NavigationEnd): void;

    /**
     * Gets the metadata from a cookie.
     * If no metadata could be found this sets default values.
     * @returns The currently saved tracking metadata.
     */
    protected getMetadataFromCookie(): TrackingMetadata {
        if (!cookieStorage.getItem(this.METADATA_KEY)) {
            this.setDefaultMetadata();
        }
        return JSON.parse(cookieStorage.getItem(this.METADATA_KEY) as string) as TrackingMetadata;
    }

    /**
     * Gets the metadata from sessionStorage.
     * If no metadata could be found this sets default values.
     * @returns The currently saved tracking metadata.
     */
    protected getMetadataFromSessionStorage(): TrackingMetadata {
        if (!sessionStorage.getItem(this.METADATA_KEY)) {
            this.setDefaultMetadata();
        }
        return JSON.parse(sessionStorage.getItem(this.METADATA_KEY) as string) as TrackingMetadata;
    }

    /**
     * Gets the metadata from localStorage.
     * If no metadata could be found this sets default values.
     * @returns The currently saved tracking metadata.
     */
    protected getMetadataFromLocalStorage(): TrackingMetadata {
        if (!localStorage.getItem(this.METADATA_KEY)) {
            this.setDefaultMetadata();
        }
        return JSON.parse(localStorage.getItem(this.METADATA_KEY) as string) as TrackingMetadata;
    }

    /**
     * Sets the default metadata.
     */
    setDefaultMetadata(): void {
        (this.metadata as BaseTrackingMetadata) = { ...this.metadataDefaultValue, createdAt: new Date() };
    }
}