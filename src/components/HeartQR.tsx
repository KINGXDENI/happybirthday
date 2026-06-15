import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

interface HeartQRProps {
  value: string;
  size?: number;
}

const HeartQR = ({ value, size = 280 }: HeartQRProps) => {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Heart Shape to Clip the QR */}
      <div 
        className="absolute inset-0 bg-white" 
        style={{ 
          clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")',
          transform: `scale(${size / 24})`,
          transformOrigin: 'top left'
        }}
      />
      
      {/* The QR Code itself */}
      <div style={{ clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")', transform: `scale(${size / 24})`, transformOrigin: 'top left' }} className="absolute inset-0 flex items-center justify-center bg-white p-2">
         <div style={{ transform: `scale(${24 / size})`, transformOrigin: 'center' }}>
            <QRCodeSVG 
                value={value} 
                size={size * 1.2} 
                level="H" 
                includeMargin={false}
                imageSettings={{
                    src: "https://cdn-icons-png.flaticon.com/512/833/833472.png",
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                }}
            />
         </div>
      </div>

      {/* Aesthetic Border/Frame */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none border-2 border-pink-500/20 rounded-full blur-xl"
      />
    </div>
  );
};

export default HeartQR;
