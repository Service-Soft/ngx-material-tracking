import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelComponent } from './funnel.component';

describe('FunnelComponent', () => {
    let fixture: ComponentFixture<FunnelComponent>;
    let component: FunnelComponent;

    beforeEach(() => {
        fixture = TestBed.createComponent(FunnelComponent);
        component = fixture.componentInstance;
        fixture.autoDetectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeDefined();
    });
});