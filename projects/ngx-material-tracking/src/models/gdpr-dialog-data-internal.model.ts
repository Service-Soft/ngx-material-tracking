/* eslint-disable jsdoc/require-jsdoc */
import { GdprDialogData } from './gdpr-dialog-data.model';

/**
 * The internal gdpr dialog data. Sets default values.
 */
export class GdprDialogDataInternal implements GdprDialogData {

    title: string;
    allowAllButtonLabel: string;
    disallowAllButtonLabel: string;
    saveSettingsButtonLabel: string;
    technicalNecessaryTitle: string;
    enabledByDefaultTitle: string;
    disabledByDefaultTitle: string;

    constructor(data?: GdprDialogData) {
        this.title = data?.title ?? 'Tracking';
        this.allowAllButtonLabel = data?.allowAllButtonLabel ?? 'Allow all';
        this.disallowAllButtonLabel = data?.disallowAllButtonLabel ?? 'Disallow not required';
        this.saveSettingsButtonLabel = data?.saveSettingsButtonLabel ?? 'Save';
        this.technicalNecessaryTitle = data?.technicalNecessaryTitle ?? 'Technical necessary';
        this.enabledByDefaultTitle = data?.enabledByDefaultTitle ?? 'Analytics';
        this.disabledByDefaultTitle = data?.disabledByDefaultTitle ?? 'Marketing';
    }
}