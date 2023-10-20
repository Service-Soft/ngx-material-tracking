/**
 * Provides settings on how to handle do not track requests.
 */
export interface DntSettings {
    /**
     * Whether or not the do not track request should be respected.
     */
    respect: boolean,
    /**
     * What is displayed inside the snackbar when the tracking settings are made automatically.
     */
    snackbarMessage: string,
    /**
     * The duration the snackbar is displayed in ms.
     */
    snackbarDuration: number
}