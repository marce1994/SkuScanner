import React, { useEffect, useRef, useState } from 'react';

// @ts-expect-error this library doesnt have typings
import Quagga from 'quagga';

interface ScannerProps {
  onHtmlLoad: (url: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onHtmlLoad }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [skuResult, setSkuResult] = useState('');

  useEffect(() => {
    if (isScanning) {
      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: videoRef.current,
          },
          decoder: {
            readers: ['code_128_reader'],
          },
          locate: true,
        },
        (err: Error) => {
          if (err) {
            console.error(err);
            alert('Error al iniciar la cámara.');
            setIsScanning(false);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected(async (result: { codeResult: { code: string; }; }) => {
        const sku = result.codeResult.code;
        setSkuResult(sku);
        const pattern = /\b[A-Z]{2}\d{5}\b/;
        const match = sku.match(pattern);

        if (match) {
          const codigoSKU = match[0];
          const proxyUrl = `/api/proxy?url=${encodeURIComponent(
            `https://dameunbeso.com.ar/search/?q=${codigoSKU}`
          )}`;
          Quagga.stop();
          setIsScanning(false);
          onHtmlLoad(proxyUrl);
        }
      });
    }

    return () => {
      if (isScanning) {
        Quagga.stop();
      }
    };
  }, [isScanning, onHtmlLoad]);

  const startScan = () => {
    setIsScanning(true);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <button
          onClick={startScan}
          className="px-6 py-3 text-white hover:text-red-700 bg-gray-600 border-2 border-red-600 rounded-lg hover:bg-gray-700 hover:border-red-700"
        >
          INICIAR ESCANEO
        </button>
      </div>
      <div ref={videoRef} className={`w-full h-60 bg-gray-300 mt-6 rounded-lg ${isScanning ? '' : 'hidden'}`} />
      <div className="text-lg text-green-600 mt-4">{skuResult && `SKU Detectado: ${skuResult}`}</div>
    </div>
  );
};

export default Scanner;
