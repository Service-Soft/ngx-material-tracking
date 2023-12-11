/**
 * The class of the gdpr dialog panel.
 * Can be used for styling without affecting other components.
 * @constant 'gdpr-dialog-panel-class'
 */
export const GDPR_DIALOG_PANEL_CLASS: string = 'gdpr-dialog-panel-class';

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
     * The html content to display before the configuration sliders start.
     */
    text?: string,
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
     * Whether or not a cross should be displayed at the top right corner to allow all tracking.
     * @default true
     */
    displayCloseAllowsAll?: boolean,
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
    disabledByDefaultTitle?: string,
    /**
     * The display name for the privacy link.
     * @default 'Privacy'
     */
    privacyDisplayName?: string,
    /**
     * The privacy route.
     * @default 'privacy'
     */
    privacyRoute?: string,
    /**
     * The display name for the imprint link.
     * @default 'Imprint'
     */
    imprintDisplayName?: string,
    /**
     * The imprint route.
     * @default 'imprint'
     */
    imprintRoute?: string,
    /**
     * Whether or not only categories and not the specific tracking services should be shown.
     */
    showOnlyCategories?: boolean,
    /**
     * Whether or not the categories should be opened when the dialog is opened.
     */
    categoriesOpenedByDefault?: boolean
}