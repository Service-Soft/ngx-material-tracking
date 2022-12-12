/**
 * Contains base information about a website visit that should be tracked.
 */
export interface TrackingVisit {
    /**
     * Whether or not this is the first time that the visitor is on this website.
     */
    firstVisit: boolean,
    /**
     * The url from which the visitor has come to this website.
     */
    referrer: string,
    /**
     * The site that the visitor tries to access.
     */
    targetSite: string,
    /**
     * The current domain.
     */
    domain: string
}