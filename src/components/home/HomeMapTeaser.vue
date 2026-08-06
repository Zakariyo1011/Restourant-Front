<template>
    <section class="map-teaser" @click="$emit('expand')">
        <div :id="mapId" class="map-teaser-canvas"></div>

        <div class="map-teaser-overlay">
            <span class="map-teaser-cta">{{ $t('home.mapTeaserCta') }}</span>
        </div>

        <button class="map-teaser-expand" @click.stop="$emit('expand')" :aria-label="$t('home.mapExpand')">
            <i class="fas fa-expand"></i>
        </button>
    </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { buildRestaurantPinIcon } from '../../utils/restaurantMapPin'

const props = defineProps({
    centerLat: { type: Number, required: true },
    centerLng: { type: Number, required: true },
    pins: { type: Array, default: () => [] },
    resolveImageUrl: { type: Function, required: true },
    getRestaurantImageUrl: { type: Function, required: true },
})

defineEmits(['expand'])

const mapId = 'home-map-teaser'
let map = null
let markersLayer = null

const renderPins = () => {
    if (!map) return

    markersLayer.clearLayers()

    props.pins.forEach((restaurant) => {
        const lat = Number(restaurant?.location?.latitude ?? restaurant?.location?.lat)
        const lng = Number(restaurant?.location?.longitude ?? restaurant?.location?.lng)
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

        const imageUrl = props.resolveImageUrl(props.getRestaurantImageUrl(restaurant))
        const icon = buildRestaurantPinIcon(restaurant, imageUrl, { size: 40 })
        L.marker([lat, lng], { icon, interactive: false }).addTo(markersLayer)
    })
}

onMounted(() => {
    map = L.map(mapId, {
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false,
        tap: false,
        attributionControl: false,
    }).setView([props.centerLat, props.centerLng], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
    }).addTo(map)

    markersLayer = L.layerGroup().addTo(map)
    renderPins()

    setTimeout(() => map?.invalidateSize(), 50)
})

watch(() => props.pins, renderPins)
watch([() => props.centerLat, () => props.centerLng], ([lat, lng]) => {
    map?.setView([lat, lng], map.getZoom())
})

onBeforeUnmount(() => {
    map?.remove()
    map = null
})
</script>

<style scoped>
.map-teaser {
    position: relative;
    height: 200px;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 16px;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(12, 38, 32, 0.1);
}
.map-teaser-canvas {
    width: 100%;
    height: 100%;
    pointer-events: none;
}
.map-teaser-overlay {
    position: absolute;
    left: 14px;
    bottom: 14px;
    z-index: 410;
}
.map-teaser-cta {
    display: inline-block;
    padding: 10px 18px;
    background: rgba(255, 255, 255, 0.94);
    color: var(--color-text);
    font-weight: 700;
    font-size: 14px;
    border-radius: 999px;
    box-shadow: 0 8px 20px rgba(12, 38, 32, 0.16);
}
.map-teaser-expand {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 410;
    width: 38px;
    height: 38px;
    border: none;
    border-radius: 50%;
    background: rgba(20, 32, 27, 0.72);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

@media (max-width: 480px) {
    .map-teaser { height: 170px; border-radius: 16px; }
}
</style>
