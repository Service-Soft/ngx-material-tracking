import { PercentPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { FunnelPoint } from '../../models/funnel-point.model';

/**
 * A component that visualizes tracking statistics of a funnel.
 */
@Component({
    selector: 'ngx-mat-tracking-funnel',
    templateUrl: './funnel.component.html',
    styleUrls: ['./funnel.component.scss'],
    standalone: true,
    imports: [PercentPipe]
})
export class FunnelComponent {

    /**
     * The title of the funnel. Is displayed above.
     * @default 'Funnel'
     */
    @Input()
    title: string = 'Funnel';

    /**
     * The colors to use for the funnel points.
     * @default 5 blue colors.
     */
    @Input()
    colors: string[] = ['#00b4d8', '#1c99c5', '#388eb3', '#5473a1', '#0e456f'];

    /**
     * The funnel points to display.
     */
    @Input({ required: true })
    funnelPoints!: FunnelPoint[];

    private get firstFunnelPointValue(): number {
        return this.funnelPoints[0].value;
    }

    constructor() { }

    /**
     * Calculates the width for the given funnel point.
     * @param funnelPoint - The funnel point to get the width for.
     * @returns A percentage number.
     */
    getWidthForFunnelPoint(funnelPoint: FunnelPoint): number {
        return funnelPoint.value / this.firstFunnelPointValue;
    }

    /**
     * Gets the css clip-path value for the given funnel point.
     * @param funnelPoint - The funnel point to get the clip path for.
     * @param index - The index of the funnel point.
     * @returns The css clip path value.
     */
    getClipPathForFunnelPoint(funnelPoint: FunnelPoint, index: number): string {
        if (index === this.funnelPoints.length - 1) {
            return '';
        }
        // wie viel kleiner ist der nächste Punkt? Das durch zwei und jeweils addieren/abziehen
        const nextFunnelPoint: FunnelPoint = this.funnelPoints[index + 1];
        const nextFunnelPointWidth: number = nextFunnelPoint.value / this.firstFunnelPointValue;
        const currentFunnelPointWidth: number = funnelPoint.value / this.firstFunnelPointValue;

        const difference: number = ((currentFunnelPointWidth - nextFunnelPointWidth) / currentFunnelPointWidth) * 100;

        const valueRight: number = 100 - (difference / 2);
        const valueLeft: number = difference / 2;
        return `polygon(0 0, 100% 0, ${valueRight}% 100%, ${valueLeft}% 100%)`;
    }
}