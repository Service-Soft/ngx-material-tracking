import { CommonModule } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GdprCategory } from '../../models/gdpr-category.enum';
import { GdprDialogDataInternal } from '../../models/gdpr-dialog-data-internal.model';
import { GdprDialogData } from '../../models/gdpr-dialog-data.model';
import { Tracking } from '../../models/tracking.model';
import { BaseTrackingMetadata, BaseTrackingService } from '../../services/base-tracking.service';
import { GdprService, NGX_GDPR_SERVICE } from '../../services/gdpr.service';

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
        MatButtonModule,
        MatSlideToggleModule,
        MatExpansionModule
    ]
})
export class GdprDialogComponent<TrackingMetadata extends BaseTrackingMetadata> implements OnInit {

    gdprDialogData!: GdprDialogDataInternal;

    technicalNecessaryTrackings!: Tracking<TrackingMetadata>[];
    enabledByDefaultTrackings!: Tracking<TrackingMetadata>[];
    disabledByDefaultTrackings!: Tracking<TrackingMetadata>[];

    constructor(
        @Inject(NGX_GDPR_SERVICE)
        readonly gdprService: GdprService<TrackingMetadata>,
        private readonly dialogRef: MatDialogRef<GdprDialogComponent<TrackingMetadata>>,
        private readonly injector: Injector,
        @Inject(MAT_DIALOG_DATA)
        private readonly dialogData?: GdprDialogData
    ) { }

    ngOnInit(): void {
        this.dialogRef.disableClose = true;
        this.gdprDialogData = new GdprDialogDataInternal(this.dialogData);
        this.technicalNecessaryTrackings = this.gdprService.trackings.filter(t => {
            // eslint-disable-next-line max-len
            const trackingCategory: GdprCategory = this.injector.get<BaseTrackingService<TrackingMetadata>>(t.TrackingServiceClass).GDPR_CATEGORY;
            return trackingCategory === GdprCategory.TECHNICAL_NECESSARY;
        });
        this.enabledByDefaultTrackings = this.gdprService.trackings.filter(t => {
            // eslint-disable-next-line max-len
            const trackingCategory: GdprCategory = this.injector.get<BaseTrackingService<TrackingMetadata>>(t.TrackingServiceClass).GDPR_CATEGORY;
            return trackingCategory === GdprCategory.ENABLED_BY_DEFAULT;
        });
        this.disabledByDefaultTrackings = this.gdprService.trackings.filter(t => {
            // eslint-disable-next-line max-len
            const trackingCategory: GdprCategory = this.injector.get<BaseTrackingService<TrackingMetadata>>(t.TrackingServiceClass).GDPR_CATEGORY;
            return trackingCategory === GdprCategory.DISABLED_BY_DEFAULT;
        });
    }

    /**
     * Checks whether the given tracking is enabled.
     *
     * @param tracking - The tracking to check.
     * @returns Whether or not the tracking is enabled.
     */
    isTrackingEnabled(tracking: Tracking<TrackingMetadata>): boolean {
        return this.injector.get<BaseTrackingService<TrackingMetadata>>(tracking.TrackingServiceClass).metadata.enabled;
    }

    /**
     * Allows the usage of all tracking services.
     */
    allowAll(): void {
        this.gdprService.enableAllTrackings();
        this.close();
    }

    /**
     * Disallows the usage of all not necessary tracking services.
     */
    disallowAll(): void {
        this.gdprService.disableAllTrackings();
        this.close();
    }

    /**
     * Saves the currently selected settings (Simply closes the dialog).
     */
    saveSettings(): void {
        this.close();
    }

    /**
     * Toggle a single tracking service.
     *
     * @param tracking - The tracking to toggle.
     */
    toggleTracking(tracking: Tracking<TrackingMetadata>): void {
        const trackingService: BaseTrackingService<TrackingMetadata> = this.injector.get<BaseTrackingService<TrackingMetadata>>(
            tracking.TrackingServiceClass
        );
        if (trackingService.metadata.enabled) {
            trackingService.disable();
        }
        else {
            trackingService.enable();
        }
    }

    /**
     * Closes the dialog.
     */
    protected close(): void {
        this.dialogRef.close();
    }
}