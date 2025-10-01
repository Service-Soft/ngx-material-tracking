import { ComponentType } from '@angular/cdk/portal';
import { InjectionToken } from '@angular/core';

/**
 * Base definition for a snackbar component.
 */
export type SnackbarComponentInterface = {
    /**
     * The message to display inside the component.
     */
    message: string
};

/**
 * Injection token for the current snackbar message.
 */
export const SNACKBAR_MESSAGE: InjectionToken<string> = new InjectionToken<string>('SNACKBAR_MESSAGE');

// eslint-disable-next-line stylistic/max-len, jsdoc/require-jsdoc
export const NGX_TRACKING_SNACKBAR_COMPONENT: InjectionToken<ComponentType<SnackbarComponentInterface>> = new InjectionToken<ComponentType<SnackbarComponentInterface>>(
    'The snackbar component to use',
    {
        providedIn: 'root',
        factory: () => {
            throw new Error('Missing provider for NGX_TRACKING_SNACKBAR_COMPONENT');
        }
    }
);