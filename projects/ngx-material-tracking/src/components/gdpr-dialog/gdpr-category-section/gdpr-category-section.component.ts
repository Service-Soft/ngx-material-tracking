/* eslint-disable jsdoc/require-jsdoc */
import { Component, Injector, Input, OnInit } from '@angular/core';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { Tracking } from '../../../models/tracking.model';
import { BaseTrackingMetadata, BaseTrackingService } from '../../../services/tracking/base-tracking.service';

type TrackingService = BaseTrackingService<BaseTrackingMetadata>;

@Component({
    selector: 'ngx-mat-tracking-gdpr-category-section',
    templateUrl: './gdpr-category-section.component.html',
    styleUrl: './gdpr-category-section.component.scss',
    standalone: true,
    imports: [FaIconComponent]
})
export class GdprCategorySectionComponent implements OnInit {

    faChevronDown: IconDefinition = faChevronDown;
    faChevronUp: IconDefinition = faChevronUp;

    @Input()
    disabled: boolean = false;

    @Input({ required: true })
    title!: string;

    @Input({ required: true })
    showOnlyCategories!: boolean;

    @Input({ required: true })
    trackings!: Tracking[];

    @Input({ required: true })
    opened!: boolean;

    readonly trackingServices: { tracking: Tracking, service: TrackingService }[] = [];

    get allEnabled(): boolean {
        return this.trackingServices.every(t => t.service.metadata.enabled);
    }

    get someEnabled(): boolean {
        return this.trackingServices.some(t => t.service.metadata.enabled)
            && this.trackingServices.some(t => !t.service.metadata.enabled);
    }

    constructor(private readonly injector: Injector) {}

    ngOnInit(): void {
        for (const tracking of this.trackings) {
            const service: TrackingService = this.injector.get<TrackingService>(tracking.TrackingServiceClass);
            this.trackingServices.push({ service, tracking });
        }
    }

    async toggleTracking(trackingService: TrackingService): Promise<void> {
        if (trackingService.metadata.enabled) {
            trackingService.disable();
            return;
        }
        await trackingService.enable();
    }

    async toggleEnableAll(): Promise<void> {
        if (this.disabled) {
            return;
        }
        if (this.allEnabled) {
            for (const tracking of this.trackingServices) {
                tracking.service.disable();
            }
            return;
        }
        for (const tracking of this.trackingServices) {
            await tracking.service.enable();
        }
    }
}