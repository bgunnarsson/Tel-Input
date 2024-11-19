// telinput.d.ts

declare module '@bgunnarsson/tel-input' {
  interface TelInputSearchConfig {
    placeholder?: string
  }

  interface TelInputOptions {
    target?: string // CSS selector for the target element
    wrapper?: string // CSS selector for the wrapper element
    country?: string // Default country ISO code (e.g., 'is', 'us')
    code?: string // Default country code (e.g., '+354', '+1')
    exclude?: string[] // List of ISO codes to exclude (e.g., ['is', 'us'])
    priority?: string[] // List of ISO codes to prioritize (e.g., ['us', 'ca'])
    search?: TelInputSearchConfig // Search configuration
  }

  export default class TelInput {
    constructor(options: TelInputOptions)

    /**
     * Initializes the TelInput instance.
     * This function is called internally during the construction of the TelInput instance.
     */
    init(): Promise<void>
  }
}
