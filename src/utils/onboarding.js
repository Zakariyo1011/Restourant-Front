const ONBOARDING_KEY = 'restoran_onboarding_v1'

export function hasSeenOnboarding() {
    return localStorage.getItem(ONBOARDING_KEY) === 'true'
}

export function markOnboardingSeen() {
    localStorage.setItem(ONBOARDING_KEY, 'true')
}
