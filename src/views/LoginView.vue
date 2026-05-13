<template>
    <div class="login-page">
        <!-- Left panel -->
        <div class="left-panel">
            <div class="left-content">
                <div class="brand">
                    <div class="brand-icon">
                        <i class="fas fa-utensils"></i>
                    </div>
                    <span class="brand-name">Restoran<span class="brand-accent">UZ</span></span>
                </div>

                <div class="left-text">
                    <h1>Restoraningizni<br/>dunyoga tanituring</h1>
                    <p>Ming-minglab mijozlar sizi kutmoqda. Hoziroq ro'yxatdan o'ting va biznesingizni o'stirish!</p>
                </div>

                <div class="features">
                    <div class="feature-item">
                        <div class="feature-icon green">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div>
                            <strong>Ko'proq mijoz</strong>
                            <p>Saytimiz orqali yangi mijozlarga ering</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon blue">
                            <i class="fas fa-map-marked-alt"></i>
                        </div>
                        <div>
                            <strong>Xaritada ko'rsating</strong>
                            <p>Mijozlar sizni osonlik bilan topsin</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon orange">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div>
                            <strong>Ishonchli platforma</strong>
                            <p>Admin nazoratida sifatli xizmat</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right panel -->
        <div class="right-panel">
            <div class="login-box">
                <router-link to="/" class="back-link">
                    <i class="fas fa-arrow-left"></i>
                    Bosh sahifaga qaytish
                </router-link>

                <div class="login-header">
                    <div class="login-icon">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <h2>Xush kelibsiz!</h2>
                    <p>Restoran egasi sifatida kiring</p>
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
                    <span>Google orqali kirish</span>
                </button>

                <div class="divider">
                    <span>yoki</span>
                </div>

                <div class="info-box">
                    <i class="fas fa-info-circle"></i>
                    <p>Faqat restoran egalari uchun. Oddiy foydalanuvchilar <router-link to="/">bosh sahifadan</router-link> restoranlarni ko'rishlari mumkin.</p>
                </div>

                <div class="steps">
                    <p class="steps-title">Qanday ishlaydi?</p>
                    <div class="step">
                        <div class="step-num">1</div>
                        <span>Google akkauntingiz bilan kiring</span>
                    </div>
                    <div class="step">
                        <div class="step-num">2</div>
                        <span>Restoran ma'lumotlarini kiriting</span>
                    </div>
                    <div class="step">
                        <div class="step-num">3</div>
                        <span>Admin tasdiqlashini kuting</span>
                    </div>
                    <div class="step">
                        <div class="step-num">4</div>
                        <span>Mijozlarga ko'rining!</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const loginWithGoogle = () => {
    window.location.href = 'https://restourant-production-6ae5.up.railway.app/api/auth/google/redirect'
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

* { box-sizing: border-box; margin: 0; padding: 0; }

.login-page {
    min-height: 100vh;
    display: flex;
    font-family: 'Segoe UI', sans-serif;
}

/* LEFT PANEL */
.left-panel {
    flex: 1;
    background: linear-gradient(135deg, #0F6E56 0%, #1D9E75 60%, #5DCAA5 100%);
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
.left-content { position: relative; z-index: 2; max-width: 420px; }

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
.feature-icon.green { background: rgba(255,255,255,0.2); color: white; }
.feature-icon.blue { background: rgba(255,255,255,0.2); color: white; }
.feature-icon.orange { background: rgba(255,255,255,0.2); color: white; }
.feature-item strong { display: block; color: white; font-size: 14px; margin-bottom: 2px; }
.feature-item p { color: rgba(255,255,255,0.75); font-size: 12px; }

/* RIGHT PANEL */
.right-panel {
    width: 480px;
    background: #f7f8fa;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 32px;
}

.login-box { width: 100%; max-width: 380px; }

.back-link {
    display: inline-flex; align-items: center; gap: 6px;
    color: #666; font-size: 13px; text-decoration: none;
    margin-bottom: 32px;
    transition: color 0.2s;
}
.back-link:hover { color: #1D9E75; }

.login-header { text-align: center; margin-bottom: 32px; }
.login-icon {
    font-size: 48px; color: #1D9E75;
    margin-bottom: 16px;
}
.login-header h2 { font-size: 26px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; }
.login-header p { font-size: 14px; color: #888; }

.google-btn {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    padding: 14px;
    background: white;
    border: 1.5px solid #e8e8e8;
    border-radius: 12px;
    font-size: 15px; font-weight: 600; color: #1a1a1a;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.google-btn:hover {
    border-color: #1D9E75;
    box-shadow: 0 4px 16px rgba(29,158,117,0.15);
    transform: translateY(-1px);
}
.google-logo { display: flex; align-items: center; }

.divider {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0; color: #ccc; font-size: 13px;
}
.divider::before, .divider::after {
    content: ''; flex: 1; height: 1px; background: #e8e8e8;
}

.info-box {
    display: flex; gap: 10px; align-items: flex-start;
    background: #E1F5EE; border-radius: 10px;
    padding: 12px 14px; margin-bottom: 24px;
}
.info-box i { color: #1D9E75; margin-top: 2px; flex-shrink: 0; }
.info-box p { font-size: 13px; color: #0F6E56; line-height: 1.5; }
.info-box a { color: #0F6E56; font-weight: 600; }

.steps-title { font-size: 13px; font-weight: 600; color: #444; margin-bottom: 12px; }
.steps { background: white; border-radius: 12px; padding: 16px; border: 1px solid #e8e8e8; }
.step {
    display: flex; align-items: center; gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #f5f5f5;
    font-size: 13px; color: #555;
}
.step:last-child { border-bottom: none; padding-bottom: 0; }
.step-num {
    width: 24px; height: 24px;
    background: #1D9E75; color: white;
    border-radius: 50%; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}

/* MOBILE */
@media (max-width: 768px) {
    .login-page { flex-direction: column; }
    .left-panel { padding: 32px 24px; }
    .left-text h1 { font-size: 26px; }
    .features { display: none; }
    .right-panel { width: 100%; padding: 32px 24px; }
}
</style>