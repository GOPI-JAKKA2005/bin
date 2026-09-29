import { verifyAdminAuth } from '../../server/auth-middleware.js';
import { getCollection, addDocument, setDocument, deleteDocument } from '../../server/firestore-service.js';

export default async function handler(req, res) {
  try {
    const { method } = req;
    const { id, slug } = req.query || {};

    if (method === 'GET') {
      const pages = await getCollection('pages');
      if (slug) {
        const page = pages.find(p => p.slug === slug);
        return res.status(200).json({ success: true, page });
      }
      return res.status(200).json({ success: true, pages });
    }

    await verifyAdminAuth(req);

    if (method === 'POST') {
      const pageData = req.body;
      const result = await addDocument('pages', pageData);
      return res.status(200).json({ success: true, page: result });
    }

    if (method === 'PUT') {
      const pageId = id || req.body.id;
      if (!pageId) return res.status(400).json({ error: 'Page ID required for update.' });
      const result = await setDocument('pages', pageId, req.body);
      return res.status(200).json({ success: true, page: result });
    }

    if (method === 'DELETE') {
      const pageId = id || req.body?.id;
      if (!pageId) return res.status(400).json({ error: 'Page ID required for deletion.' });
      await deleteDocument('pages', pageId);
      return res.status(200).json({ success: true, deletedId: pageId });
    }

    return res.status(405).json({ error: 'Method Not Allowed.' });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Page Manager API failed.' });
  }
}
