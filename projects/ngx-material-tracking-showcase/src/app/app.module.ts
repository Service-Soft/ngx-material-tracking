import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleAnalyticsService, NGX_GDPR_TRACKINGS, NGX_GOOGLE_ANALYTICS_ID, Tracking } from 'ngx-material-tracking';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InternalAnalyticsService } from './services/internal-analytics.service';

const trackings: Tracking[] = [
    // {
    //     name: 'Malicious Usage Detection',
    //     description: 'This is required to detect malicious usage of this website.',
    //     gdprCategory: GdprCategory.TECHNICAL_NECESSARY,
    //     enabled: () => true,
    //     enable: () => {},
    //     disable: () => {}
    // },
    {
        name: 'Internal Analytics',
        description: 'This is used to track your navigation over the website.',
        TrackingServiceClass: InternalAnalyticsService
    },
    {
        name: 'Google',
        description: 'This is a third party tracking service.',
        TrackingServiceClass: GoogleAnalyticsService
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatButtonModule,
        MatDialogModule,
        HttpClientModule
    ],
    providers: [
        {
            provide: NGX_GDPR_TRACKINGS,
            useValue: trackings
        },
        {
            provide: NGX_GOOGLE_ANALYTICS_ID,
            useValue: 'test123'
        },
        {
            provide: APP_INITIALIZER,
            useFactory: () => {
                return () => {};
            },
            deps: [GoogleAnalyticsService, InternalAnalyticsService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }