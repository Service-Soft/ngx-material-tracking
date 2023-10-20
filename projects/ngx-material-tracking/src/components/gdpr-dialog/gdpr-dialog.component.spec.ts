/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseTrackingMetadata } from '../../services/tracking/base-tracking.service';

import { GdprDialogComponent } from './gdpr-dialog.component';

describe('GdprDialogComponent', () => {
    let component: GdprDialogComponent<BaseTrackingMetadata>;
    let fixture: ComponentFixture<GdprDialogComponent<BaseTrackingMetadata>>;

    beforeEach(async(() => {
        void TestBed.configureTestingModule({
            declarations: [ GdprDialogComponent ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GdprDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});