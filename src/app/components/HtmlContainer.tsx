import React from 'react';

interface HtmlContainerProps {
  iframeUrl: string;
  onClose: () => void;
}

const HtmlContainer: React.FC<HtmlContainerProps> = ({ iframeUrl, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
      >
        Cerrar
      </button>
      <iframe src={iframeUrl} className="w-full h-full" />
    </div>
  );
};

export default HtmlContainer;
