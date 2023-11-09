import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdprDialogComponent } from './gdpr-dialog.component';

describe('GdprDialogComponent', () => {
    let component: GdprDialogComponent;
    let fixture: ComponentFixture<GdprDialogComponent>;

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