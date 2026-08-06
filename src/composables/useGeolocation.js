const isLocalhost = () => {
    const hostname = window.location.hostname
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

const requestCurrentPosition = (options) => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
}

export const getLocationErrorMessage = (error) => {
    if (error?.message === 'SECURE_CONTEXT_REQUIRED') {
        return 'GPS faqat `https` yoki `localhost` da ishlaydi'
    }

    if (error?.message === 'PERMISSION_DENIED') {
        return 'Brauzerda location ruxsatini yoqing'
    }

    switch (error?.code) {
        case 1:
            return 'Joylashuv uchun ruxsat berilmadi'
        case 2:
            return 'Joylashuvni aniqlab bo\'lmadi'
        case 3:
            return 'GPS javobi kechikdi, qayta urinib ko\'ring'
        default:
            return 'Joylashuvni aniqlashda xatolik bo\'ldi'
    }
}

export const resolveCurrentPosition = async () => {
    if (!window.isSecureContext && !isLocalhost()) {
        throw new Error('SECURE_CONTEXT_REQUIRED')
    }

    if (navigator.permissions?.query) {
        try {
            const permission = await navigator.permissions.query({ name: 'geolocation' })
            if (permission.state === 'denied') {
                throw new Error('PERMISSION_DENIED')
            }
        } catch (error) {
            if (error?.message === 'PERMISSION_DENIED') {
                throw error
            }
        }
    }

    try {
        return await requestCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
        })
    } catch (error) {
        if (error?.code !== 3) {
            throw error
        }

        return await requestCurrentPosition({
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 300000,
        })
    }
}
