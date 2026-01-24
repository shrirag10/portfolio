/**
 * Image Upload Utilities
 * Supports multiple cloud providers with fallback to Base64
 */

// Configuration from environment variables
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * Check if a provider is configured
 */
export const isCloudinaryConfigured = () => Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET)
export const isImgbbConfigured = () => Boolean(IMGBB_API_KEY)

/**
 * Get available upload providers
 */
export const getAvailableProviders = () => {
    const providers = []
    if (isCloudinaryConfigured()) providers.push({ id: 'cloudinary', name: 'Cloudinary', icon: '☁️' })
    if (isImgbbConfigured()) providers.push({ id: 'imgbb', name: 'Imgbb', icon: '🖼️' })
    providers.push({ id: 'base64', name: 'Local', icon: '💾' })
    return providers
}

/**
 * Upload to Cloudinary
 */
async function uploadToCloudinary(file, onProgress) {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress(Math.round((e.loaded / e.total) * 100))
            }
        })

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText)
                resolve({
                    url: response.secure_url,
                    provider: 'cloudinary',
                    publicId: response.public_id
                })
            } else {
                reject(new Error(`Cloudinary upload failed: ${xhr.status}`))
            }
        })

        xhr.addEventListener('error', () => reject(new Error('Network error during Cloudinary upload')))
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')))

        xhr.open('POST', url)
        xhr.send(formData)
    })
}

/**
 * Upload to Imgbb
 */
async function uploadToImgbb(file, onProgress) {
    const url = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`

    // Convert file to base64 for Imgbb API
    const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
    })

    onProgress?.(50) // Imgbb doesn't support progress, so show 50%

    const formData = new FormData()
    formData.append('image', base64)

    const response = await fetch(url, {
        method: 'POST',
        body: formData
    })

    if (!response.ok) {
        throw new Error(`Imgbb upload failed: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
        throw new Error(data.error?.message || 'Imgbb upload failed')
    }

    onProgress?.(100)

    return {
        url: data.data.url,
        provider: 'imgbb',
        deleteUrl: data.data.delete_url
    }
}

/**
 * Convert file to Base64 data URL
 */
async function convertToBase64(file, onProgress) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress(Math.round((e.loaded / e.total) * 100))
            }
        }

        reader.onloadend = () => {
            resolve({
                url: reader.result,
                provider: 'base64'
            })
        }

        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
    })
}

/**
 * Main upload function with automatic provider selection and fallback
 * @param {File} file - The image file to upload
 * @param {Object} options - Upload options
 * @param {string} options.preferredProvider - Preferred provider ('cloudinary', 'imgbb', 'base64')
 * @param {Function} options.onProgress - Progress callback (0-100)
 * @param {Function} options.onError - Error callback (receives error message, continues with fallback)
 * @returns {Promise<{url: string, provider: string}>}
 */
export async function uploadImage(file, options = {}) {
    const { preferredProvider, onProgress, onError } = options

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed')
    }

    // Build provider chain based on preference and availability
    const providers = []

    if (preferredProvider === 'base64') {
        providers.push({ name: 'base64', fn: convertToBase64 })
    } else {
        if (isCloudinaryConfigured()) {
            providers.push({ name: 'cloudinary', fn: uploadToCloudinary })
        }
        if (isImgbbConfigured()) {
            providers.push({ name: 'imgbb', fn: uploadToImgbb })
        }
        // Always fall back to Base64
        providers.push({ name: 'base64', fn: convertToBase64 })
    }

    // Try each provider in order
    let lastError = null
    for (const provider of providers) {
        try {
            onProgress?.(0)
            const result = await provider.fn(file, onProgress)
            return result
        } catch (error) {
            lastError = error
            onError?.(`${provider.name} failed: ${error.message}. Trying fallback...`)
            console.warn(`Upload to ${provider.name} failed:`, error)
        }
    }

    // All providers failed
    throw lastError || new Error('All upload providers failed')
}

/**
 * Validate an image URL by attempting to load it
 */
export async function validateImageUrl(url) {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
        img.src = url
    })
}
