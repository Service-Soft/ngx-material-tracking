/**
 * Definition for a checkpoint in a funnel.
 */
export interface FunnelPoint {
    /**
     * The name of the checkpoint, eg, Visit, AddToCart or Purchase.
     */
    name: string,
    /**
     * The amount of times this checkpoint has been passed.
     */
    value: number
}