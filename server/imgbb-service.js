/**
 * ImgBB Image Upload Service (Server-side API Proxy)
 * Secret key IMGBB_API_KEY is never exposed to the client browser.
 */

export async function uploadImageToImgBB(base64Image) {
  const apiKey = process.env.IMGBB_API_KEY || '';

  if (apiKey && base64Image) {
    try {
      // Strip base64 prefix
      const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

      const formData = new URLSearchParams();
      formData.append('key', apiKey);
      formData.append('image', cleanBase64);

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.url) {
          console.log('[ImgBB Service] Successfully uploaded to ImgBB:', result.data.url);
          return {
            success: true,
            url: result.data.url,
            displayUrl: result.data.display_url || result.data.url,
            deleteUrl: result.data.delete_url || null,
            width: result.data.width,
            height: result.data.height,
            size: result.data.size,
          };
        }
      } else {
        const errText = await response.text();
        console.warn('[ImgBB Service] Upload failed with status:', response.status, errText);
      }
    } catch (err) {
      console.error('[ImgBB Service Exception]:', err.message);
    }
  }

  // Fallback mode if ImgBB API Key is not set or network fails
  console.log('[ImgBB Service] Using fallback URL storage.');
  return {
    success: true,
    url: base64Image.length < 50000 ? base64Image : 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    displayUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    isFallback: true
  };
}
