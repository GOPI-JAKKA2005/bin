import { processChatQuery } from '../server/chatbot-engine.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { query } = req.body || {};

    const result = await processChatQuery(query || '');

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result
    });
  } catch (err) {
    console.error('[API /api/chatbot Error]:', err);
    return res.status(500).json({ error: err.message || 'Chatbot request failed.' });
  }
}
