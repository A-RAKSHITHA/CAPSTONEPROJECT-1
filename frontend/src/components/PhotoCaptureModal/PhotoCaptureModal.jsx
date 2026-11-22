import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, RefreshCw, Check, AlertCircle, Trash2, Sparkles } from 'lucide-react';

const PhotoCaptureModal = ({
  isOpen,
  onClose,
  currentPhoto = null,
  onSavePhoto,
  userName = 'Member',
  roleTitle = 'Community Member',
}) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'camera'
  const [previewImage, setPreviewImage] = useState(currentPhoto);
  const [cameraError, setCameraError] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreviewImage(currentPhoto);
  }, [currentPhoto, isOpen]);

  // Clean up camera stream when modal closes or switching tabs
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
    } else if (isOpen && activeTab === 'camera') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in your browser settings.'
          : 'Unable to access camera on this device. Please use the Upload Photo option.'
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth || 400, video.videoHeight || 400);
    canvas.width = 400;
    canvas.height = 400;

    const ctx = canvas.getContext('2d');
    const startX = ((video.videoWidth || 400) - size) / 2;
    const startY = ((video.videoHeight || 400) - size) / 2;

    ctx.drawImage(video, startX, startY, size, size, 0, 0, 400, 400);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPreviewImage(dataUrl);
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress & normalize to max 400x400 square for fast database storage
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');

        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, 400, 400);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPreviewImage(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSavePhoto(previewImage);
      onClose();
    } catch (err) {
      console.error('Failed to save profile photo:', err);
      alert('Failed to save photo. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewImage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Update Profile Photo</h3>
            <p className="text-xs text-slate-500">
              {userName} • <span className="text-emerald-700 font-semibold">{roleTitle}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'camera'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Take Photo (Camera)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4">
          {activeTab === 'camera' ? (
            <div className="space-y-3">
              {cameraError ? (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center space-x-2 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Camera Permission Required</span>
                  </div>
                  <p>{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="mt-2 px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg text-xs font-semibold"
                  >
                    Retry Camera
                  </button>
                </div>
              ) : isCameraActive ? (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-square flex items-center justify-center shadow-inner">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  <div className="absolute inset-0 border-4 border-white/30 rounded-full m-8 pointer-events-none" />
                </div>
              ) : (
                <div className="aspect-square bg-slate-100 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                  <Camera className="w-10 h-10 text-slate-400 mb-2" />
                  <p className="text-xs text-slate-500">Camera preview closed or captured</p>
                  <button
                    onClick={startCamera}
                    className="mt-3 px-4 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800"
                  >
                    Turn Camera On
                  </button>
                </div>
              )}

              {isCameraActive && (
                <button
                  type="button"
                  onClick={captureSnapshot}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center space-x-2 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Snapshot</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-800">
                  Click to browse or drag & drop photo
                </div>
                <div className="text-[11px] text-slate-500">
                  Supports JPG, PNG, WebP (automatic crop to square)
                </div>
              </div>
            </div>
          )}

          {/* Preview Section */}
          {previewImage && (
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600 shadow-sm"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Photo Ready</div>
                  <div className="text-[11px] text-slate-500">Will be displayed across dashboards</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs flex items-center space-x-1"
                title="Remove photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center space-x-1.5"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>Save Profile Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCaptureModal;
