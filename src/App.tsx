/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Trash2, Image as ImageIcon, Sliders, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tolerance, setTolerance] = useState(20);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = () => {
    if (!image || !canvasRef.current) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple white-to-transparent algorithm
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Check if color is close to white based on tolerance
        // White is (255, 255, 255)
        if (r > 255 - tolerance && g > 255 - tolerance && b > 255 - tolerance) {
          data[i + 3] = 0; // Set alpha to 0
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedImage(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    };
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.download = 'transparent-logo.png';
    link.href = processedImage;
    link.click();
  };

  const clearAll = () => {
    setImage(null);
    setProcessedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] font-sans text-[#1C1917] selection:bg-orange-100 p-6 md:p-12 lg:p-24 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1C1917]">
            Transparent <span className="text-orange-600">Logo</span> Maker
          </h1>
          <p className="text-xl text-[#44403C] max-w-2xl mx-auto">
            Instantly turn white backgrounds transparent. Perfect for logos like Oasis Escrow.
          </p>
        </div>

        {!image ? (
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => fileInputRef.current?.click()}
            className="group relative cursor-pointer border-2 border-dashed border-[#D6D3D1] rounded-3xl p-12 md:p-24 bg-white hover:border-orange-500/50 hover:bg-orange-50/10 transition-all duration-300"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Upload className="w-10 h-10 text-orange-600" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-semibold">Drop your image here</p>
                <p className="text-[#78716C]">Supports PNG, JPG, WEBP</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#A8A29E]">Original</h3>
                <button 
                  onClick={clearAll}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E7E5E4] aspect-square flex items-center justify-center overflow-hidden">
                <img src={image} alt="Original" className="max-w-full max-h-full object-contain" />
              </div>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#A8A29E]">Processed</h3>
                {processedImage && (
                  <button 
                    onClick={downloadImage}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all shadow-md active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                )}
              </div>
              <div className="relative bg-[#F5F5F4] rounded-2xl shadow-sm border border-[#E7E5E4] aspect-square flex items-center justify-center overflow-hidden">
                {/* Checkerboard Pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'conic-gradient(#000 0.25turn, transparent 0 0.5turn, #000 0 0.75turn, transparent 0)',
                    backgroundSize: '20px 20px'
                  }}
                />
                
                {processedImage ? (
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={processedImage} 
                    alt="Processed" 
                    className="relative z-10 max-w-full max-h-full object-contain" 
                  />
                ) : (
                  <div className="relative z-10 flex flex-col items-center space-y-4 text-[#A8A29E]">
                    <ImageIcon className="w-16 h-16 opacity-20" />
                    <p className="text-sm">Process to see result</p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-lg border border-[#E7E5E4] space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-orange-600" />
                    <label className="font-bold text-lg">Whitelist Tolerance</label>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={tolerance} 
                      onChange={(e) => setTolerance(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-[#E7E5E4] rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <span className="w-12 text-right font-mono font-bold text-orange-600">{tolerance}</span>
                  </div>
                  <p className="text-sm text-[#78716C]">Increase if the edges are still white, decrease if parts of the logo become transparent.</p>
                </div>
                
                <button
                  onClick={removeBackground}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-3 px-12 py-4 bg-[#1C1917] hover:bg-[#44403C] text-white rounded-2xl font-bold text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl hover:shadow-orange-900/10"
                >
                  {isProcessing ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Process Image
                      <Check className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Footer Info */}
      <footer className="mt-24 text-center space-y-2 opacity-50 text-sm">
        <p>© 2026 Oasis Escrow Logo Tool</p>
        <p className="max-w-md">Processing occurs entirely in your browser. Your images are never uploaded to any server.</p>
      </footer>
    </div>
  );
}

