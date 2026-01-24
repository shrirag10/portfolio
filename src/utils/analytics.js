/**
 * Analytics utility to log visits
 */

export const logVisit = async () => {
    // Skip analytics in development
    if (import.meta.env.DEV && !import.meta.env.VITE_TEST_ANALYTICS) {
        return;
    }

    try {
        await fetch('/api/visit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                path: window.location.pathname,
                userAgent: navigator.userAgent,
                screenWidth: window.innerWidth
            })
        });
    } catch (error) {
        console.error('Failed to log visit:', error);
    }
};

/**
 * Fetch visitor logs (Admin only)
 */
export const fetchVisitorLogs = async (password) => {
    try {
        const response = await fetch('/api/visit', {
            headers: {
                'Authorization': `Bearer ${password}`
            }
        });

        if (!response.ok) throw new Error('Unauthorized');

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch logs:', error);
        return { logs: [] };
    }
};
