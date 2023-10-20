/*
 * Public API Surface of ngx-material-tracking
 */
export * from './components/gdpr-dialog/gdpr-dialog.component';
export * from './models/dnt-settings.model';
export * from './models/event.model';
export * from './models/facebook-pixel.model';
export * from './models/gdpr-category.enum';
export * from './models/gdpr-dialog-data-internal.model';
export * from './models/gdpr-dialog-data.model';
export * from './models/google-analytics-event.model';
export * from './models/tracking.model';
export * from './models/visit.model';
export * from './services/gdpr.guard';
export * from './services/gdpr.service';
export * from './services/script.service';
export * from './services/tracking/base-tracking.service';
export * from './services/tracking/custom-tracking.service';
export * from './services/tracking/google-analytics.service';
export * from './services/tracking/google-tag-manager.service';
export * from './services/tracking/pixel.service';
export * from './utilities/cookie-storage.utilities';