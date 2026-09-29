import { uploadImageToImgBB } from '../server/imgbb-service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { image } = req.body || {};

    if (!image) {
      return res.status(400).json({ error: 'Missing required field: "image" base64 string.' });
    }

    const result = await uploadImageToImgBB(image);

    return res.status(200).json(result);
  } catch (err) {
    console.error('[API /api/upload-image Error]:', err);
    return res.status(500).json({ error: err.message || 'Image upload proxy failed.' });
  }
}
