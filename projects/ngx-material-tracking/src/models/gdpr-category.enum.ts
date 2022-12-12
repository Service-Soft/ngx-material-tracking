/**
 * The gdpr category of a tracking service.
 * Defines whether a service is technical necessary or enabled/disabled by default.
 */
export enum GdprCategory {
    TECHNICAL_NECESSARY = 'Technical Necessary',
    ENABLED_BY_DEFAULT = 'Enabled by default',
    DISABLED_BY_DEFAULT = 'Disabled by default'
}