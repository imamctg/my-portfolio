declare module 'aos' {
  interface AosOptions {
    duration?: number
    offset?: number
    easing?: string
    delay?: number
    once?: boolean
    mirror?: boolean
    anchorPlacement?: string
    disable?: 'phone' | 'tablet' | 'mobile' | boolean | (() => boolean)
    startEvent?: string
    initClassName?: string
    animatedClassName?: string
    useClassNames?: boolean
    disableMutationObserver?: boolean
    debounceDelay?: number
    throttleDelay?: number
  }

  function init(options?: AosOptions): void
  function refresh(): void

  const AOS: {
    init: typeof init
    refresh: typeof refresh
  }

  export default AOS
}
