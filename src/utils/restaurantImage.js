/**
 * /restaurants (index) va /restaurants/nearby endpointlari rasm maydonini
 * har xil shaklda qaytaradi — shu farqni shu yerda bir joyda hal qilamiz.
 */
export function getRestaurantImageUrl(restaurant) {
    if (restaurant?.image_url) return restaurant.image_url
    if (restaurant?.images?.length > 0) return restaurant.images[0].url
    return restaurant?.image_path || null
}
