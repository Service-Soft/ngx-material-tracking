# NgxMaterialTracking

Provides gdpr-compliant tracking functionality for angular websites.

Google Analytics and Meta Pixel are supported out of the box, but you are also able to build your own tracking.

# Table of Contents
- [NgxMaterialTracking](#ngxmaterialtracking)
- [Table of Contents](#table-of-contents)
- [Requirements](#requirements)
- [Usage](#usage)
  - [Define your tracking services](#define-your-tracking-services)
  - [Initialize your services when the app starts](#initialize-your-services-when-the-app-starts)
  - [Provide the tracking to the gdpr-dialog](#provide-the-tracking-to-the-gdpr-dialog)
  - [Use the builtin route guard or open the dialog manually](#use-the-builtin-route-guard-or-open-the-dialog-manually)

# Requirements
This package relies on the [angular material library](https://material.angular.io/guide/getting-started) to render its components.

# Usage
## Define your tracking services
Build any custom tracking services by expending the `BaseTrackingService` or `CustomTrackingService` classes. If you only need to use google-analytics or the meta pixel you can skip this step.

```typescript
// example
import { BaseCustomTrackingMetadata, CustomTrackingService, GdprCategory, TrackingEvent, TrackingVisit } from 'ngx-material-tracking';

@Injectable({ providedIn: 'root' })
export class InternalAnalyticsService extends CustomTrackingService<BaseCustomTrackingMetadata, TrackingVisit, TrackingEvent> {
    readonly DOMAIN: string = 'http://localhost';
    readonly VISIT_API_URL: string = 'http://localhost:3000/visits';
    readonly EVENT_API_URL: string = 'http://localhost:3000/events';
    readonly METADATA_KEY: string = 'internalAnalytics';
    readonly GDPR_CATEGORY: GdprCategory = GdprCategory.ENABLED_BY_DEFAULT;

    constructor(router: Router, http: HttpClient) {
        super(router, http);
    }
}
```

## Initialize your services when the app starts
The services should usually track page visits. Therefore they listen to the router events as soon as they are initialized.

The problem with that is that an angular service is only initialized when it is used. To load the services on startup you have to use the APP_INITIALIZER provider:

```typescript
// in the providers array of app.module.ts
import { GoogleAnalyticsService, NGX_GDPR_TRACKINGS, NGX_GOOGLE_ANALYTICS_ID, Tracking } from 'ngx-material-tracking';

...

{
    provide: APP_INITIALIZER,
    useFactory: () => {
        return () => {};
    },
    deps: [GoogleAnalyticsService, InternalAnalyticsService], // anything listed here gets initialized on startup
    multi: true // optional
}
```

## Provide the tracking to the gdpr-dialog
To stay gdpr-compliant this package also provides a cookie-dialog where the user can choose which tracking he allows.

You can provide all your trackings by setting the following inside your app.module.ts providers array:

```typescript
import { GoogleAnalyticsService, NGX_GDPR_TRACKINGS, NGX_GOOGLE_ANALYTICS_ID, Tracking } from 'ngx-material-tracking';

const trackings: Tracking[] = [
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

...

{
    provide: NGX_GDPR_TRACKINGS,
    useValue: trackings
},
// (Optional)
{
    provide: NGX_GDPR_DIALOG_DATA,
    useValue: {
        title: 'Custom title',
        allowAllButtonLabel: 'Custom allow all',
        disallowAllButtonLabel: 'Custom disallow all',
        saveSettingsButtonLabel: 'Custom save',
        technicalNecessaryTitle: 'Custom necessary',
        enabledByDefaultTitle: 'Custom functional',
        disabledByDefaultTitle: 'Custom tracking'
    }
},
```

## Use the builtin route guard or open the dialog manually
You usually want to open the dialog before the user can access the website.

This package already provides a GdprGuard that you can simply attach to your routes:

```typescript
// in your routes array:
import { GdprGuard } from 'ngx-material-tracking';

...

{
    path: '',
    loadChildren: () => import('./pages/my-great-page.module').then(m => m.MyGreatPageModule),
    canActivate: [GdprGuard]
},
```