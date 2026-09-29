import { compressImage } from './imageCompression.js';

/**
 * Client-Side Video Processing & Frame Sampling Utility
 * Extracts key frame from video and compresses target payload to ~500KB
 */
export async function compressVideoFrame(videoFile, targetKB = 500) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.playsInline = true;
    video.muted = true;

    const initialSizeKB = Math.round(videoFile.size / 1024);
    const url = URL.createObjectURL(videoFile);

    video.onloadeddata = async () => {
      // Seek to 1 second into video or midpoint
      video.currentTime = Math.min(1.0, video.duration / 2 || 0.5);
    };

    video.onseeked = async () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frameDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        URL.revokeObjectURL(url);

        // Compress frame to target ~500KB
        const compressionResult = await compressImage(frameDataUrl, targetKB);

        resolve({
          ...compressionResult,
          isVideo: true,
          videoInitialSizeKB: initialSizeKB,
          durationSec: Math.round(video.duration || 0)
        });
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to parse video format in browser canvas player.'));
    };

    video.src = url;
  });
}
