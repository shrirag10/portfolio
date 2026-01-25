/**
 * Cloud Sync Utilities
 * Handles syncing content with the cloud backend
 */

const API_URL = '/api/content';

/**
 * Fetch content from cloud storage
 * @returns {Promise<{content: object, styles: object, sections: array}>}
 */
export async function fetchCloudContent() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch content: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Cloud fetch error:', error);
        return null;
    }
}

/**
 * Save content to cloud storage
 * @param {object} data - Content data to save
 * @param {string} password - Edit mode password for authorization
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function saveCloudContent(data, password) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${password}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 401) {
                return { success: false, error: 'Unauthorized - invalid password' };
            }
            throw new Error(`Failed to save content: ${response.status}`);
        }

        const result = await response.json();
        return { success: true, updatedAt: result.updatedAt };
    } catch (error) {
        console.error('Cloud save error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Check if cloud sync is available (API endpoint exists)
 * @returns {Promise<boolean>}
 */
export async function isCloudSyncAvailable() {
    try {
        const response = await fetch(API_URL, { method: 'GET' });
        return response.ok;
    } catch {
        return false;
    }
}
