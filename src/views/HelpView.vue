<template>
    <div class="page">
        <header class="page-head">
            <h1>{{ $t('help.title') }}</h1>
            <p>{{ $t('help.subtitle') }}</p>
        </header>

        <a class="telegram-card" :href="TELEGRAM_BOT_URL" target="_blank" rel="noopener">
            <span class="telegram-icon"><i class="fab fa-telegram-plane"></i></span>
            <span class="telegram-text">
                <strong>{{ $t('help.telegramTitle') }}</strong>
                <span>{{ $t('help.telegramSub') }}</span>
            </span>
            <i class="fas fa-chevron-right"></i>
        </a>

        <h4 class="faq-title">{{ $t('help.faqTitle') }}</h4>
        <div class="faq-list">
            <details class="faq-item" open>
                <summary>{{ $t('help.faq1Q') }}</summary>
                <p>{{ $t('help.faq1A') }}</p>
            </details>
            <details class="faq-item">
                <summary>{{ $t('help.faq2Q') }}</summary>
                <p>{{ $t('help.faq2A') }}</p>
            </details>
        </div>
    </div>
</template>

<script setup>
const TELEGRAM_BOT_URL = 'https://t.me/Restau4ant_bot'
</script>

<style scoped>
.page {
    max-width: 560px;
    margin: 0 auto;
    padding: var(--space-6) var(--space-5) var(--space-8);
}

.page-head { margin-bottom: var(--space-5); }
.page-head h1 { font-size: 24px; font-weight: 800; color: var(--color-text); margin: 0 0 4px; }
.page-head p { font-size: 14px; color: var(--color-text-muted); margin: 0; }

.telegram-card {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    text-decoration: none;
    margin-bottom: var(--space-6);
    box-shadow: var(--shadow-sm);
}
.telegram-icon {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: #2AABEE;
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}
.telegram-text { display: flex; flex-direction: column; flex: 1; }
.telegram-text strong { font-size: 14.5px; color: var(--color-text); }
.telegram-text span:last-child { font-size: 12.5px; color: var(--color-text-muted); }
.telegram-card > i { color: var(--color-text-faint); }

.faq-title { font-size: 13px; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 var(--space-3); }
.faq-list {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    overflow: hidden;
}
.faq-item {
    padding: 14px var(--space-4);
    border-bottom: 1px solid var(--color-border-light);
}
.faq-item:last-child { border-bottom: none; }
.faq-item summary {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text);
    cursor: pointer;
}
.faq-item p {
    font-size: 13px;
    color: var(--color-text-muted);
    margin: 10px 0 0;
    line-height: 1.5;
}
</style>
