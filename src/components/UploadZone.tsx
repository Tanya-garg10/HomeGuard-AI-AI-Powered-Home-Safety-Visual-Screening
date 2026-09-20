import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  X,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Aperture,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { SAMPLE_ROOM_IMAGES } from '../data/sampleScans';

export interface UploadZoneProps {
  onImageSelected: (imageData: { file?: File; dataUrl: string; roomName: string }) => void;
  isAnalyzing?: boolean;
  defaultFacingMode?: 'user' | 'environment';
  permissionStatus?: 'prompt' | 'granted' | 'denied' | 'unsupported';
  onRequestPermission?: () => Promise<boolean>;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onImageSelected,
  isAnalyzing = false,
  defaultFacingMode = 'user',
  permissionStatus = 'prompt',
  onRequestPermission,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [roomName, setRoomName] = useState<string>('Living Room');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live Camera state - defaults to 'user' facing mode
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(defaultFacingMode);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Update facingMode if defaultFacingMode changes
  useEffect(() => {
    setFacingMode(defaultFacingMode);
  }, [defaultFacingMode]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // When camera activates, attach stream to video element
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.warn('Video playback error:', err);
      });
    }
  }, [isCameraActive]);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Camera track stop error:', e);
        }
      });
      streamRef.current = null;
    }
  };

  const startLiveCamera = async (mode: 'environment' | 'user' = facingMode) => {
    setErrorMsg(null);
    setCameraError(null);
    setIsCameraLoading(true);
    stopCameraStream();

    // Check if mediaDevices API is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsCameraLoading(false);
      setCameraError('Webcam / media streaming is not supported in this browser. Please use file upload.');
      cameraInputRef.current?.click();
      return;
    }

    // Call optional parent permission hook first if provided
    if (onRequestPermission) {
      try {
        const ok = await onRequestPermission();
        if (!ok) {
          setIsCameraLoading(false);
          setCameraError('Camera access was not granted. Please allow camera permissions in browser settings.');
          return;
        }
      } catch (err) {
        console.warn('Permission request hook note:', err);
      }
    }

    try {
      // Properly request media device permissions with desired facing mode ('user' by default)
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setFacingMode(mode);
      setIsCameraActive(true);
      setIsCameraLoading(false);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Live camera stream error:', err);
      stopCameraStream();
      setIsCameraLoading(false);
      setIsCameraActive(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(
          'Camera permission was denied. Please allow camera access in your browser address bar.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError(
          'No camera device detected. Please connect a camera or upload a photo below.'
        );
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError(
          'Camera is currently in use by another application or tab.'
        );
      } else {
        setCameraError(
          `Unable to open camera stream (${err.message || 'Unknown error'}). Opening file selector.`
        );
      }

      // Fallback to file input
      setTimeout(() => {
        cameraInputRef.current?.click();
      }, 400);
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // Trigger visual shutter flash
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally if front/user camera mode for natural orientation
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `home-scan-${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });
          setSelectedFile(file);
        }
      },
      'image/jpeg',
      0.92
    );

    setSelectedPreview(dataUrl);
    stopCameraStream();
    setIsCameraActive(false);
  };

  const handleFlipCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startLiveCamera(nextMode);
  };

  const handleCloseCamera = () => {
    stopCameraStream();
    setIsCameraActive(false);
    setIsCameraLoading(false);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrorMsg(null);
    setCameraError(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Unsupported file format. Please upload JPG, PNG, or WebP.');
      return;
    }

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image file size is too large (max 15MB). Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setSelectedPreview(dataUrl);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSelectPreset = (url: string, defaultName: string) => {
    setErrorMsg(null);
    setCameraError(null);
    setSelectedPreview(url);
    setSelectedFile(null);
    setRoomName(defaultName);
  };

  const handleRemoveImage = () => {
    setSelectedPreview(null);
    setSelectedFile(null);
    setErrorMsg(null);
    setCameraError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleAnalyze = () => {
    if (!selectedPreview) {
      setErrorMsg('Please select or capture an image first.');
      return;
    }

    onImageSelected({
      file: selectedFile || undefined,
      dataUrl: selectedPreview,
      roomName: roomName.trim() || 'Room',
    });
  };

  return (
    <div id="upload-zone-wrapper" className="w-full max-w-2xl mx-auto">
      {/* Title & Subtitle */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-tech text-[#d4ff00] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-pulse" />
          <span>OPTICAL VOLUMETRIC INGESTION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Scan Your Space
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
          Capture via live camera or upload high-resolution room photography to detect visible safety hazards.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {cameraError && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-amber-400" />
            <span>{cameraError}</span>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold whitespace-nowrap cursor-pointer"
          >
            Upload Photo
          </button>
        </div>
      )}

      {/* Hidden File Inputs for fallback/browsing */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture={facingMode === 'user' ? 'user' : 'environment'}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Live Camera Viewfinder Modal */}
      {isCameraActive && (
        <div
          id="camera-viewfinder-modal"
          className="fixed inset-0 z-50 bg-[#07080a]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4"
        >
          <div className="relative w-full max-w-2xl bg-[#0b0d11] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Camera Header */}
            <div className="p-4 bg-[#07080a]/90 border-b border-white/[0.06] flex items-center justify-between font-tech text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white font-medium tracking-wide">
                  FEED: ACTIVE // {facingMode === 'user' ? 'USER SENSOR' : 'ENVIRONMENT SENSOR'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFlipCamera}
                  title={`Switch to ${facingMode === 'user' ? 'Environment / Rear' : 'User / Front'} Camera`}
                  className="px-2.5 py-1 rounded-lg bg-[#181b22] hover:bg-[#232732] text-zinc-300 hover:text-white border border-white/10 transition cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                >
                  <RefreshCw size={13} className="text-[#d4ff00]" />
                  <span>Switch Lens</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseCamera}
                  title="Close camera"
                  className="p-1.5 rounded-lg bg-[#181b22] hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/10 transition cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Video Viewport with Targeting Overlay */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Shutter Flash Animation */}
              {isFlashActive && (
                <div className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-150 opacity-90" />
              )}

              {/* Target Viewfinder Optical Reticle */}
              <div className="absolute inset-8 sm:inset-12 border border-white/20 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-[#d4ff00]" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-[#d4ff00]" />
                </div>
                <div className="text-center">
                  <span className="px-3 py-1 rounded-full bg-[#07080a]/80 backdrop-blur text-[10px] font-tech text-[#d4ff00] border border-[#d4ff00]/30 tracking-wider">
                    {facingMode === 'user'
                      ? 'USER MODE ACTIVE // ALIGN ROOM OR WORKSPACE IN FRAME'
                      : 'ENVIRONMENT MODE ACTIVE // ALIGN ROOM HAZARDS IN FRAME'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-[#d4ff00]" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-[#d4ff00]" />
                </div>
              </div>
            </div>

            {/* Camera Bottom Controls */}
            <div className="p-4 bg-[#07080a] border-t border-white/[0.06] flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleCloseCamera}
                className="px-4 py-2 rounded-xl bg-[#111317] hover:bg-[#181b22] text-zinc-400 hover:text-white text-xs font-tech border border-white/10 cursor-pointer"
              >
                DISMISS
              </button>

              {/* Shutter Button */}
              <button
                id="shutter-capture-btn"
                type="button"
                onClick={handleCaptureSnapshot}
                title="Capture Frame"
                className="group relative flex items-center justify-center cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full border-2 border-[#d4ff00]/60 p-1 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-[#d4ff00] group-active:scale-95 transition-transform shadow-[0_0_20px_rgba(212,255,0,0.5)] flex items-center justify-center text-[#07080a]">
                    <Aperture size={24} strokeWidth={2.5} />
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCloseCamera();
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 rounded-xl bg-[#111317] hover:bg-[#181b22] text-zinc-400 hover:text-white text-xs font-tech border border-white/10 cursor-pointer"
              >
                BROWSE FILES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Upload / Preview Area */}
      {!selectedPreview ? (
        <div
          id="dropzone-area"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-2xl border transition-all p-8 sm:p-12 text-center bg-[#0b0d11] backdrop-blur ${
            dragActive
              ? 'border-[#d4ff00] bg-[#d4ff00]/[0.03] scale-[1.01]'
              : 'border-white/[0.08] hover:border-white/20'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[#111317] border border-white/10 text-[#d4ff00] flex items-center justify-center mb-4">
              <UploadCloud size={26} />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Capture or ingest room visual
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed">
              Activate camera feed with front or rear modes, or import existing photographic records.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                id="capture-camera-btn"
                type="button"
                disabled={isCameraLoading}
                onClick={() => startLiveCamera(defaultFacingMode)}
                className="px-5 py-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf000] text-[#07080a] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-[0_0_20px_rgba(212,255,0,0.22)] cursor-pointer disabled:opacity-50"
              >
                {isCameraLoading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Camera size={14} strokeWidth={2.5} />
                )}
                <span>{isCameraLoading ? 'Initializing Sensor...' : `Open Camera (${defaultFacingMode === 'user' ? 'User Mode' : 'Rear'})`}</span>
              </button>

              <button
                id="browse-files-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-[#111317] hover:bg-[#181b22] text-zinc-300 hover:text-white border border-white/[0.08] font-medium text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
              >
                <ImageIcon size={14} />
                <span>Browse Files</span>
              </button>
            </div>
          </div>

          {/* Quick preset test samples */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] text-left">
            <span className="text-[10px] font-tech text-zinc-400 uppercase tracking-wider block mb-3">
              Or test instantly with reference rooms:
            </span>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() =>
                  handleSelectPreset(SAMPLE_ROOM_IMAGES.livingRoomBefore, 'Living Room')
                }
                className="p-2 rounded-xl bg-[#07080a] hover:bg-[#111317] border border-white/[0.06] hover:border-white/20 transition text-left group cursor-pointer"
              >
                <img
                  src={SAMPLE_ROOM_IMAGES.livingRoomBefore}
                  alt="Living Room Sample"
                  className="w-full h-16 object-cover rounded-lg mb-2 opacity-80 group-hover:opacity-100"
                />
                <span className="text-xs text-zinc-200 font-medium block truncate">
                  Living Room
                </span>
                <span className="text-[10px] font-tech text-amber-400 block">Trip & Power</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectPreset(SAMPLE_ROOM_IMAGES.homeOffice, 'Home Office')
                }
                className="p-2 rounded-xl bg-[#07080a] hover:bg-[#111317] border border-white/[0.06] hover:border-white/20 transition text-left group cursor-pointer"
              >
                <img
                  src={SAMPLE_ROOM_IMAGES.homeOffice}
                  alt="Home Office Sample"
                  className="w-full h-16 object-cover rounded-lg mb-2 opacity-80 group-hover:opacity-100"
                />
                <span className="text-xs text-zinc-200 font-medium block truncate">
                  Workspace
                </span>
                <span className="text-[10px] font-tech text-[#d4ff00] block">Cable Conductor</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectPreset(SAMPLE_ROOM_IMAGES.kitchen, 'Kitchen')
                }
                className="p-2 rounded-xl bg-[#07080a] hover:bg-[#111317] border border-white/[0.06] hover:border-white/20 transition text-left group cursor-pointer"
              >
                <img
                  src={SAMPLE_ROOM_IMAGES.kitchen}
                  alt="Kitchen Sample"
                  className="w-full h-16 object-cover rounded-lg mb-2 opacity-80 group-hover:opacity-100"
                />
                <span className="text-xs text-zinc-200 font-medium block truncate">
                  Kitchen
                </span>
                <span className="text-[10px] font-tech text-red-400 block">Thermal Proximity</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Preview State */
        <div
          id="image-preview-card"
          className="rounded-2xl border border-white/[0.08] bg-[#0b0d11] p-5 shadow-2xl"
        >
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-[360px] flex items-center justify-center border border-white/[0.06]">
            <img
              src={selectedPreview}
              alt="Uploaded room preview"
              className="w-full h-full object-contain"
            />
            <button
              id="remove-image-corner-btn"
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-[#07080a]/80 hover:bg-red-500 text-white transition shadow-lg cursor-pointer"
              title="Remove image"
            >
              <X size={15} />
            </button>
          </div>

          {/* Room Name Input */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 font-tech">
            <label className="text-xs text-zinc-400 uppercase tracking-wider whitespace-nowrap">
              Zone Identifier:
            </label>
            <input
              id="room-name-input"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Living Quarters, Home Workspace, Kitchen"
              className="flex-1 bg-[#07080a] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4ff00]/60 font-sans"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
            <button
              id="remove-image-btn"
              type="button"
              onClick={handleRemoveImage}
              disabled={isAnalyzing}
              className="px-4 py-2 rounded-xl bg-[#111317] hover:bg-[#181b22] text-zinc-300 font-medium text-xs uppercase tracking-wider border border-white/[0.08] transition cursor-pointer"
            >
              Retake / Cancel
            </button>

            <button
              id="analyze-safety-btn"
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-6 py-2.5 rounded-xl bg-[#d4ff00] hover:bg-[#bbf000] text-[#07080a] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-[0_0_20px_rgba(212,255,0,0.22)] cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={14} />
              <span>Execute AI Screening</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
