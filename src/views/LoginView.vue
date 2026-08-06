<template>
    <div class="login-page">
        <!-- Left panel -->
        <div class="left-panel">
            <div class="left-content">
                <div class="left-top-row">
                    <div class="brand">
                        <div class="brand-icon">
                            <i class="fas fa-utensils"></i>
                        </div>
                        <span class="brand-name">Restoran<span class="brand-accent">UZ</span></span>
                    </div>
                    <LanguageSwitcher />
                </div>

                <div class="left-text">
                    <h1>{{ $t('login.title') }}</h1>
                    <p>{{ $t('login.subtitle') }}</p>
                </div>

                <div class="features">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-bolt"></i>
                        </div>
                        <div>
                            <strong>{{ $t('login.feature1Title') }}</strong>
                            <p>{{ $t('login.feature1Sub') }}</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-map-marked-alt"></i>
                        </div>
                        <div>
                            <strong>{{ $t('login.feature2Title') }}</strong>
                            <p>{{ $t('login.feature2Sub') }}</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <div>
                            <strong>{{ $t('login.feature3Title') }}</strong>
                            <p>{{ $t('login.feature3Sub') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right panel -->
        <div class="right-panel">
            <div class="login-box">
                <div class="login-header">
                    <div class="login-icon">
                        <i class="fas fa-utensils"></i>
                    </div>
                    <h2>{{ $t('login.welcome') }}</h2>
                    <p>{{ $t('login.welcomeSub') }}</p>
                </div>

                <button @click="loginWithGoogle" class="google-btn">
                    <div class="google-logo">
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                    </div>
                    <span>{{ $t('login.googleBtn') }}</span>
                </button>

                <p class="fine-print">{{ $t('login.finePrint') }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { API_BASE } from '../utils/api'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const loginWithGoogle = () => {
    const frontend = encodeURIComponent(window.location.origin)
    window.location.href = `${API_BASE}/auth/google/redirect?frontend=${frontend}`
}
</script>

<style scoped>

* { box-sizing: border-box; margin: 0; padding: 0; }

.left-top-row {
    position: absolute;
    top: 24px;
    left: 24px;
    right: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
}

.left-top-row .brand {
    margin-bottom: 0;
}

.login-page {
    min-height: 100vh;
    display: flex;
    font-family: var(--font-sans);
}

/* LEFT PANEL */
.left-panel {
    flex: 1;
    background: linear-gradient(135deg, var(--color-primary-darker) 0%, var(--color-primary) 60%, var(--color-primary-light) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    position: relative;
    overflow: hidden;
}
.left-panel::before {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
    top: -100px; right: -100px;
}
.left-panel::after {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
    bottom: -80px; left: -60px;
}
.left-content { position: relative; z-index: 2; max-width: 420px; padding-top: 92px; }

.brand {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 48px;
}
.brand-icon {
    width: 42px; height: 42px;
    background: rgba(255,255,255,0.2);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 18px;
}
.brand-name { font-size: 20px; font-weight: 700; color: white; }
.brand-accent { color: rgba(255,255,255,0.7); }

.left-text { margin-bottom: 40px; }
.left-text h1 {
    font-size: 36px; font-weight: 800;
    color: white; line-height: 1.2;
    margin-bottom: 16px;
}
.left-text p { font-size: 15px; color: rgba(255,255,255,0.8); line-height: 1.6; }

.features { display: flex; flex-direction: column; gap: 20px; }
.feature-item {
    display: flex; align-items: center; gap: 14px;
    background: rgba(255,255,255,0.1);
    border-radius: 12px; padding: 14px 16px;
    backdrop-filter: blur(4px);
}
.feature-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
}
.feature-icon { background: rgba(255,255,255,0.2); color: white; }
.feature-item strong { display: block; color: white; font-size: 14px; margin-bottom: 2px; }
.feature-item p { color: rgba(255,255,255,0.75); font-size: 12px; }

/* RIGHT PANEL */
.right-panel {
    width: 480px;
    background: var(--color-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 40px 32px;
}
.login-header { text-align: center; margin-bottom: 32px; }
.login-icon {
    font-size: 48px; color: var(--color-primary);
    margin-bottom: 16px;
}
.login-header h2 { font-size: 26px; font-weight: 700; color: var(--color-text); margin-bottom: 6px; }
.login-header p { font-size: 14px; color: var(--color-text-faint); }

.google-btn {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    padding: 14px;
    background: var(--color-surface);
    border: 1.5px solid var(--color-border);
    border-radius: 12px;
    font-size: 15px; font-weight: 600; color: var(--color-text);
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.google-btn:hover {
    border-color: var(--color-primary);
    box-shadow: 0 4px 16px rgba(108,92,231,0.15);
    transform: translateY(-1px);
}
.google-logo { display: flex; align-items: center; }

.fine-print {
    text-align: center;
    font-size: 12.5px;
    color: var(--color-text-faint);
    margin-top: 20px;
    line-height: 1.5;
}

/* MOBILE */
@media (max-width: 768px) {
    .login-page { flex-direction: column; }
    .left-panel { padding: 32px 24px; }
    .left-text h1 { font-size: 26px; }
    .features { display: none; }
    .right-panel { width: 100%; padding: 32px 24px; position: relative; }
    .left-top-row {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-right: 0;
    }
    .login-box { padding-top: 0; }
}
</style>