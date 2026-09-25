import React, { useState, useRef, useEffect } from 'react';
import { Upload, Link as LinkIcon, Crop as CropIcon, RotateCw, ZoomIn, ZoomOut, Check, X, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface ImageInputWithCropProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  aspectRatioPreset?: '16:9' | '3:4' | '1:1' | 'free';
  placeholder?: string;
}

export const ImageInputWithCrop: React.FC<ImageInputWithCropProps> = ({
  label = 'IMAGE ASSET',
  value = '',
  onChange,
  aspectRatioPreset = '16:9',
  placeholder = 'https://example.com/image.webp or /assets/...',
}) => {
  const [activeTab, setActiveTab] = useState<'link' | 'upload'>('link');
  const [inputUrl, setInputUrl] = useState(value);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  // Crop configuration state
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '3:4' | '1:1' | 'free'>(aspectRatioPreset);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setInputUrl(value);
  }, [value]);

  const handleUrlChange = (newVal: string) => {
    setInputUrl(newVal);
    onChange(newVal);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setRawImageSrc(dataUrl);
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleOpenCropForCurrent = () => {
    if (!value) return;
    setRawImageSrc(value);
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    setCropModalOpen(true);
  };

  // Dragging for pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Perform canvas crop
  const handleApplyCrop = () => {
    if (!imageRef.current || !rawImageSrc) {
      setCropModalOpen(false);
      return;
    }

    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetWidth = 1280;
    let targetHeight = 720;

    if (aspectRatio === '16:9') {
      targetWidth = 1280;
      targetHeight = 720;
    } else if (aspectRatio === '3:4') {
      targetWidth = 900;
      targetHeight = 1200;
    } else if (aspectRatio === '1:1') {
      targetWidth = 800;
      targetHeight = 800;
    } else {
      targetWidth = img.naturalWidth || 1000;
      targetHeight = img.naturalHeight || 750;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.save();
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(offset.x, offset.y);

    const aspect = img.naturalWidth / img.naturalHeight;
    const targetAspect = targetWidth / targetHeight;

    let renderW = targetWidth;
    let renderH = targetHeight;

    if (aspect > targetAspect) {
      renderH = targetHeight;
      renderW = targetHeight * aspect;
    } else {
      renderW = targetWidth;
      renderH = targetWidth / aspect;
    }

    ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
    ctx.restore();

    try {
      const croppedDataUrl = canvas.toDataURL('image/webp', 0.92);
      onChange(croppedDataUrl);
      setInputUrl(croppedDataUrl);
      setCropModalOpen(false);
    } catch {
      // Cross-origin fallback
      if (rawImageSrc) {
        onChange(rawImageSrc);
      }
      setCropModalOpen(false);
    }
  };

  return (
    <div className="space-y-2 font-editorial-mono">
      {label && (
        <div className="flex items-center justify-between text-[11px] text-[#788698] uppercase">
          <span>{label}</span>
          {value && (
            <button
              type="button"
              onClick={handleOpenCropForCurrent}
              className="text-[#9e2a2b] hover:text-[#b83538] flex items-center gap-1 font-semibold"
            >
              <CropIcon className="w-3 h-3" />
              <span>CROP IMAGE</span>
            </button>
          )}
        </div>
      )}

      {/* Tabs: Link vs Upload */}
      <div className="flex items-center gap-2 border-b border-[#1b2533] pb-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('link')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs uppercase tracking-wider transition-colors ${
            activeTab === 'link'
              ? 'text-white border-b-2 border-[#9e2a2b] font-bold'
              : 'text-[#687688] hover:text-[#c0c9d6]'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>IMAGE LINK / URL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs uppercase tracking-wider transition-colors ${
            activeTab === 'upload'
              ? 'text-white border-b-2 border-[#9e2a2b] font-bold'
              : 'text-[#687688] hover:text-[#c0c9d6]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>UPLOAD & CROP</span>
        </button>
      </div>

      {/* Tab 1: Enter link with immediate preview and optional crop */}
      {activeTab === 'link' ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-[#05070a] border border-[#1b2533] focus:border-[#9e2a2b] px-3 py-2 text-xs text-white outline-none transition-colors"
            />
            {inputUrl && (
              <button
                type="button"
                onClick={handleOpenCropForCurrent}
                title="Crop this linked image"
                className="px-3 py-2 border border-[#2b394d] bg-[#0c121b] hover:border-[#9e2a2b] text-xs text-[#cad4e0] flex items-center gap-1 shrink-0"
              >
                <CropIcon className="w-3.5 h-3.5 text-[#9e2a2b]" />
                <span>CROP</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Tab 2: Upload File with Crop Trigger */
        <div className="space-y-2">
          <label className="border-2 border-dashed border-[#1f2b3b] hover:border-[#9e2a2b] bg-[#070b10] hover:bg-[#0c1219] p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
            <Upload className="w-6 h-6 text-[#5e6f82] group-hover:text-[#9e2a2b] transition-colors" />
            <span className="text-xs text-[#8c9baa]">
              Click to select image file to crop & save
            </span>
            <span className="text-[10px] text-[#4d5c6e]">
              PNG, JPG, WEBP supported
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Live Preview Bar */}
      {value && (
        <div className="flex items-center gap-3 p-2 border border-[#1b2533] bg-[#070b10] rounded">
          <div className="w-14 h-10 bg-[#0c1119] border border-[#1a2330] overflow-hidden shrink-0 flex items-center justify-center">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-[#6d7b8c] uppercase block">ACTIVE IMAGE ASSET:</span>
            <span className="text-xs text-[#d1d8e0] truncate block font-mono">
              {value.startsWith('data:') ? 'Custom Cropped Asset (Base64)' : value}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleUrlChange('')}
            className="p-1 text-[#667485] hover:text-[#e06c75] transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Crop Modal */}
      {cropModalOpen && rawImageSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCropModalOpen(false);
          }}
        >
          <div className="relative max-w-3xl w-full border border-[#2b384c] bg-[#080c12] p-5 sm:p-6 space-y-4 shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2533]">
              <div className="flex items-center gap-2 text-xs text-white uppercase font-bold tracking-wider">
                <CropIcon className="w-4 h-4 text-[#9e2a2b]" />
                <span>IMAGE CROP & COMPOSITION SUITE</span>
              </div>
              <button
                type="button"
                onClick={() => setCropModalOpen(false)}
                className="p-1 text-[#788799] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aspect Ratio Presets */}
            <div className="flex items-center gap-2 overflow-x-auto text-[11px] pb-1">
              <span className="text-[#647283] uppercase mr-1">ASPECT:</span>
              {(['16:9', '3:4', '1:1', 'free'] as const).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAspectRatio(preset)}
                  className={`px-2.5 py-1 border transition-colors ${
                    aspectRatio === preset
                      ? 'border-[#9e2a2b] bg-[#1a080b] text-[#f2afb2] font-bold'
                      : 'border-[#1b2533] bg-[#05070a] text-[#818f9f] hover:text-white'
                  }`}
                >
                  {preset.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Interactive Crop Viewport */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`relative w-full h-[320px] sm:h-[400px] bg-[#030508] border border-[#1b2533] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none`}
            >
              <img
                ref={imageRef}
                src={rawImageSrc}
                alt="Crop Target"
                crossOrigin="anonymous"
                draggable={false}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  maxWidth: 'none',
                  maxHeight: 'none',
                }}
                className="pointer-events-none"
              />

              {/* Composition Overlay Frame */}
              <div
                className={`pointer-events-none absolute border-2 border-[#9e2a2b]/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] ${
                  aspectRatio === '16:9'
                    ? 'w-[85%] aspect-[16/9]'
                    : aspectRatio === '3:4'
                    ? 'h-[85%] aspect-[3/4]'
                    : aspectRatio === '1:1'
                    ? 'h-[80%] aspect-square'
                    : 'w-[90%] h-[90%]'
                }`}
              >
                {/* Rule of Thirds Lines */}
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none">
                  <div className="border-r border-b border-white/10" />
                  <div className="border-r border-b border-white/10" />
                  <div className="border-b border-white/10" />
                  <div className="border-r border-b border-white/10" />
                  <div className="border-r border-b border-white/10" />
                  <div className="border-b border-white/10" />
                  <div className="border-r border-white/10" />
                  <div className="border-r border-white/10" />
                  <div />
                </div>
              </div>
            </div>

            {/* Controls Bar: Zoom & Rotate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
              <div className="flex items-center gap-3">
                <ZoomOut className="w-4 h-4 text-[#667485]" />
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#9e2a2b] bg-[#161f2c] h-1.5 rounded cursor-pointer"
                />
                <ZoomIn className="w-4 h-4 text-[#667485]" />
                <span className="text-xs text-[#a0abb8] w-12 text-right">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="px-3 py-1.5 border border-[#222d3b] bg-[#0c121b] text-xs text-[#9aa7b7] hover:text-white flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>ROTATE 90°</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setRotation(0);
                    setOffset({ x: 0, y: 0 });
                  }}
                  className="px-3 py-1.5 border border-[#222d3b] bg-[#0c121b] text-xs text-[#9aa7b7] hover:text-white flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>RESET</span>
                </button>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#1b2533]">
              <button
                type="button"
                onClick={() => {
                  // Use as-is without cropping
                  onChange(rawImageSrc);
                  setInputUrl(rawImageSrc);
                  setCropModalOpen(false);
                }}
                className="px-4 py-2 border border-[#243142] text-xs text-[#8c9baa] hover:text-white"
              >
                [ USE AS-IS (NO CROP) ]
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCropModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#6e7d8f] hover:text-white"
                >
                  CANCEL
                </button>

                <button
                  type="button"
                  onClick={handleApplyCrop}
                  className="px-6 py-2 bg-[#9e2a2b] hover:bg-[#b53235] text-white text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 border border-[#9e2a2b] shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  <span>APPLY CROP & SAVE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
