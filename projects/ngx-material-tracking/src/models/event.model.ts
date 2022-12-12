/**
 * Contains base information about an event like a purchase etc. That should be tracked.
 */
export interface TrackingEvent {
    /**
     * The name of the event.
     */
    name: string,
    /**
     * The category of the event.
     */
    category: string,
    /**
     * The url from which the visitor has come to this website.
     */
    referrer: string,
    /**
     * The current domain.
     */
    domain: string
}