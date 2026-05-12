<template>
    <div class="login-page">
        <div class="login-card">
            <h1>Restoran Sayt</h1>
            <p>Restoran egasi sifatida kiring</p>
            <button @click="loginWithGoogle" class="google-btn">
                <img src="https://www.google.com/favicon.ico" alt="Google" width="20" />
                Google orqali kirish
            </button>
        </div>
    </div>
</template>

<script setup>
import api from '../axios'

const loginWithGoogle = () => {
    window.location.href = 'http://localhost:8000/api/auth/google/redirect'
}
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
}
.login-card {
    background: white;
    padding: 40px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
.login-card h1 { margin-bottom: 8px; }
.login-card p { color: #666; margin-bottom: 24px; }
.google-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    font-size: 16px;
    margin: 0 auto;
    transition: background 0.2s;
}
.google-btn:hover { background: #f5f5f5; }
</style>