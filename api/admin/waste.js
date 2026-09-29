import { verifyAdminAuth } from '../../server/auth-middleware.js';
import { getCollection, addDocument, setDocument, deleteDocument } from '../../server/firestore-service.js';
import { validateWasteItemInput } from '../../server/validators.js';

export default async function handler(req, res) {
  try {
    // 1. Verify Admin Credentials
    await verifyAdminAuth(req);

    const { method } = req;
    const { action, id, entity = 'items' } = req.query || {};

    if (method === 'GET') {
      const items = await getCollection('items');
      const categories = await getCollection('categories');
      return res.status(200).json({ success: true, items, categories });
    }

    if (method === 'POST') {
      if (entity === 'categories') {
        const categoryData = req.body;
        const result = await addDocument('categories', categoryData);
        return res.status(200).json({ success: true, category: result });
      }

      const validatedData = validateWasteItemInput(req.body);
      const result = await addDocument('items', validatedData);
      return res.status(200).json({ success: true, item: result });
    }

    if (method === 'PUT') {
      const itemId = id || req.body.id;
      if (!itemId) return res.status(400).json({ error: 'Item ID required for update.' });

      if (entity === 'categories') {
        const result = await setDocument('categories', itemId, req.body);
        return res.status(200).json({ success: true, category: result });
      }

      const validatedData = validateWasteItemInput(req.body);
      const result = await setDocument('items', itemId, validatedData);
      return res.status(200).json({ success: true, item: result });
    }

    if (method === 'DELETE') {
      const itemId = id || req.body?.id;
      if (!itemId) return res.status(400).json({ error: 'ID required for deletion.' });

      await deleteDocument(entity === 'categories' ? 'categories' : 'items', itemId);
      return res.status(200).json({ success: true, deletedId: itemId });
    }

    return res.status(405).json({ error: 'Method Not Allowed.' });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Waste Management API Operation Failed.' });
  }
}
