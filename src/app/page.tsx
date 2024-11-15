'use client';
import React, { useState } from 'react';
import Scanner from '@/app/components/Scanner';
import HtmlContainer from '@/app/components/HtmlContainer';

const Loading = () => (
  <div className="flex justify-center items-center h-32 w-full">
    <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" role="status">
      <span className="sr-only">Cargando...</span>
    </div>
  </div>
);

export default function Home() {
  const [showHtml, setShowHtml] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleHtmlLoad = async (proxyUrl: string) => {
    setLoading(true);  // Set loading state to true when fetching HTML
    const response = await fetch(proxyUrl);
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    const targetElement = doc.querySelector(".product-grid a");

    if (targetElement) {
      // @ts-expect-error href is vanilla html element property
      const url = targetElement.href;
      setIframeUrl(url);
      setShowHtml(true);
    } else {
      alert("Producto no encontrado.");
    }
    setLoading(false);  // Set loading state to false after the operation is complete
  };

  const handleCloseHtml = () => {
    setIframeUrl('');
    setShowHtml(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      {!showHtml && <>
        <h1 className="text-2xl font-semibold text-gray-100 mb-4">Escáner de SKU con Cámara</h1>
        <Scanner onHtmlLoad={handleHtmlLoad} />
      </>
      }
      {loading && <Loading />} {/* Show loading spinner when loading is true */}
      {showHtml && (
        <HtmlContainer iframeUrl={iframeUrl} onClose={handleCloseHtml} />
      )}
    </div>
  );
}
