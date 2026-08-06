<template>
    <div class="promo-slider-wrap">
        <!-- Arrows sit on the wrapper, overlapping the window edges -->
        <button class="slider-nav slider-prev" @click="$emit('prev')" aria-label="Previous">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button class="slider-nav slider-next" @click="$emit('next')" aria-label="Next">
            <i class="fas fa-chevron-right"></i>
        </button>

        <div class="promo-slider-window">
            <div class="promo-slider-track" :style="promoTrackStyle">
                <article
                    v-for="slide in promoSlides"
                    :key="slide.id"
                    class="promo-slide"
                    :style="slide.image ? {} : { background: slide.bg }"
                >
                    <img v-if="slide.image" :src="slide.image" class="promo-slide-bg-img" alt="" />
                    <div class="promo-slide-content" :class="{ 'has-image': slide.image }">
                        <span class="promo-chip" v-if="slide.badge">{{ slide.badge }}</span>
                        <h2>{{ slide.title }}</h2>
                        <p v-if="slide.subtitle">{{ slide.subtitle }}</p>
                    </div>
                    <div v-if="!slide.image" class="promo-slide-icon">
                        <i :class="slide.icon"></i>
                    </div>
                </article>
            </div>
        </div>

        <div class="promo-dots">
            <button
                v-for="(slide, index) in promoSlides"
                :key="slide.id"
                type="button"
                class="promo-dot"
                :class="{ active: index === currentPromoIndex }"
                @click="$emit('go', index)"
            ></button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    promoSlides:       { type: Array,  default: () => [] },
    currentPromoIndex: { type: Number, default: 0 },
    promoTrackStyle:   { type: Object, default: () => ({}) },
})
defineEmits(['prev', 'next', 'go'])
</script>

<style scoped>
.promo-slider-wrap {
    position: relative;
    margin-bottom: 6px;
}

.promo-slider-window {
    overflow: hidden;
    border-radius: 20px;
}

.promo-slider-track {
    display: flex;
    will-change: transform;
    transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.promo-slide {
    flex: 0 0 100%;
    width: 100%;
    min-height: 200px;
    padding: 28px 32px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    color: white;
    position: relative;
    overflow: hidden;
}

.promo-slide-bg-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.promo-slide-content {
    flex: 1;
    min-width: 0;
    position: relative;
    z-index: 1;
}

.promo-slide-content.has-image {
    text-shadow: 0 1px 6px rgba(0,0,0,0.55);
}

.promo-slide-icon {
    flex-shrink: 0;
    width: 90px;
    height: 90px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    position: relative;
    z-index: 1;
}

.promo-chip {
    display: inline-flex;
    align-items: center;
    padding: 5px 14px;
    border-radius: 999px;
    background: rgba(255,255,255,0.22);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.4px;
    margin-bottom: 12px;
    backdrop-filter: blur(4px);
}

.promo-slide h2 {
    font-size: 28px;
    font-weight: 800;
    line-height: 1.15;
    margin-bottom: 8px;
}
.promo-slide p {
    font-size: 14px;
    opacity: 0.9;
    line-height: 1.5;
}

/* Arrows on the wrapper, overlapping the slider window edges */
.slider-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-60%);
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: none;
    background: rgba(20, 32, 27, 0.32);
    backdrop-filter: blur(6px);
    color: #fff;
    font-size: 13px;
    cursor: pointer;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    transition: background 0.2s, transform 0.2s;
}
.slider-nav:hover {
    background: rgba(20, 32, 27, 0.55);
    transform: translateY(-60%) scale(1.08);
}
.slider-prev { left: -18px; }
.slider-next { right: -18px; }

.promo-dots {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 0 8px;
}
.promo-dot {
    width: 8px;
    height: 8px;
    padding: 0;
    border-radius: 999px;
    border: none;
    background: var(--color-primary-tint-strong);
    cursor: pointer;
    transition: all 0.25s;
}
.promo-dot.active {
    width: 22px;
    background: var(--color-primary);
}

@media (max-width: 768px) {
    .promo-slide      { min-height: 160px; padding: 20px 46px; }
    .promo-slide h2   { font-size: 22px; }
    .promo-slide p    { font-size: 13px; }
    .promo-slide-icon { width: 68px; height: 68px; font-size: 26px; border-radius: 18px; }
    .slider-nav       { width: 30px; height: 30px; font-size: 11px; }
    .slider-prev      { left: 6px; }
    .slider-next      { right: 6px; }
}

@media (max-width: 480px) {
    .promo-slider-window { border-radius: 16px; }
    .promo-slide         { min-height: 130px; padding: 16px 40px; }
    .promo-slide-icon    { display: none; }
    .promo-slide h2      { font-size: 19px; }
    .promo-chip          { font-size: 11px; padding: 4px 10px; margin-bottom: 8px; }
}
</style>
