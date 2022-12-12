/**
 * Contains the data needed to send a google analytics event.
 */
export interface GoogleAnalyticsEvent {
    /**
     * The name of the event.
     */
    name: string,
    /**
     * Any additional parameters. You can either define your own or use some from the
     * {@link https://developers.google.com/tag-platform/gtagjs/reference/events?hl=en| recommended events}.
     *
     * Please note that 'send_to' and 'anonymize_ip' are already set over their injection tokens. Setting them here has no effect.
     */
    additionalParameters: Record<string, unknown>[]
}