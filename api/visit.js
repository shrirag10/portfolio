import Redis from 'ioredis';

// Key for storing visitor logs list
const LOGS_KEY = 'visitor_logs';
// Max logs to keep
const MAX_LOGS = 1000;

// Initialize Redis client
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
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const client = getRedis();

        // LOG VISITOR (Public endpoint)
        if (req.method === 'POST') {
            const { path, userAgent, screenWidth } = req.body;

            // Extract IP
            const forwarded = req.headers['x-forwarded-for'];
            const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;

            // Extract Geo (Vercel headers)
            const country = req.headers['x-vercel-ip-country'];
            const city = req.headers['x-vercel-ip-city'];
            const region = req.headers['x-vercel-ip-country-region'];

            const logEntry = {
                ip,
                location: city && country ? `${city}, ${country}` : (country || 'Unknown'),
                path: path || '/',
                userAgent: userAgent || 'Unknown',
                device: screenWidth < 768 ? 'Mobile' : 'Desktop',
                timestamp: new Date().toISOString()
            };

            // Add to start of list
            await client.lpush(LOGS_KEY, JSON.stringify(logEntry));
            // Trim list to keep size manageable
            await client.ltrim(LOGS_KEY, 0, MAX_LOGS - 1);

            return res.status(200).json({ success: true });
        }

        // GET LOGS (Protected endpoint)
        if (req.method === 'GET') {
            // Validate authorization
            const authHeader = req.headers.authorization;
            const expectedPassword = process.env.VITE_EDITOR_PASSWORD || process.env.EDIT_MODE_PASSWORD || 'admin123';

            if (!authHeader || authHeader !== `Bearer ${expectedPassword}`) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Get logs
            const limit = req.query.limit || 100;
            const logs = await client.lrange(LOGS_KEY, 0, limit - 1);

            // Parse JSON strings back to objects
            const parsedLogs = logs.map(log => {
                try { return JSON.parse(log); }
                catch (e) { return null; }
            }).filter(Boolean);

            return res.status(200).json({ logs: parsedLogs });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Visit API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
