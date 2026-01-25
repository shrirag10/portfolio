import Redis from 'ioredis';

// Content key in Redis store
const CONTENT_KEY = 'portfolio_content';

// Initialize Redis client with connection URL from environment
let redis = null;
function getRedis() {
    if (!redis) {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) {
            throw new Error('REDIS_URL environment variable is not set');
        }
        redis = new Redis(redisUrl);
    }
    return redis;
}

export default async function handler(req, res) {
    // CORS headers for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const client = getRedis();

        if (req.method === 'GET') {
            // Fetch content from Redis store
            const contentStr = await client.get(CONTENT_KEY);
            const content = contentStr ? JSON.parse(contentStr) : null;
            return res.status(200).json(content || { content: {}, styles: {}, sections: [] });
        }

        if (req.method === 'POST') {
            // Validate authorization (simple password check)
            const authHeader = req.headers.authorization;
            const expectedPassword = process.env.VITE_EDITOR_PASSWORD || process.env.EDIT_MODE_PASSWORD || 'admin123';

            if (!authHeader || authHeader !== `Bearer ${expectedPassword}`) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Save content to Redis store
            const { content, styles, sections } = req.body;

            const data = {
                content: content || {},
                styles: styles || {},
                sections: sections || [],
                updatedAt: new Date().toISOString()
            };

            await client.set(CONTENT_KEY, JSON.stringify(data));

            return res.status(200).json({ success: true, updatedAt: data.updatedAt });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Content API error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
