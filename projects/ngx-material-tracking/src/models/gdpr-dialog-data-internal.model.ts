/* eslint-disable jsdoc/require-jsdoc */
import { GdprDialogData } from './gdpr-dialog-data.model';

/**
 * The internal gdpr dialog data. Sets default values.
 */
export class GdprDialogDataInternal implements GdprDialogData {

    title: string;
    text: string;
    allowAllButtonLabel: string;
    disallowAllButtonLabel: string;
    saveSettingsButtonLabel: string;
    displayCloseAllowsAll: boolean;
    technicalNecessaryTitle: string;
    enabledByDefaultTitle: string;
    disabledByDefaultTitle: string;
    privacyDisplayName: string;
    privacyRoute: string;
    imprintDisplayName: string;
    imprintRoute: string;

    constructor(data?: GdprDialogData) {
        this.title = data?.title ?? 'Tracking';
        this.allowAllButtonLabel = data?.allowAllButtonLabel ?? 'Allow all';
        this.disallowAllButtonLabel = data?.disallowAllButtonLabel ?? 'Only required';
        this.saveSettingsButtonLabel = data?.saveSettingsButtonLabel ?? 'Save';
        this.displayCloseAllowsAll = data?.displayCloseAllowsAll ?? true;
        this.technicalNecessaryTitle = data?.technicalNecessaryTitle ?? 'Technical necessary';
        this.enabledByDefaultTitle = data?.enabledByDefaultTitle ?? 'Analytics';
        this.disabledByDefaultTitle = data?.disabledByDefaultTitle ?? 'Marketing';
        this.privacyDisplayName = data?.privacyDisplayName ?? 'Privacy';
        this.privacyRoute = data?.privacyRoute ?? 'privacy';
        this.imprintDisplayName = data?.imprintDisplayName ?? 'Imprint';
        this.imprintRoute = data?.imprintRoute ?? 'imprint';

        this.text = data?.text ?? `
            <p>
                Our site uses technologies such as cookies to improve your user experience and analyze our traffic.
                <br>
                More information can be found under <a target="_blank" rel="noopener noreferrer" href="${this.privacyRoute}">${this.privacyDisplayName}</a>.
            </p>
            <p>
                Down below you can configure what services to enable.
                <br>
                If you change your mind you can always return here and update your preferences.
            </p>
        `;
    }
}