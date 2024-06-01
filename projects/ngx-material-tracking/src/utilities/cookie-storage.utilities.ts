import { CookieOptions, CookieUtilities } from './cookie.utilities';

// eslint-disable-next-line jsdoc/require-jsdoc
interface CookieStorage extends Storage {
    /**
     * The amount of cookies saved.
     */
    readonly length: number,
    /**
     * Removes all cookies, if there are any.
     */
    clear: (options?: Omit<CookieOptions, 'expireDays'>) => void,
    /**
     * Gets the key for the given index.
     * @param index - The index for which the key should be returned.
     * @returns A string or null if a cookie at the given index could not be found.
     */
    key: (index: number) => string | null,
    /**
     * Sets a cookie.
     * @param key - The unique key of the cookie.
     * @param value - The value of the cookie.
     * @param expireDays - The amount of days after which the cookie expires.
     * @param path - The path of the cookie. Defaults to ''.
     */
    setItem: (key: string, value: string, options?: CookieOptions) => void,
    /**
     * Gets the cookie with the given key or null if the cookie could not be found.
     * @param key - The key of the cookie to get.
     * @returns The cookie as a string or null if no cookie was found.
     */
    getItem: (key: string) => string | null,
    /**
     * Removes the cookie with the given key by setting its expiration to a previous point in time.
     * @param key - The key of the cookie to remove.
     */
    removeItem: (key: string, options?: Omit<CookieOptions, 'expireDays'>) => void
}

/**
 * Provides a way to access cookies the same way as localStorage or sessionStorage.
 */
export const cookieStorage: CookieStorage = {
    get length(): number {
        return document?.cookie ? document.cookie.split(';').length : 0;
    },

    setItem(key: string, value: string, options?: CookieOptions) {
        options = options ?? {};
        options.expireDays = options.expireDays ?? 30;
        CookieUtilities.set(key, value, options);
    },

    getItem(key: string): string | null {
        return CookieUtilities.get(key);
    },

    removeItem(key: string, options?: Omit<CookieOptions, 'expireDays'>): void {
        CookieUtilities.delete(key, options);
    },

    clear(options?: Omit<CookieOptions, 'expireDays'>): void {
        CookieUtilities.deleteAll(options);
    },

    key(index: number): string | null {
        return document?.cookie
            ? document.cookie.split(';')[index].replaceAll(/^\s+/g, '').split('=')[0]
            // eslint-disable-next-line unicorn/no-null
            : null;
    }
};