import { useState } from 'react';
import { compressImage } from '../utils/imageCompression';
import { compressVideoFrame } from '../utils/videoCompression';
import { apiClient } from '../services/apiClient';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { saveScanRecord } from '../services/scanService';

export function useWasteAnalyzer() {
  const { settings } = useSettings();
  const { currentUser } = useAuth();
  
  const [analyzing, setAnalyzing] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [processingState, setProcessingState] = useState('idle'); // 'compressing' | 'uploading' | 'analyzing' | 'complete' | 'idle'
  const [compressionStats, setCompressionStats] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [rawImagePreview, setRawImagePreview] = useState(null);
  const [hostedImageUrl, setHostedImageUrl] = useState(null);

  const processMediaAndAnalyze = async (mediaInput, isVideo = false, fileName = '') => {
    setAnalyzing(true);
    setCompressing(true);
    setProcessingState('compressing');
    setError(null);
    setResult(null);

    try {
      let compressionResult;
      const targetKB = settings.compressionTargetKB || 500;

      // 1. Client-Side HTML5 Canvas Compression
      if (isVideo) {
        compressionResult = await compressVideoFrame(mediaInput, targetKB);
      } else {
        compressionResult = await compressImage(mediaInput, targetKB);
      }

      setCompressionStats(compressionResult);
      setRawImagePreview(compressionResult.compressedBase64);
      setCompressing(false);

      // 2. Upload to ImgBB via secure serverless proxy
      setProcessingState('uploading');
      let imgbbUrl = null;
      try {
        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: compressionResult.compressedBase64 })
        });
        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          if (uploadJson.success && uploadJson.url) {
            imgbbUrl = uploadJson.url;
            setHostedImageUrl(imgbbUrl);
          }
        }
      } catch (uploadErr) {
        console.warn('ImgBB upload proxy warning:', uploadErr.message);
      }

      // 3. Multi-Object AI Vision Analysis
      setProcessingState('analyzing');
      const response = await apiClient.analyzeWaste({
        image: compressionResult.compressedBase64,
        mediaType: isVideo ? 'video/mp4' : 'image/jpeg',
        fileName: fileName || (mediaInput instanceof File ? mediaInput.name : ''),
        visualAnalysis: compressionResult.visualAnalysis || null
      });

      if (response.success) {
        const enrichedResult = {
          ...response,
          imageSrc: compressionResult.compressedBase64,
          hostedImageUrl: imgbbUrl || compressionResult.compressedBase64
        };

        setResult(enrichedResult);
        setProcessingState('complete');

        // 4. Save to Firestore if objects detected
        if (!response.isNonWaste && (response.objects || response.items)?.length > 0) {
          try {
            await saveScanRecord({
              userId: currentUser?.uid || 'anonymous',
              userEmail: currentUser?.email || 'guest@ecosmart.local',
              imageUrl: imgbbUrl || compressionResult.compressedBase64,
              scanResult: enrichedResult
            });
          } catch (saveErr) {
            console.warn('Firestore scan save warning:', saveErr.message);
          }
        }
      } else {
        throw new Error(response.error || 'Failed to complete waste analysis.');
      }
    } catch (err) {
      console.error('Analyzer hook error:', err);
      setError(err.message || 'Analysis encountered an error. Please try again.');
      setProcessingState('idle');
    } finally {
      setAnalyzing(false);
      setCompressing(false);
    }
  };

  const resetAnalyzer = () => {
    setAnalyzing(false);
    setCompressing(false);
    setProcessingState('idle');
    setCompressionStats(null);
    setResult(null);
    setError(null);
    setRawImagePreview(null);
    setHostedImageUrl(null);
  };

  return {
    analyzing,
    compressing,
    processingState,
    compressionStats,
    result,
    error,
    rawImagePreview,
    hostedImageUrl,
    processMediaAndAnalyze,
    resetAnalyzer
  };
}
