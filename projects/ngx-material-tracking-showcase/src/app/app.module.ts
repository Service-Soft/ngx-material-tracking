import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GdprDialogData, GoogleAnalyticsService, GoogleTagManagerService, NGX_GDPR_DIALOG_DATA, NGX_GDPR_TRACKINGS, NGX_GOOGLE_ANALYTICS_ID, NGX_GOOGLE_TAG_MANAGER_ID, Tracking } from 'ngx-material-tracking';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InternalAnalyticsService } from './services/internal-analytics.service';

const trackings: Tracking[] = [
    // {
    //     name: 'Malicious Usage Detection',
    //     description: ['This is required to detect malicious usage of this website.'],
    //     TrackingServiceClass:
    // },
    {
        name: 'Internal Analytics',
        description: ['This is used to track your navigation over the website.'],
        TrackingServiceClass: InternalAnalyticsService
    },
    {
        name: 'Google',
        description: ['This is a third party tracking service.'],
        TrackingServiceClass: GoogleAnalyticsService
    },
    {
        name: 'GTM',
        description: ['Google Tag'],
        TrackingServiceClass: GoogleTagManagerService
    }
];

const gdprDialogData: GdprDialogData = {
    title: 'Custom title',
    allowAllButtonLabel: 'Custom allow all',
    disallowAllButtonLabel: 'Custom disallow all',
    saveSettingsButtonLabel: 'Custom save',
    technicalNecessaryTitle: 'Custom necessary',
    enabledByDefaultTitle: 'Custom functional',
    disabledByDefaultTitle: 'Custom tracking'
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule
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
            provide: NGX_GOOGLE_TAG_MANAGER_ID,
            useValue: 'test123'
        },
        {
            provide: NGX_GDPR_DIALOG_DATA,
            useValue: gdprDialogData
        },
        {
            provide: APP_INITIALIZER,
            useFactory: () => {
                return () => {};
            },
            deps: [GoogleAnalyticsService, InternalAnalyticsService, GoogleTagManagerService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }