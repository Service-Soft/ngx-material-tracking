/* eslint-disable angular/component-selector */
import { Component } from '@angular/core';
import { FunnelComponent, FunnelPoint } from 'ngx-material-tracking';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [FunnelComponent]
})
export class HomeComponent {
    funnelPoints: FunnelPoint[] = [
        {
            name: 'Visits',
            value: 30
        },

        {
            name: 'AddToCart',
            value: 20
        },
        {
            name: 'Purchase',
            value: 10
        }
    ];
}