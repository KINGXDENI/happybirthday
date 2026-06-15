import { useState, useEffect, useRef } from 'react';
import { Download, ArrowLeft, Heart, RefreshCw, Sparkles, Share2, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';

interface QrGeneratorProps {
  onBack: () => void;
}

const COLORS = [
  { name: 'Deep Pink', hex: '#db2777' },
  { name: 'Warm Red', hex: '#e11d48' },
  { name: 'Coffee Brown', hex: '#6f4e37' },
  { name: 'Forest Green', hex: '#15803d' },
  { name: 'Classic Black', hex: '#0b141a' },
];

export const QrGenerator = ({ onBack }: QrGeneratorProps) => {
  const [url, setUrl] = useState(() => {
    // Default to the current site origin
    return window.location.origin;
  });
  const [selectedColor, setSelectedColor] = useState('#db2777'); // Deep Pink
  const [qrStyle, setQrStyle] = useState<'heart' | 'square'>('heart'); // 'heart' is default
  const [includeCenterHeart, setIncludeCenterHeart] = useState(true);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const drawQrCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Generate QR matrix with High error correction (important for scan stability)
      const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
      const { size, data } = qr.modules;

      if (qrStyle === 'heart') {
        // --- STYLE 1: HEART-SHAPED QR CODE (FULL HEART MASKING AS REQUESTED) ---
        const cellSize = 11;
        const qrWidth = size * cellSize;
        const diagonal = Math.sqrt(2) * qrWidth;
        const padding = 50;
        const canvasSize = Math.ceil(diagonal + padding * 2);
        
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;

        // Clear canvas & Draw background (warm cream paper background)
        ctx.fillStyle = '#faf6ee';
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // Draw vintage dashed border around the polaroid frame
        ctx.strokeStyle = '#d5ccb6';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(10, 10, canvasSize - 20, canvasSize - 20);
        ctx.setLineDash([]);

        // Define the heart shape path for clipping
        const heartWidth = diagonal * 1.02;
        const heartHeight = diagonal * 1.02;
        const hx = centerX - heartWidth / 2;
        // Offset Y slightly upwards to center the heart's visual center of gravity
        const hy = centerY - heartHeight / 2 - (diagonal * 0.04);

        const heartPath = new Path2D();
        const topCurveHeight = heartHeight * 0.28;
        
        heartPath.moveTo(hx + heartWidth / 2, hy + topCurveHeight);
        // Top left curve
        heartPath.bezierCurveTo(
          hx + heartWidth / 2, hy, 
          hx, hy, 
          hx, hy + topCurveHeight
        );
        // Bottom left curve
        heartPath.bezierCurveTo(
          hx, hy + (heartHeight + topCurveHeight) / 2, 
          hx + heartWidth * 0.35, hy + heartHeight * 0.85, 
          hx + heartWidth / 2, hy + heartHeight
        );
        // Bottom right curve
        heartPath.bezierCurveTo(
          hx + heartWidth * 0.65, hy + heartHeight * 0.85, 
          hx + heartWidth, hy + (heartHeight + topCurveHeight) / 2, 
          hx + heartWidth, hy + topCurveHeight
        );
        // Top right curve
        heartPath.bezierCurveTo(
          hx + heartWidth, hy, 
          hx + heartWidth / 2, hy, 
          hx + heartWidth / 2, hy + topCurveHeight
        );
        heartPath.closePath();

        // Draw a soft, decorative pinkish outline behind the modules to define the heart border
        ctx.strokeStyle = `${selectedColor}15`;
        ctx.lineWidth = 4;
        ctx.stroke(heartPath);

        // Step A: Draw standard data modules (WITH heart clipping mask)
        ctx.save();
        ctx.clip(heartPath);
        ctx.translate(centerX, centerY);
        // Rotate 135 degrees so the Finder Patterns sit at Left, Right, and Bottom
        // and the corner without a Finder Pattern (Bottom-Right) sits at the top (which is cut by the heart cleavage)
        ctx.rotate(135 * Math.PI / 180);
        ctx.fillStyle = selectedColor;

        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            const isDark = data[r * size + c];
            if (!isDark) continue;

            // Check if this module belongs to a Finder Pattern (3 corner squares)
            const isFinder = (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
            if (isFinder) continue; // Skip here, will be drawn unclipped in Step B for reliability

            const x = (c - size / 2) * cellSize;
            const y = (r - size / 2) * cellSize;
            ctx.fillRect(x, y, cellSize + 0.5, cellSize + 0.5);
          }
        }
        ctx.restore();

        // Step B: Draw Finder Patterns (WITHOUT clipping mask so they stay 100% solid and scannable)
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(135 * Math.PI / 180);
        ctx.fillStyle = selectedColor;

        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            const isDark = data[r * size + c];
            if (!isDark) continue;

            const isFinder = (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
            if (!isFinder) continue;

            const x = (c - size / 2) * cellSize;
            const y = (r - size / 2) * cellSize;
            ctx.fillRect(x, y, cellSize + 0.5, cellSize + 0.5);
          }
        }
        ctx.restore();

      } else {
        // --- STYLE 2: CLASSIC SQUARE QR WITH MICRO HEART MODULES & CENTRAL HEART LOGO ---
        const padding = 40;
        const cellSize = 10;
        const qrWidth = size * cellSize;
        const canvasSize = qrWidth + padding * 2;
        
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        // Clear canvas & Draw background
        ctx.fillStyle = '#faf6ee';
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // Dashed border
        ctx.strokeStyle = '#d5ccb6';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(10, 10, canvasSize - 20, canvasSize - 20);
        ctx.setLineDash([]);

        const drawHeartModule = (x: number, y: number, w: number) => {
          ctx.beginPath();
          const d = w / 1.8;
          const cx = x + w / 2;
          const cy = y + w / 2 - d / 5;
          
          ctx.moveTo(cx, cy + d / 4);
          ctx.bezierCurveTo(cx, cy, cx - d / 2, cy, cx - d / 2, cy + d * 0.6);
          ctx.bezierCurveTo(cx - d / 2, cy + d * 1.1, cx, cy + d * 1.5, cx, cy + d * 1.8);
          ctx.bezierCurveTo(cx, cy + d * 1.5, cx + d / 2, cy + d * 1.1, cx + d / 2, cy + d * 0.6);
          ctx.bezierCurveTo(cx + d / 2, cy, cx, cy, cx, cy + d / 4);
          ctx.closePath();
          ctx.fill();
        };

        ctx.fillStyle = selectedColor;

        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            const isDark = data[r * size + c];
            if (!isDark) continue;

            const x = padding + c * cellSize;
            const y = padding + r * cellSize;

            const isTopLeftFinder = r < 7 && c < 7;
            const isTopRightFinder = r < 7 && c >= size - 7;
            const isBottomLeftFinder = r >= size - 7 && c < 7;

            if (isTopLeftFinder || isTopRightFinder || isBottomLeftFinder) {
              // Standard solid squares for finders
              ctx.fillRect(x, y, cellSize, cellSize);
            } else {
              // Body modules as micro hearts, leaving space in center if requested
              const centerStart = Math.floor(size / 2) - 2;
              const centerEnd = Math.floor(size / 2) + 2;
              const isCenterArea = includeCenterHeart && 
                                   r >= centerStart && r <= centerEnd && 
                                   c >= centerStart && c <= centerEnd;

              if (!isCenterArea) {
                drawHeartModule(x, y, cellSize);
              }
            }
          }
        }

        // Draw central heart logo (if enabled)
        if (includeCenterHeart) {
          const center = canvasSize / 2;
          const heartSize = cellSize * 5;
          const cx = center;
          const cy = center - heartSize / 10;
          const d = heartSize / 1.8;

          ctx.fillStyle = '#faf6ee';
          ctx.beginPath();
          ctx.arc(center, center, heartSize / 1.8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#faf6ee';
          ctx.shadowColor = 'rgba(139,92,26,0.15)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetY = 3;
          
          ctx.beginPath();
          const outerD = d + 4;
          ctx.moveTo(cx, cy + outerD / 4);
          ctx.bezierCurveTo(cx, cy, cx - outerD / 2, cy, cx - outerD / 2, cy + outerD * 0.6);
          ctx.bezierCurveTo(cx - outerD / 2, cy + outerD * 1.1, cx, cy + outerD * 1.5, cx, cy + outerD * 1.8);
          ctx.bezierCurveTo(cx, cy + outerD * 1.5, cx + outerD / 2, cy + outerD * 1.1, cx + outerD / 2, cy + outerD * 0.6);
          ctx.bezierCurveTo(cx + outerD / 2, cy, cx, cy, cx, cy + outerD / 4);
          ctx.closePath();
          ctx.fill();

          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;

          ctx.fillStyle = selectedColor;
          ctx.beginPath();
          ctx.moveTo(cx, cy + d / 4);
          ctx.bezierCurveTo(cx, cy, cx - d / 2, cy, cx - d / 2, cy + d * 0.6);
          ctx.bezierCurveTo(cx - d / 2, cy + d * 1.1, cx, cy + d * 1.5, cx, cy + d * 1.8);
          ctx.bezierCurveTo(cx, cy + d * 1.5, cx + d / 2, cy + d * 1.1, cx + d / 2, cy + d * 0.6);
          ctx.bezierCurveTo(cx + d / 2, cy, cx, cy, cx, cy + d / 4);
          ctx.closePath();
          ctx.fill();
          
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.beginPath();
          ctx.ellipse(cx - d/4, cy + d/3, d/7, d/12, Math.PI / -4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } catch (err) {
      console.error('Failed to generate QR Code:', err);
    }
  };

  useEffect(() => {
    drawQrCode();
  }, [url, selectedColor, qrStyle, includeCenterHeart]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas to image and trigger download
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `qrcode-${qrStyle === 'heart' ? 'hati' : 'klasik'}-keiza.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f1ea] flex flex-col items-center justify-center p-4 relative overflow-y-auto text-[#2d2a29] py-12">
      {/* Scrapbook Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,26,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,26,0.03)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* Back button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono tracking-widest text-[#a16207] hover:text-[#854d0e] transition-colors uppercase cursor-pointer z-10"
      >
        <ArrowLeft size={14} />
        Kembali ke Beranda
      </button>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-center mt-6">
        {/* Left: Settings Panel */}
        <div className="md:col-span-6 flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-[0_15px_30px_rgba(139,92,26,0.05)] relative">
          {/* Washi Tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-[22px] bg-[#eae1d0]/75 border border-dashed border-[#b8ab96]/30 shadow-sm z-20 rotate-[-1deg] pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Share2 size={18} className="text-pink-500" />
              <h2 className="font-serif text-2xl font-bold text-[#2d2a29]">QR Code Cinta 💖</h2>
            </div>
            <p className="font-handwriting text-2xl text-zinc-500 leading-relaxed">
              Buat QR Code cantik berbentuk hati untuk dicetak atau dibagikan ke Keiza!
            </p>
          </div>

          <div className="flex flex-col gap-5 border-t border-dashed border-zinc-200 pt-5">
            {/* QR Style Selector */}
            <div>
              <label className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase mb-2">Pilih Model QR Code</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setQrStyle('heart')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1.5 ${
                    qrStyle === 'heart'
                      ? 'border-pink-500 bg-pink-500/5 text-[#2d2a29]'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100/50'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Heart size={13} className={qrStyle === 'heart' ? 'text-pink-500 fill-pink-500' : 'text-zinc-400'} />
                    Hati Romantis
                  </span>
                  <span className="text-[10px] text-zinc-400 leading-normal">
                    Seluruh QR dipotong membentuk hati besar (seperti contoh).
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setQrStyle('square')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1.5 ${
                    qrStyle === 'square'
                      ? 'border-pink-500 bg-pink-500/5 text-[#2d2a29]'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100/50'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <RefreshCw size={13} className={qrStyle === 'square' ? 'text-pink-500' : 'text-zinc-400'} />
                    Scrapbook Klasik
                  </span>
                  <span className="text-[10px] text-zinc-400 leading-normal">
                    Persegi dengan pixel bermotif hati-hati kecil.
                  </span>
                </button>
              </div>
            </div>

            {/* Input Link */}
            <div>
              <label className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase mb-1.5">Link Website Ulang Tahun</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500 bg-zinc-50 font-mono text-xs"
                  placeholder="Masukkan link web"
                  required
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100 text-[#2d2a29] rounded-xl text-xs font-mono tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-200"
                >
                  {copied ? <Check size={14} className="text-green-600 animate-bounce" /> : <Copy size={14} className="text-zinc-500" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1.5 font-mono">
                * Secara default mendeteksi link website Anda saat ini.
              </p>
            </div>

            {/* Color Selector */}
            <div>
              <label className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase mb-1.5">Pilih Warna QR Code</label>
              <div className="flex flex-wrap gap-2.5">
                {COLORS.map(color => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setSelectedColor(color.hex)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-all hover:scale-102"
                    style={{
                      borderColor: selectedColor === color.hex ? color.hex : '#e4e4e7',
                      backgroundColor: selectedColor === color.hex ? `${color.hex}10` : '#fafafa',
                      color: selectedColor === color.hex ? color.hex : '#52525b'
                    }}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full inline-block border border-black/5" 
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Center Heart Toggle (Only for Square style) */}
            {qrStyle === 'square' && (
              <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-xl border border-zinc-200/50 mt-1">
                <div className="flex flex-col">
                  <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Logo Hati di Tengah</span>
                  <span className="text-xs text-zinc-500 mt-0.5">Menambahkan simbol hati pink besar di tengah QR.</span>
                </div>
                <button
                  onClick={() => setIncludeCenterHeart(!includeCenterHeart)}
                  className={`w-12 h-[26px] rounded-full p-1 transition-colors cursor-pointer ${
                    includeCenterHeart ? 'bg-pink-500' : 'bg-zinc-300'
                  }`}
                >
                  <div 
                    className={`bg-white w-[18px] h-[18px] rounded-full shadow transition-transform ${
                      includeCenterHeart ? 'translate-x-[22px]' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleDownload}
            className="w-full bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-medium py-3 rounded-full shadow transition-all cursor-pointer flex items-center justify-center gap-2 text-sm mt-2 font-mono tracking-wide"
          >
            <Download size={15} />
            <span>Download Gambar QR (.png)</span>
          </button>

          {/* Sweet Tip Box */}
          <div className="bg-[#faf6ee]/70 p-4 rounded-xl border border-dashed border-[#d5ccb6] text-xs text-[#854d0e] leading-relaxed flex gap-2.5 mt-1">
            <span className="text-base select-none">💡</span>
            <div>
              <strong className="font-serif text-sm block mb-1">Ide Memberi Kejutan:</strong>
              Cetak QR Code Polaroid ini di kertas foto, tempel di kado fisikmu (seperti cokelat atau bunga), lalu minta Keiza memindainya! Atau kamu juga bisa mengirimkannya langsung lewat chat WhatsApp.
            </div>
          </div>
        </div>

        {/* Right: Preview Panel (Polaroid Card) */}
        <div className="md:col-span-6 flex justify-center">
          <div className="relative">
            {/* Washi Tape */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#eae1d0]/75 border border-dashed border-[#b8ab96]/30 shadow-sm z-20 rotate-[-2deg] pointer-events-none" />

            {/* Polaroid Photo Frame */}
            <div className="bg-white p-5 pb-10 rounded-sm shadow-[0_15px_35px_rgba(139,92,26,0.12)] border border-zinc-200/50 rotate-[1.5deg] max-w-[360px] flex flex-col items-center transition-all duration-300">
              {/* QR Canvas Container */}
              <div className="bg-[#faf6ee] p-2.5 border border-[#d5ccb6] rounded-md shadow-inner flex items-center justify-center overflow-hidden">
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full aspect-square w-72 h-72 shadow-xs transition-all duration-300"
                />
              </div>

              {/* Polaroid bottom caption */}
              <div className="text-center mt-5 font-handwriting text-[#a16207] text-2xl tracking-wide select-none flex items-center gap-1.5">
                <Heart size={16} className="text-pink-500 fill-pink-500 animate-pulse" />
                Scan Me untuk Kejutan
                <Sparkles size={14} className="text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
