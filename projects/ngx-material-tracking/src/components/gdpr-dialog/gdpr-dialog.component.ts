import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import { GdprCategorySectionComponent } from './gdpr-category-section/gdpr-category-section.component';
import { GdprCategory } from '../../models/gdpr-category.enum';
import { GdprDialogDataInternal } from '../../models/gdpr-dialog-data-internal.model';
import { GdprDialogData } from '../../models/gdpr-dialog-data.model';
import { Tracking } from '../../models/tracking.model';
import { GdprService, NGX_GDPR_SERVICE } from '../../services/gdpr.service';
import { BaseTrackingMetadata, BaseTrackingService } from '../../services/tracking/base-tracking.service';

/**
 * Dialog that handles consent to tracking services to stay gdpr compliant.
 */
@Component({
    selector: 'ngx-mat-tracking-gdpr-dialog',
    templateUrl: './gdpr-dialog.component.html',
    styleUrls: ['./gdpr-dialog.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        FaIconComponent,
        GdprCategorySectionComponent
    ]
})
export class GdprDialogComponent implements OnInit {

    // eslint-disable-next-line jsdoc/require-jsdoc
    faClose: IconDefinition = faClose;

    /**
     * The internal gdpr dialog data. Built from config provided by the user and default values.
     */
    gdprDialogData!: GdprDialogDataInternal;

    /**
     * All tracking services that are technical necessary and cannot be disabled.
     */
    technicalNecessaryTrackings!: Tracking[];

    /**
     * All tracking services that are enabled by default but can be disabled.
     */
    enabledByDefaultTrackings!: Tracking[];

    /**
     * All tracking services that are optional and disabled by default.
     */
    disabledByDefaultTrackings!: Tracking[];

    constructor(
        @Inject(NGX_GDPR_SERVICE)
        readonly gdprService: GdprService,
        private readonly dialogRef: DialogRef<GdprDialogComponent>,
        private readonly injector: Injector,
        @Inject(DIALOG_DATA)
        private readonly dialogData?: GdprDialogData
    ) { }

    ngOnInit(): void {
        this.gdprDialogData = new GdprDialogDataInternal(this.dialogData);
        this.technicalNecessaryTrackings = this.gdprService.trackings.filter(t => {
            const trackingCategory: GdprCategory = this.injector.get<BaseTrackingService<BaseTrackingMetadata>>(
                t.TrackingServiceClass
            ).GDPR_CATEGORY;
            return trackingCategory === GdprCategory.TECHNICAL_NECESSARY;
        });
        this.enabledByDefaultTrackings = this.gdprService.trackings.filter(t => {
            const trackingCategory: GdprCategory = this.injector.get<BaseTrackingService<BaseTrackingMetadata>>(
                t.TrackingServiceClass
            ).GDPR_CATEGORY;
            return trackingCategory === GdprCategory.ENABLED_BY_DEFAULT;
        });
        this.disabledByDefaultTrackings = this.gdprService.trackings.filter(t => {
            const trackingCategory: GdprCategory = this.injector.get<BaseTrackingService<BaseTrackingMetadata>>(
                t.TrackingServiceClass
            ).GDPR_CATEGORY;
            return trackingCategory === GdprCategory.DISABLED_BY_DEFAULT;
        });
    }

    /**
     * Allows the usage of all tracking services.
     */
    async allowAll(): Promise<void> {
        await this.gdprService.enableAllTrackings();
        this.gdprService.hasMadeGdprChoices = true;
        this.close();
    }

    /**
     * Disallows the usage of all not necessary tracking services.
     */
    disallowAll(): void {
        this.gdprService.disableAllTrackings();
        this.gdprService.hasMadeGdprChoices = true;
        this.close();
    }

    /**
     * Saves the currently selected settings (Simply closes the dialog).
     */
    saveSettings(): void {
        this.gdprService.hasMadeGdprChoices = true;
        this.close();
    }

    /**
     * Closes the dialog.
     */
    protected close(): void {
        this.dialogRef.close();
    }
}