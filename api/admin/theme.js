import { verifyAdminAuth } from '../../server/auth-middleware.js';
import { getDocument, setDocument } from '../../server/firestore-service.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const theme = await getDocument('theme', 'settings') || await getDocument('theme', 'current');
      return res.status(200).json({ success: true, theme });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      await verifyAdminAuth(req);

      const themeData = req.body;
      const updatedTheme = await setDocument('theme', 'settings', themeData);

      return res.status(200).json({ success: true, theme: updatedTheme });
    }

    return res.status(405).json({ error: 'Method Not Allowed.' });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Theme API operation failed.' });
  }
}
