
import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        Html5Qrcode: any;
    }
}
interface ScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError: (errorMessage: string) => void;
}

const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
    const minEdgePercentage = 0.7; // 70%
    const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
    const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
    return {
        width: qrboxSize,
        height: qrboxSize,
    };
};

const Scanner: React.FC<ScannerProps> = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    const qrReaderElementId = "qr-reader";
    
    // Check if the scanner instance already exists to avoid re-initialization
    if (!scannerRef.current) {
      const html5QrCode = new window.Html5Qrcode(qrReaderElementId);
      scannerRef.current = html5QrCode;
      
      const config = { 
          fps: 10, 
          qrbox: qrboxFunction,
          aspectRatio: 1.0,
      };

      html5QrCode.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanError
      ).catch((err: any) => {
        console.error("Unable to start scanning.", err);
        onScanError("Could not start camera. Please grant permission.");
      });
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear();
          scannerRef.current = null;
        }).catch((err: any) => {
          console.error("Failed to stop the scanner.", err);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div id="qr-reader" className="w-full border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"></div>
      <p className="text-center text-sm text-gray-500 mt-2">
        Position a student's QR code within the frame.
      </p>
    </div>
  );
};

export default Scanner;
