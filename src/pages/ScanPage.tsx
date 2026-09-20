import React, { useState, useEffect, useCallback } from 'react';
import { UploadZone } from '../components/UploadZone';
import { Disclaimer } from '../components/Disclaimer';
import { AppRoute } from '../types';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
  Sliders,
  Sparkles,
  Info,
  Terminal,
} from 'lucide-react';

interface ScanPageProps {
  onStartAnalysis: (imageData: { file?: File; dataUrl: string; roomName: string }) => void;
  isAnalyzing?: boolean;
  onNavigate: (route: AppRoute) => void;
}

export const ScanPage: React.FC<ScanPageProps> = ({
  onStartAnalysis,
  isAnalyzing = false,
  onNavigate,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<
    'prompt' | 'granted' | 'denied' | 'unsupported'
  >('prompt');
  const [isRequestingPermission, setIsRequestingPermission] = useState<boolean>(false);
  const [permissionMessage, setPermissionMessage] = useState<string | null>(null);

  // Default facing mode is 'user' as requested
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Check initial camera permission status using Permissions API if available
  useEffect(() => {
    let isMounted = true;

    async function checkCameraPermission() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (isMounted) setPermissionStatus('unsupported');
        return;
      }

      if ('permissions' in navigator && navigator.permissions.query) {
        try {
          const status = await navigator.permissions.query({
            name: 'camera' as PermissionName,
          });

          if (isMounted) {
            setPermissionStatus(status.state as 'prompt' | 'granted' | 'denied');
          }

          status.onchange = () => {
            if (isMounted) {
              setPermissionStatus(status.state as 'prompt' | 'granted' | 'denied');
              if (status.state === 'granted') {
                setPermissionMessage('Camera access granted.');
              } else if (status.state === 'denied') {
                setPermissionMessage('Camera access is blocked in browser settings.');
              }
            }
          };
        } catch (e) {
          console.debug('Permissions API query camera not supported:', e);
        }
      }
    }

    checkCameraPermission();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handler to explicitly request media device permissions with the configured facing mode
  const handleRequestMediaPermissions = useCallback(
    async (mode: 'user' | 'environment' = facingMode): Promise<boolean> => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionStatus('unsupported');
        setPermissionMessage(
          'Media devices not supported in this browser. Please use file upload.'
        );
        return false;
      }

      setIsRequestingPermission(true);
      setPermissionMessage(null);

      try {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1920, min: 640 },
            height: { ideal: 1080, min: 480 },
          },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // Permission succeeded! Stop preliminary probe stream immediately to release hardware indicator
        stream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (err) {
            console.warn('Track stop note:', err);
          }
        });

        setPermissionStatus('granted');
        setPermissionMessage(
          `Camera sensor verified (${mode === 'user' ? 'User / Webcam sensor' : 'Environment sensor'}).`
        );
        setIsRequestingPermission(false);
        return true;
      } catch (err: any) {
        console.warn('Permission request error:', err);
        setIsRequestingPermission(false);

        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionStatus('denied');
          setPermissionMessage(
            'Camera permission blocked. Click the lock or camera icon in address bar to allow.'
          );
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setPermissionStatus('unsupported');
          setPermissionMessage('No camera device detected on this system.');
        } else {
          setPermissionMessage(
            `Camera note: ${err.message || 'Check camera permissions'}`
          );
        }
        return false;
      }
    },
    [facingMode]
  );

  return (
    <div id="scan-page" className="w-full bg-[#07080a] text-[#f4f4f5] min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-hud-grid">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Media Device & Camera Mode Bar */}
        <div
          id="camera-device-controls-bar"
          className="rounded-2xl border border-white/[0.08] bg-[#0b0d11] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-tech text-xs"
        >
          {/* Permission Status Indicator */}
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                permissionStatus === 'granted'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : permissionStatus === 'denied'
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : 'bg-white/[0.04] text-[#d4ff00] border-white/10'
              }`}
            >
              {permissionStatus === 'granted' ? (
                <CheckCircle2 size={16} />
              ) : permissionStatus === 'denied' ? (
                <Lock size={16} />
              ) : (
                <Camera size={16} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">
                  SENSOR ACCESS:{' '}
                  <span
                    className={
                      permissionStatus === 'granted'
                        ? 'text-emerald-400'
                        : permissionStatus === 'denied'
                        ? 'text-red-400'
                        : 'text-amber-400'
                    }
                  >
                    {permissionStatus === 'granted'
                      ? 'ACTIVE'
                      : permissionStatus === 'denied'
                      ? 'RESTRICTED'
                      : 'PROMPT'}
                  </span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#181b22] text-[#d4ff00] border border-white/10">
                  {facingMode === 'user' ? 'USER LENS' : 'ENVIRONMENT LENS'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                {permissionMessage ||
                  (permissionStatus === 'granted'
                    ? 'Sensor ready for high-fidelity spatial inspection'
                    : 'Grant sensor permission to activate real-time feed')}
              </p>
            </div>
          </div>

          {/* Facing Mode Selector & Actions */}
          <div className="flex items-center flex-wrap gap-2 self-stretch sm:self-auto justify-end">
            {/* Facing Mode Switcher */}
            <div
              id="facing-mode-selector"
              className="flex items-center bg-[#07080a] p-1 rounded-xl border border-white/10 text-xs"
            >
              <button
                type="button"
                id="mode-user-btn"
                onClick={() => {
                  setFacingMode('user');
                  if (permissionStatus === 'granted') {
                    handleRequestMediaPermissions('user');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  facingMode === 'user'
                    ? 'bg-[#181b22] text-white border border-white/20 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>User Mode (Webcam)</span>
              </button>
              <button
                type="button"
                id="mode-env-btn"
                onClick={() => {
                  setFacingMode('environment');
                  if (permissionStatus === 'granted') {
                    handleRequestMediaPermissions('environment');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  facingMode === 'environment'
                    ? 'bg-[#181b22] text-white border border-white/20 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>Rear (Environment)</span>
              </button>
            </div>

            {/* Explicit Request Permission Button */}
            {permissionStatus !== 'granted' && (
              <button
                id="grant-permission-btn"
                type="button"
                disabled={isRequestingPermission}
                onClick={() => handleRequestMediaPermissions(facingMode)}
                className="px-3 py-1.5 rounded-xl bg-[#111317] hover:bg-[#181b22] text-[#d4ff00] border border-white/10 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isRequestingPermission ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  <Camera size={13} />
                )}
                <span>
                  {isRequestingPermission
                    ? 'Verifying...'
                    : permissionStatus === 'denied'
                    ? 'Retry Access'
                    : 'Enable Camera'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Camera Blocked Troubleshooting Card */}
        {permissionStatus === 'denied' && (
          <div
            id="camera-blocked-alert"
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-red-300 block mb-0.5 font-tech">
                  CAMERA ACCESS RESTRICTED BY BROWSER
                </span>
                <p className="text-red-200/90 leading-relaxed font-sans">
                  To capture images directly: click the camera or lock icon in your browser URL bar, set <strong>Camera</strong> to <strong>Allow</strong>, then click Retry.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRequestMediaPermissions(facingMode)}
              className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 font-semibold text-xs border border-red-500/30 transition shrink-0 cursor-pointer font-tech"
            >
              RETRY SENSOR
            </button>
          </div>
        )}

        {/* Upload Zone configured with 'user' facing mode and media permission hooks */}
        <UploadZone
          onImageSelected={onStartAnalysis}
          isAnalyzing={isAnalyzing}
          defaultFacingMode={facingMode}
          permissionStatus={permissionStatus}
          onRequestPermission={() => handleRequestMediaPermissions(facingMode)}
        />

        {/* Notice Card */}
        <Disclaimer variant="card" />
      </div>
    </div>
  );
};
