import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
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
    static readonly TEMPORARY_SCRIPT_CLASS_NAME = 'temporary-script';

    protected renderer: Renderer2;

    constructor(
        private readonly router: Router,
        private readonly rendererFactory: RendererFactory2,
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
     *
     * @param content - The content inside the script.
     * @param src - The src of the script tag.
     * @param location - Where the script should be added.
     * @param id - A css id for the script. Can be used to remove the script at a certain point.
     */
    loadPermanentJsScript(content: string, src?: string, location: 'head' | 'body' = 'body', id?: string): void {
        if (id && this.document.getElementById(id)) {
            return;
        }
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
        this.renderer.appendChild(document[location], script);
    }

    /**
     * Loads in a script with the given content.
     *
     * @param content - The content of the script.
     * @param src - The src of the script tag.
     */
    loadTemporaryJsScript(content: string, src?: string): void {
        const script: HTMLScriptElement = this.renderer.createElement('script') as HTMLScriptElement;
        script.type = 'text/javascript';
        script.className = ScriptService.TEMPORARY_SCRIPT_CLASS_NAME;
        if (src) {
            script.src = src;
        }
        script.innerHTML = content;
        script.async = true;
        this.renderer.appendChild(this.document.body, script);
    }

    /**
     * Removes all temporary script elements.
     */
    removeAllTemporaryScripts(): void {
        // eslint-disable-next-line max-len
        const temporaryScriptElements: HTMLCollectionOf<Element> = this.document.getElementsByClassName(ScriptService.TEMPORARY_SCRIPT_CLASS_NAME);
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i: number = 0; i < temporaryScriptElements.length; i++) {
            const element: Element = temporaryScriptElements[i];
            this.renderer.removeChild(this.document.body, element);
        }
    }
}