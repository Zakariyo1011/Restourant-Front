<template>
    <div class="user-footer">
        <LanguageSwitcher />
        <div class="user-row">
            <div class="user-avatar"><i class="fas fa-user"></i></div>
            <div class="user-meta">
                <span class="user-name">{{ user?.name || badge }}</span>
                <span class="user-role">{{ badge }}</span>
            </div>
            <button type="button" class="logout-btn" :title="$t('nav.logout')" @click="$emit('logout')">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import LanguageSwitcher from '../LanguageSwitcher.vue'

defineProps({
    user: { type: Object, default: null },
    badge: { type: String, required: true },
})
defineEmits(['logout'])
</script>

<style scoped>
.user-footer {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-4);
    border-top: 1px solid var(--color-border);
}

.user-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
}

.user-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--color-primary-tint);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.user-meta {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
}

.user-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-role {
    font-size: 11.5px;
    color: var(--color-text-faint);
}

.logout-btn {
    width: 34px;
    height: 34px;
    border-radius: var(--radius-sm);
    border: none;
    background: var(--color-danger-tint);
    color: var(--color-danger-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s;
}

.logout-btn:hover {
    background: var(--color-danger-tint-strong);
}
</style>
