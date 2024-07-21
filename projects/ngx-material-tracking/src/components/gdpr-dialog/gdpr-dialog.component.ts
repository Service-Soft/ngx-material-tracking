import { CommonModule } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faChevronUp, faClose } from '@fortawesome/free-solid-svg-icons';

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
        MatButtonModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatExpansionModule,
        MatCheckboxModule,
        FaIconComponent
    ]
})
export class GdprDialogComponent implements OnInit {

    // eslint-disable-next-line jsdoc/require-jsdoc
    faClose: IconDefinition = faClose;
    // eslint-disable-next-line jsdoc/require-jsdoc
    faChevronDown: IconDefinition = faChevronDown;
    // eslint-disable-next-line jsdoc/require-jsdoc
    faChevronUp: IconDefinition = faChevronUp;

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

    /**
     * Whether or not the technical necessary tracking services are opened.
     */
    technicalNecessaryOpened!: boolean;
    /**
     * Whether or not the enabled by default tracking services are opened.
     */
    enabledByDefaultOpened!: boolean;
    /**
     * Whether or not the disabled by default tracking services are opened.
     */
    disabledByDefaultOpened!: boolean;

    // eslint-disable-next-line jsdoc/require-returns
    /**
     * Whether or not all enabled by default trackings are enabled.
     */
    get allEnabledByDefaultEnabled(): boolean {
        return !this.enabledByDefaultTrackings.find(t => {
            const trackingService: BaseTrackingService<BaseTrackingMetadata> = this.injector.get<BaseTrackingService<BaseTrackingMetadata>>(
                t.TrackingServiceClass
            );
            return !trackingService.metadata.enabled;
        });
    }

    // eslint-disable-next-line jsdoc/require-returns
    /**
     * Whether or not some of the enabled by default trackings are enabled.
     */
    get someEnabledByDefaultEnabled(): boolean {
        return !!this.enabledByDefaultTrackings.find(t => {
            const trackingService: BaseTrackingService<BaseTrackingMetadata> = this.injector.get<BaseTrackingService<BaseTrackingMetadata>>(
                t.TrackingServiceClass
            );
            return trackingService.metadata.enabled;
        })
        && !!this.enabledByDefaultTrackings.find(t => {
            const trackingService: BaseTrackingService<BaseTrackingMetadata> = this.injector.get<BaseTrackingService<BaseTrackingMetadata>>(
                t.TrackingServiceClass
            );
            return !trackingService.metadata.enabled;
        });
    }

    // eslint-disable-next-line jsdoc/require-returns
    /**
     * Whether or not all disabled by default trackings are enabled.
     */
    get allDisabledByDefaultEnabled(): boolean {
        return !this.disabledByDefaultTrackings.find(t => {
            const trackingService: BaseTrackingService<BaseTrackingMetadata> = this.injector.get<BaseTrackingService<BaseTrackingMetadata>>(
                t.TrackingServiceClass
            );
            return !trackingService.metadata.enabled;
        });
    }

    // eslint-disable-next-line jsdoc/require-returns
    /**
     * Whether or not some of the disabled by default trackings are enabled.
     */
    get someDisabledByDefaultEnabled(): boolean {
        return !!this.disabledByDefaultTrackings.find(t => {
            const trackingService: BaseTrackingService<BaseTrackingMetadata> = this.injector.get<BaseTrackingService<BaseTrackingMetadata>>(
                t.TrackingServiceClass
            );
            return trackingService.metadata.enabled;
        })
        && !!this.disabledByDefaultTrackings.find(t => {
            const trackingService: BaseTrackingService<BaseTrackingMetadata> = this.injector.get<BaseTrackingService<BaseTrackingMetadata>>(
                t.TrackingServiceClass
            );
            return !trackingService.metadata.enabled;
        });
    }

    constructor(
        @Inject(NGX_GDPR_SERVICE)
        readonly gdprService: GdprService,
        private readonly dialogRef: MatDialogRef<GdprDialogComponent>,
        private readonly injector: Injector,
        @Inject(MAT_DIALOG_DATA)
        private readonly dialogData?: GdprDialogData
    ) { }

    ngOnInit(): void {
        this.gdprDialogData = new GdprDialogDataInternal(this.dialogData);
        this.technicalNecessaryOpened = this.gdprDialogData.categoriesOpenedByDefault ? true : false;
        this.enabledByDefaultOpened = this.gdprDialogData.categoriesOpenedByDefault ? true : false;
        this.disabledByDefaultOpened = this.gdprDialogData.categoriesOpenedByDefault ? true : false;
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
     * Checks whether the given tracking is enabled.
     * @param tracking - The tracking to check.
     * @returns Whether or not the tracking is enabled.
     */
    isTrackingEnabled<TrackingMetadata extends BaseTrackingMetadata>(tracking: Tracking<TrackingMetadata>): boolean {
        return this.injector.get<BaseTrackingService<TrackingMetadata>>(tracking.TrackingServiceClass).metadata.enabled;
    }

    /**
     * Allows the usage of all tracking services.
     */
    allowAll(): void {
        this.gdprService.enableAllTrackings();
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
     * Toggle a single tracking service.
     * @param tracking - The tracking to toggle.
     */
    toggleTracking<TrackingMetadata extends BaseTrackingMetadata>(tracking: Tracking<TrackingMetadata>): void {
        const trackingService: BaseTrackingService<TrackingMetadata> = this.injector.get<BaseTrackingService<TrackingMetadata>>(
            tracking.TrackingServiceClass
        );
        if (trackingService.metadata.enabled) {
            trackingService.disable();
            return;
        }
        trackingService.enable();
    }

    /**
     * Toggles all enabled by default trackings.
     */
    toggleEnabledByDefaultTrackings(): void {
        if (this.allEnabledByDefaultEnabled) {
            for (const tracking of this.enabledByDefaultTrackings) {
                // eslint-disable-next-line stylistic/max-len
                const trackingService: BaseTrackingService<BaseTrackingMetadata> = this.injector.get<BaseTrackingService<BaseTrackingMetadata>>(
                    tracking.TrackingServiceClass
                );
                trackingService.disable();
            }
            return;
        }
        for (const tracking of this.enabledByDefaultTrackings) {
            const trackingService: BaseTrackingService<BaseTrackingMetadata> = this.injector.get<BaseTrackingService<BaseTrackingMetadata>>(
                tracking.TrackingServiceClass
            );
            trackingService.enable();
        }
    }

    /**
     * Toggles all disabled by default trackings.
     */
    toggleDisabledByDefaultTrackings(): void {
        if (this.allDisabledByDefaultEnabled) {
            for (const tracking of this.disabledByDefaultTrackings) {
                // eslint-disable-next-line stylistic/max-len
                const trackingService: BaseTrackingService<BaseTrackingMetadata> = this.injector.get<BaseTrackingService<BaseTrackingMetadata>>(
                    tracking.TrackingServiceClass
                );
                trackingService.disable();
            }
            return;
        }
        for (const tracking of this.disabledByDefaultTrackings) {
            const trackingService: BaseTrackingService<BaseTrackingMetadata> = this.injector.get<BaseTrackingService<BaseTrackingMetadata>>(
                tracking.TrackingServiceClass
            );
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