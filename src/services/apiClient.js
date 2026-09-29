const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP Error ${response.status}`);
  }

  return data;
}

export const apiClient = {
  // Public Analysis & Chat APIs
  analyzeWaste: (payload) => request('/analyze', { method: 'POST', body: payload }),
  uploadImage: (image) => request('/upload-image', { method: 'POST', body: { image } }),
  compressVideo: (videoBase64, maxKB) => request('/compress-video', { method: 'POST', body: { videoBase64, maxKB } }),
  sendChatMessage: (query) => request('/chatbot', { method: 'POST', body: { query } }),

  // Public/Admin Configuration APIs
  getTheme: () => request('/admin/theme', { method: 'GET' }),
  saveTheme: (themeData, token) => request('/admin/theme', { method: 'POST', body: themeData, token }),

  getSettings: () => request('/admin/settings', { method: 'GET' }),
  saveSettings: (settingsData, token) => request('/admin/settings', { method: 'POST', body: settingsData, token }),

  getPages: () => request('/admin/pages', { method: 'GET' }),
  getPageBySlug: (slug) => request(`/admin/pages?slug=${encodeURIComponent(slug)}`, { method: 'GET' }),
  savePage: (pageData, token) => request('/admin/pages', { method: pageData.id ? 'PUT' : 'POST', body: pageData, token }),
  deletePage: (id, token) => request(`/admin/pages?id=${id}`, { method: 'DELETE', token }),

  // Protected Admin Management APIs
  getAdminStats: (token) => request('/admin/overview', { method: 'GET', token }),
  
  getWasteCatalog: () => request('/admin/waste', { method: 'GET' }),
  saveWasteItem: (itemData, token) => request('/admin/waste', { method: itemData.id ? 'PUT' : 'POST', body: itemData, token }),
  deleteWasteItem: (id, token) => request(`/admin/waste?id=${id}`, { method: 'DELETE', token }),

  getChatbotKnowledge: () => request('/admin/chatbot', { method: 'GET' }),
  saveChatbotEntry: (entryData, token) => request('/admin/chatbot', { method: entryData.id ? 'PUT' : 'POST', body: entryData, token }),
  deleteChatbotEntry: (id, token) => request(`/admin/chatbot?id=${id}`, { method: 'DELETE', token }),

  getAnalytics: (token) => request('/admin/analytics', { method: 'GET', token })
};
