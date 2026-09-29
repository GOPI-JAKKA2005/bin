import { verifyAdminAuth } from '../../server/auth-middleware.js';
import { getDocument, setDocument } from '../../server/firestore-service.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const settings = await getDocument('settings', 'config') || await getDocument('settings', 'main');
      return res.status(200).json({ success: true, settings });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      await verifyAdminAuth(req);

      const settingsData = req.body;
      const updated = await setDocument('settings', 'config', settingsData);

      return res.status(200).json({ success: true, settings: updated });
    }

    return res.status(405).json({ error: 'Method Not Allowed.' });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Settings API operation failed.' });
  }
}
