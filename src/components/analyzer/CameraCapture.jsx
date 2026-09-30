import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Video, RefreshCw, Sparkles, AlertCircle, X } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export function CameraCapture({ onCapture, onUpload, disabled = false }) {
  const { settings } = useSettings();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  // Attach stream to videoRef element when camera stream state or video DOM element updates
  useEffect(() => {
    if (cameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.warn('Video play warning:', e));
    }
  }, [cameraActive, stream]);

  // Clean up media tracks when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      let mediaStream = null;

      // Try 1: Try rear environment camera first (Mobile)
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false
        });
      } catch (err1) {
        console.warn('Rear camera not available, trying default video device...', err1.message);
        // Try 2: Fallback to standard default video device (Desktop / Laptop Webcam)
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      setStream(mediaStream);
      setCameraActive(true);
    } catch (err) {
      console.error('[Camera Access Error]:', err);
      let errorMsg = 'Could not access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission denied. Please allow camera permissions in browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera device found on this device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'Camera is already in use by another application.';
      }
      setCameraError(errorMsg);

      // Trigger native device camera input as secondary fallback
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 1280;
      canvas.height = videoRef.current.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      stopCamera();
      onCapture(dataUrl);
    } catch (e) {
      alert('Capture failed: ' + e.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    if (isVideo && !settings.videoAnalysisEnabled) {
      alert('Video analysis is currently disabled by system administrator.');
      e.target.value = '';
      return;
    }

    onUpload(file, isVideo, file.name);
    e.target.value = '';
  };

  return (
    <div className="w-full space-y-4">
      {cameraActive ? (
        <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-emerald-500/50 shadow-2xl aspect-video max-h-[480px] flex items-center justify-center group select-none">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* AI VISION LIVE CAMERA HUD OVERLAYS */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
            {/* Top Status Line */}
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-white bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-bold">AI VISION ENGINE LIVE</span>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-amber-400 font-bold">AUTO-FOCUS: READY</span>
                <span className="text-emerald-400 font-bold">MODE: AI SEGREGATION</span>
              </div>
            </div>

            {/* Sweeping Laser Scan Line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#facc15] animate-pulse top-1/2 -translate-y-1/2 opacity-80" />

            {/* Center Target Lock Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 border border-amber-400/50 rounded-3xl flex items-center justify-center">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />

                <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-400/80 animate-spin-slow flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-ping" />
                </div>

                <div className="absolute bottom-2 px-2.5 py-0.5 rounded-full bg-slate-950/90 text-[10px] font-mono font-bold text-amber-400 border border-amber-400/40">
                  AI TARGET LOCK ACTIVE
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 px-4 z-20">
            <button
              onClick={stopCamera}
              className="px-5 py-2.5 rounded-full bg-slate-950/80 text-white font-bold text-xs backdrop-blur-md hover:bg-black transition-all flex items-center gap-1.5 border border-white/20"
            >
              <X className="w-4 h-4 text-rose-400" /> Cancel
            </button>
            <button
              onClick={capturePhoto}
              className="p-4 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-400 to-emerald-500 text-slate-950 shadow-xl shadow-amber-500/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group-hover:ring-4 ring-amber-400/40"
              title="Snap Waste Image for AI Processing"
            >
              <Camera className="w-7 h-7 font-black" />
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-3xl border-2 border-dashed border-amber-400/40 dark:border-emerald-500/40 bg-surface/80 hover:bg-surface p-8 sm:p-12 text-center transition-all flex flex-col items-center justify-center space-y-5 shadow-lg shadow-amber-500/5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 animate-bounce">
            <Sparkles className="w-8 h-8 font-black" />
          </div>

          <div>
            <h3 className="text-xl font-black font-heading text-foreground">Snap or Upload Waste Photograph</h3>
            <p className="text-xs text-muted max-w-sm mx-auto mt-1 leading-relaxed">
              Snap photo of any waste item (e.g. Bananas, Grapes, Bottles, Cans). AI identifies exact contents & waste stream stream.
            </p>
          </div>

          {cameraError && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-2 max-w-md mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>{cameraError} You can also click <strong>Upload Image</strong> below.</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* Live Webcam / Native Mobile Camera Launcher */}
            <button
              type="button"
              onClick={startCamera}
              disabled={disabled}
              className="px-5 py-3 rounded-2xl bg-surface border border-amber-400/40 text-foreground font-bold text-xs hover:border-emerald-500 hover:text-emerald-500 transition-all flex items-center gap-2 shadow-xs"
            >
              <Camera className="w-4 h-4 text-amber-500" />
              Open Camera
            </button>

            {/* Native Mobile Camera Direct Upload Input */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={disabled}
              className="sm:hidden px-4 py-3 rounded-2xl bg-surface border border-emerald-500/40 text-foreground font-bold text-xs hover:border-amber-400 transition-all flex items-center gap-2 shadow-xs"
            >
              <Camera className="w-4 h-4 text-emerald-500" />
              Mobile Camera
            </button>

            {/* File Upload Launcher */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition-all flex items-center gap-2 active:scale-95"
            >
              <Upload className="w-4 h-4" />
              Upload Image {settings.videoAnalysisEnabled && '/ Video'}
            </button>
          </div>

          {/* Hidden inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept={settings.videoAnalysisEnabled ? "image/*,video/*" : "image/*"}
            className="hidden"
            onChange={handleFileChange}
          />

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
