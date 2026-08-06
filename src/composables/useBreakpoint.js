import { onBeforeUnmount, ref } from 'vue'

export const MOBILE_QUERY = '(max-width: 768px)'

/**
 * Reactive, resize-aware breakpoint match. Shared so every view/shell
 * responds to the same threshold instead of reimplementing matchMedia.
 */
export function useBreakpoint(query = MOBILE_QUERY) {
    const mql = window.matchMedia(query)
    const matches = ref(mql.matches)

    const handleChange = (event) => {
        matches.value = event.matches
    }

    mql.addEventListener('change', handleChange)

    onBeforeUnmount(() => {
        mql.removeEventListener('change', handleChange)
    })

    return matches
}

export function useIsMobile() {
    return useBreakpoint(MOBILE_QUERY)
}
