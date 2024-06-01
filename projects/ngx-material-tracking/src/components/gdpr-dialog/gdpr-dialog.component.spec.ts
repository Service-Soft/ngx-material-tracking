import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { GdprDialogComponent } from './gdpr-dialog.component';
import { GdprDialogData } from '../../models/gdpr-dialog-data.model';
import { GdprService } from '../../services/gdpr.service';

const mockGdprService: Partial<GdprService> = {
    trackings: []
};

const data: GdprDialogData = {};

describe('GdprDialogComponent', () => {
    let fixture: ComponentFixture<GdprDialogComponent>;
    let component: GdprDialogComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: undefined
                },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: data
                },
                {
                    provide: GdprService,
                    useValue: mockGdprService
                }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(GdprDialogComponent);
        component = fixture.componentInstance;
        fixture.autoDetectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeDefined();
    });
});