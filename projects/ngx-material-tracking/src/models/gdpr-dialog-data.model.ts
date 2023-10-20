/**
 * The data for the gdpr-dialog.
 */
export interface GdprDialogData {
    /**
     * The title of the dialog.
     * @default 'Tracking'
     */
    title?: string,
    /**
     * The label for the button that allows all tracking.
     * @default 'Allow all'
     */
    allowAllButtonLabel?: string,
    /**
     * The label for the button that disallows all tracking.
     * @default 'Disallow all'
     */
    disallowAllButtonLabel?: string,
    /**
     * The label for the button that saves the currently selected tracking settings.
     * @default 'Configure'
     */
    saveSettingsButtonLabel?: string,
    /**
     * The title of the trackings that are technical necessary.
     * @default 'Technical necessary'
     */
    technicalNecessaryTitle?: string,
    /**
     * The title of the trackings that are enabled by default.
     * @default 'Analytics'
     */
    enabledByDefaultTitle?: string,
    /**
     * The title of the trackings that are disabled by default.
     * @default 'Marketing'
     */
    disabledByDefaultTitle?: string
}