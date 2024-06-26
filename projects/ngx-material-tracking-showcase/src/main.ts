/* eslint-disable no-console */
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Routes, provideRouter } from '@angular/router';
import { DntSettings, GdprDialogData, GdprGuard, GoogleAnalyticsService, GoogleTagManagerService, NGX_GDPR_DIALOG_DATA, NGX_GDPR_DNT_SETTINGS, NGX_GDPR_TRACKINGS, NGX_GOOGLE_ANALYTICS_ID, NGX_GOOGLE_TAG_MANAGER_ID, NGX_PIXEL_ID, PixelService, Tracking } from 'ngx-material-tracking';

import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/pages/home/home.component';
import { Page1Component } from './app/pages/page1/page1.component';
import { InternalAnalyticsService } from './app/services/internal-analytics.service';
import { environment } from './environments/environment';

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
    },
    {
        name: 'Pixel',
        description: ['Pixel'],
        TrackingServiceClass: PixelService
    }
];

const gdprDialogData: GdprDialogData = {
    title: 'Custom title',
    allowAllButtonLabel: 'Custom allow all',
    disallowAllButtonLabel: 'Custom disallow all',
    saveSettingsButtonLabel: 'Custom save',
    technicalNecessaryTitle: 'Custom necessary',
    enabledByDefaultTitle: 'Custom functional',
    disabledByDefaultTitle: 'Custom tracking',
    displayCloseAllowsAll: true,
    imprintDisplayName: 'Custom Imprint',
    imprintRoute: 'custom-imprint',
    privacyDisplayName: 'Custom Privacy',
    privacyRoute: 'custom-privacy',
    categoriesOpenedByDefault: false
};

const dntSettings: DntSettings = {
    respect: true,
    snackbarDuration: 5000,
    snackbarMessage: 'Custom DNT Message'
};

const routes: Routes = [
    {
        path: 'page-1',
        loadComponent: () => Page1Component,
        canActivate: [GdprGuard]
    },
    {
        path: '',
        loadComponent: () => HomeComponent,
        canActivate: [GdprGuard]
    }
];

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(
    AppComponent,
    {
        providers: [
            provideHttpClient(withInterceptorsFromDi()),
            provideRouter(routes),
            provideAnimations(),
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
                provide: NGX_PIXEL_ID,
                useValue: 'test123'
            },
            {
                provide: NGX_GDPR_DIALOG_DATA,
                useValue: gdprDialogData
            },
            {
                provide: NGX_GDPR_DNT_SETTINGS,
                useValue: dntSettings
            },
            {
                provide: APP_INITIALIZER,
                useFactory: () => {
                    return () => {};
                },
                deps: [GoogleAnalyticsService, GoogleTagManagerService, PixelService, InternalAnalyticsService],
                multi: true
            }
        ]
    }
// eslint-disable-next-line promise/prefer-await-to-callbacks
).catch(error => console.error(error));