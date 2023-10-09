/**
 * The options for a cookie.
 */
export interface CookieOptions {
  /**
   * After how many days the cookie will expire.
   */
  expireDays?: number,
  /**
   * The path of the cookie.
   */
  path?: string,
  /**
   * The domain of the cookie.
   */
  domain?: string,
  /**
   * Whether this cookie is secure (sent over https).
   */
  secure?: boolean,
  /**
   * How tje "sameSite" attribute for the cookie is handled.
   */
  sameSite?: 'Lax' | 'None' | 'Strict'
}

/**
 * Provides utilities for handling cookies in angular.
 * Heavily inspired by the "ngx-cookie-service" npm package.
 */
export abstract class CookieUtilities {

    /**
     * Get cookie by name.
     *
     * @param name - The name of the cookie to get.
     * @returns The value of the cookie.
     */
    static get(name: string): string | null {
        if (document == null) {
            return null;
        }
        name = encodeURIComponent(name);
        const regExp: RegExp = CookieUtilities.getCookieRegExp(name);
        const result: RegExpExecArray | null = regExp.exec(document?.cookie ?? '');
        return result?.[1] ? CookieUtilities.safeDecodeURIComponent(result[1]) : null;
    }

    private static getCookieRegExp(name: string): RegExp {
        const escapedName: string = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/gi, '\\$1');
        return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
    }

    /**
     * Gets the unencoded version of an encoded component of a Uniform Resource Identifier (URI).
     *
     * @param encodedURIComponent - A value representing an encoded URI component.
     * @returns The unencoded version of an encoded component of a Uniform Resource Identifier (URI).
     */
    private static safeDecodeURIComponent(encodedURIComponent: string): string {
        try {
            return decodeURIComponent(encodedURIComponent);
        }
        catch {
            // probably it is not uri encoded. return as is
            return encodedURIComponent;
        }
    }

    /**
     * Sets a cookie with the given name, value and options.
     *
     * @param name - The name of the cookie. Needs to be unique.
     * @param value - The value of the cookie.
     * @param options - Any additional options for the cookie.
     */
    static set(name: string, value: string, options: CookieOptions = {}): void {
        if (document == null) {
            return;
        }
        let cookieString: string = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';
        // eslint-disable-next-line max-len
        cookieString += options.expireDays ? `expires=${new Date(new Date().getTime() + options.expireDays * 1000 * 60 * 60 * 24).toUTCString()};` : '';
        cookieString += options.path ? `path=${options.path};` : '';
        cookieString += options.domain ? `domain=${options.domain};` : '';
        cookieString += options.secure === true ? 'secure;' : '';
        cookieString += options.sameSite ? `sameSite=${options.sameSite};` : 'sameSite=Lax;';

        document.cookie = cookieString;
    }

    /**
     * Delete the cookie with the given name.
     *
     * @param name - The name of the cookie.
     * @param options - The options of the cookie.
     */
    static delete(name: string, options?: Omit<CookieOptions, 'expireDays'>): void {
        CookieUtilities.set(name, '', { ...options, expireDays: -1 });
    }

    /**
     * Deletes all cookies.
     *
     * @param options - The options of the cookies to delete.
     */
    static deleteAll(options?: Omit<CookieOptions, 'expireDays'>): void {
        const cookies: Record<string, string> = this.getAll();
        for (const cookieName in cookies) {
            if (cookies.hasOwnProperty(cookieName)) {
                CookieUtilities.delete(cookieName, options);
            }
        }
    }

    /**
     * Get all cookies in JSON format.
     *
     * @returns All the cookies in json.
     */
    private static getAll(): Record<string, string> {
        if (document == null) {
            return {};
        }
        const cookies: Record<string, string> = {};
        if (document?.cookie && document?.cookie !== '') {
            document?.cookie.split(';').forEach(c => {
                const [cName, cValue] = c.split('=');
                cookies[CookieUtilities.safeDecodeURIComponent(cName.replace(/^ /, ''))] = CookieUtilities.safeDecodeURIComponent(cValue);
            });
        }

        return cookies;
    }
}