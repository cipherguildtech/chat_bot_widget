// src/api/track-widget.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// List of allowed websites
const ALLOWED_ORIGINS = [
  'https://your-allowed-site.com',
  'https://another-allowed-site.com',
  'http://localhost:5173', // For testing
];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // Validate if the request is from an allowed website
  const isValidOrigin = origin && ALLOWED_ORIGINS.includes(origin);
  const isValidReferer = referer && ALLOWED_ORIGINS.some(url => referer.startsWith(url));

  if (!isValidOrigin && !isValidReferer) {
    console.warn(`Unauthorized access attempt from: ${origin || referer}`);
    return res.status(403).json({ 
      error: 'Unauthorized website',
      origin: origin,
      referer: referer
    });
  }

  // Log valid request
  const trackingData = {
    origin,
    referer,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'],
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
  };

  console.log('Valid widget request from:', trackingData);

  // Store in database
  await storeTrackingData();

  return res.status(200).json({ 
    success: true, 
    message: 'Widget tracking successful',
    data: trackingData
  });
}

// Example database storage
async function storeTrackingData() {
  // Option 1: Use Vercel Postgres
  // Option 2: Use MongoDB Atlas
  // Option 3: Use Supabase
  // Option 4: Use Firebase
  // Option 5: Use Airtable
  
  // Example with Vercel KV (Redis)
  // await kv.set(`widget:${Date.now()}`, JSON.stringify(data));
}