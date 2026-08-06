<template>
    <div class="onboarding-gate">
        <OnboardingHero @finish="finish" />
    </div>
</template>

<script setup>
import OnboardingHero from './OnboardingHero.vue'
import { markOnboardingSeen } from '../../utils/onboarding'

const emit = defineEmits(['done'])

function finish() {
    markOnboardingSeen()
    emit('done')
}
</script>

<style scoped>
.onboarding-gate {
    position: fixed;
    inset: 0;
    background: var(--color-surface);
    z-index: 100;
    display: flex;
    align-items: stretch;
}
</style>
