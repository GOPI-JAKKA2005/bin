import { verifyAdminAuth } from '../../server/auth-middleware.js';
import { getCollection, addDocument, setDocument, deleteDocument } from '../../server/firestore-service.js';

export default async function handler(req, res) {
  try {
    const { method } = req;
    const { id } = req.query || {};

    if (method === 'GET') {
      const knowledge = await getCollection('chatbotKnowledge');
      return res.status(200).json({ success: true, knowledge });
    }

    // Privileged admin operations
    await verifyAdminAuth(req);

    if (method === 'POST') {
      const entry = req.body;
      const result = await addDocument('chatbotKnowledge', entry);
      return res.status(200).json({ success: true, entry: result });
    }

    if (method === 'PUT') {
      const entryId = id || req.body.id;
      if (!entryId) return res.status(400).json({ error: 'Entry ID required for update.' });
      const result = await setDocument('chatbotKnowledge', entryId, req.body);
      return res.status(200).json({ success: true, entry: result });
    }

    if (method === 'DELETE') {
      const entryId = id || req.body?.id;
      if (!entryId) return res.status(400).json({ error: 'Entry ID required for deletion.' });
      await deleteDocument('chatbotKnowledge', entryId);
      return res.status(200).json({ success: true, deletedId: entryId });
    }

    return res.status(405).json({ error: 'Method Not Allowed.' });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Chatbot control API operation failed.' });
  }
}
