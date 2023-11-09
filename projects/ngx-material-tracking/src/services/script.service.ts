import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

/**
 * Provides functionality around setting javascript dynamically.
 */
@Injectable({ providedIn: 'root' })
export class ScriptService {

    /**
     * The name of the class that all temporary scripts have.
     * Is needed to find the scripts when they should be removed again.
     */
    static readonly TEMPORARY_SCRIPT_CLASS_NAME: string = 'temporary-script';

    private readonly renderer: Renderer2;

    constructor(
        private readonly router: Router,
        private readonly rendererFactory: RendererFactory2,
        @Inject(PLATFORM_ID)
        private readonly platformId: Object,
        @Inject(DOCUMENT)
        private readonly document: Document
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.init();
    }

    /**
     * Initializes the service.
     * Listens to router events and remove all temporary scripts on navigation.
     */
    protected init(): void {
        this.router.events.subscribe(e => {
            if (e instanceof NavigationStart) {
                this.removeAllTemporaryScripts();
            }
        });
    }

    /**
     * Loads a js script with the given content and src globally.
     * @param content - The content inside the script.
     * @param src - The src of the script tag.
     * @param location - Where the script should be added.
     * @param id - A css id for the script. Can be used to remove the script at a certain point.
     */
    async loadPermanentJsScript(content: string, src?: string, location: 'head' | 'body' = 'body', id?: string): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        if (id && this.document.getElementById(id)) {
            return;
        }

        return new Promise((resolve, reject) => {
            const script: HTMLScriptElement = this.renderer.createElement('script') as HTMLScriptElement;
            script.type = 'text/javascript';
            if (src) {
                script.src = src;
            }
            script.innerHTML = content;
            if (id) {
                script.id = id;
            }
            script.async = true;
            if (src) {
                script.addEventListener('load', () => resolve());
                script.addEventListener('error', error => reject(error));
            }
            this.renderer.appendChild(this.document[location], script);
            if (!script.src) {
                resolve();
            }
        });
    }

    /**
     * Loads in a script with the given content.
     * @param content - The content of the script.
     * @param src - The src of the script tag.
     * @param location - Where the temporary script should be loaded. Defaults to body.
     */
    async loadTemporaryJsScript(content: string, src?: string, location: 'head' | 'body' = 'body'): Promise<void> {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        return new Promise((resolve, reject) => {
            const script: HTMLScriptElement = this.renderer.createElement('script') as HTMLScriptElement;
            script.type = 'text/javascript';
            script.className = ScriptService.TEMPORARY_SCRIPT_CLASS_NAME;
            if (src) {
                script.src = src;
            }
            script.innerHTML = content;
            script.async = true;
            if (src) {
                script.addEventListener('load', () => resolve());
                script.addEventListener('error', error => reject(error));
            }
            this.renderer.appendChild(this.document[location], script);
            if (!script.src) {
                resolve();
            }
        });
    }

    /**
     * Removes a script with the given id either from the head or the body.
     * @param id - The css id of the script to remove.
     */
    removeScriptById(id: string): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const element: HTMLElement | null = this.document.getElementById(id);
        if (!element) {
            return;
        }
        try {
            this.renderer.removeChild(this.document.body, element);
        }
        catch (error) {

        }
        try {
            this.renderer.removeChild(this.document.head, element);
        }
        catch (error) {

        }
    }

    /**
     * Removes all temporary script elements.
     */
    removeAllTemporaryScripts(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const temporaryScriptElements: HTMLCollectionOf<Element> = this.document.getElementsByClassName(ScriptService.TEMPORARY_SCRIPT_CLASS_NAME);
        for (const element of Array.from(temporaryScriptElements)) {
            try {
                this.renderer.removeChild(this.document.body, element);
            }
            catch (error) {

            }
            try {
                this.renderer.removeChild(this.document.head, element);
            }
            catch (error) {

            }
        }
    }
}