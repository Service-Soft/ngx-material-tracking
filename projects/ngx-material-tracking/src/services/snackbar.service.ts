import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { Inject, Injectable, Injector } from '@angular/core';

import { NGX_TRACKING_SNACKBAR_COMPONENT, SNACKBAR_MESSAGE, SnackbarComponentInterface } from '../components/snackbar/snackbar-component.interface';

/**
 * Options for opening a snackbar message.
 */
export type SnackbarOptions = {
    /**
     * The duration in ms.
     */
    duration: number
};

/**
 * A service for handling snackbar messages.
 */
@Injectable({ providedIn: 'root' })
export class SnackbarService {
    private overlayRef?: OverlayRef;

    constructor(
        private readonly overlay: Overlay,
        private readonly injector: Injector,
        @Inject(NGX_TRACKING_SNACKBAR_COMPONENT)
        private readonly snackbarComponent: ComponentType<SnackbarComponentInterface>
    ) {}

    /**
     * Opens a new snackbar message.
     * @param message - The message to open.
     * @param options - Options for the message.
     */
    open(message: string, options: SnackbarOptions): void {
        if (this.overlayRef) {
            this.overlayRef.dispose();
        }

        this.overlayRef = this.overlay.create({
            positionStrategy: this.overlay.position().global()
                .centerHorizontally()
                .bottom('20px'),
            hasBackdrop: false,
            panelClass: 'snackbar-panel'
        });

        const portal: ComponentPortal<SnackbarComponentInterface> = new ComponentPortal(
            this.snackbarComponent,
            undefined,
            this.createInjector(message)
        );
        this.overlayRef.attach(portal);

        // Capture local reference to avoid racing if open() is called again
        const currentRef: OverlayRef = this.overlayRef;
        setTimeout(() => currentRef.dispose(), options.duration);
    }

    private createInjector(message: string): Injector {
        return Injector.create({
            providers: [{ provide: SNACKBAR_MESSAGE, useValue: message }],
            parent: this.injector
        });
    }
}