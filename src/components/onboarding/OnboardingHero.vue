<template>
    <div class="hero">
        <div class="hero-bg">
            <span class="glow glow-1"></span>
            <span class="glow glow-2"></span>
            <span class="glow glow-3"></span>
        </div>
        <div class="hero-scrim"></div>

        <div class="hero-topbar">
            <span class="pin-badge"><i class="fas fa-location-dot"></i></span>
        </div>

        <div class="hero-content">
            <h1 class="hero-title">{{ $t('onboarding.slide1Title') }}</h1>
            <p class="hero-sub">{{ $t('onboarding.slide1Sub') }}</p>

            <button type="button" class="cta-btn" @click="finish">
                {{ $t('onboarding.getStarted') }}
            </button>
            <button type="button" class="skip-btn" @click="finish">
                {{ $t('onboarding.skip') }}
            </button>

            <a class="telegram-card" :href="TELEGRAM_BOT_URL" target="_blank" rel="noopener" @click.stop>
                <span class="telegram-icon"><i class="fab fa-telegram-plane"></i></span>
                <span class="telegram-text">
                    <strong>{{ $t('onboarding.telegramTitle') }}</strong>
                    <span>{{ $t('onboarding.telegramSub') }}</span>
                </span>
                <i class="fas fa-paper-plane telegram-arrow"></i>
            </a>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['finish'])
const TELEGRAM_BOT_URL = 'https://t.me/Restau4ant_bot'

function finish() {
    emit('finish')
}
</script>

<style scoped>
.hero {
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow: hidden;
    background: #14101F;
}

.hero-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(120% 90% at 15% 0%, #2C2340 0%, #17131F 55%, #0D0B14 100%);
}

.glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.55;
}
.glow-1 { width: 280px; height: 280px; background: #6C5CE7; top: 6%; left: -8%; }
.glow-2 { width: 220px; height: 220px; background: #FFB963; top: 22%; right: -6%; opacity: 0.28; }
.glow-3 { width: 320px; height: 320px; background: #4E3FCB; bottom: 18%; left: 20%; opacity: 0.35; }

.hero-scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(13,11,20,0) 0%, rgba(13,11,20,0.55) 55%, rgba(10,9,15,0.96) 100%);
}

.hero-topbar {
    position: relative;
    z-index: 2;
    padding: var(--space-6) var(--space-5) 0;
}

.pin-badge {
    width: 44px; height: 44px;
    border-radius: var(--radius-md);
    background: rgba(255,255,255,0.95);
    color: var(--color-primary);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    box-shadow: var(--shadow-md);
}

.hero-content {
    position: relative;
    z-index: 2;
    padding: 0 var(--space-6) var(--space-8);
    max-width: 460px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
}

.hero-title {
    font-size: 34px;
    font-weight: 800;
    color: #fff;
    line-height: 1.2;
    margin: 0 0 var(--space-3);
}

.hero-sub {
    font-size: 15px;
    color: rgba(255,255,255,0.72);
    line-height: 1.55;
    margin: 0 0 var(--space-6);
}

.cta-btn {
    width: 100%;
    padding: 16px;
    border-radius: var(--radius-md);
    border: none;
    background: var(--color-primary);
    color: #fff;
    font-weight: 700;
    font-size: 15.5px;
    cursor: pointer;
    box-shadow: 0 10px 24px rgba(108,92,231,0.4);
    transition: background 0.15s;
}
.cta-btn:hover { background: var(--color-primary-dark); }

.skip-btn {
    display: block;
    width: 100%;
    margin-top: var(--space-3);
    padding: 8px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.6);
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
}

.telegram-card {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-top: var(--space-6);
    padding: var(--space-3) var(--space-4);
    background: rgba(255,255,255,0.97);
    border-radius: var(--radius-lg);
    text-decoration: none;
    box-shadow: var(--shadow-lg);
}

.telegram-icon {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #2AABEE;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    flex-shrink: 0;
}

.telegram-text {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
}

.telegram-text strong {
    font-size: 13px;
    color: var(--color-text);
}

.telegram-text span:last-child {
    font-size: 11.5px;
    color: var(--color-text-faint);
}

.telegram-arrow {
    color: #2AABEE;
    font-size: 13px;
}

@media (min-width: 769px) {
    .hero-content { padding-bottom: var(--space-8); }
}
</style>
