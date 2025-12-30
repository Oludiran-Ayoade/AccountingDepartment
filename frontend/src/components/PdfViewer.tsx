'use client';

import React from 'react';
import { X, Download, Maximize2 } from 'lucide-react';
import { Button } from './ui/Button';

interface PdfViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

export function PdfViewer({ fileUrl, fileName, onClose }: PdfViewerProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullscreen = () => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-background rounded-3xl w-full max-w-6xl h-[90vh] overflow-hidden shadow-2xl border border-border/50 flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground truncate">{fileName}</h2>
            <p className="text-xs text-muted-foreground">PDF Document</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
              className="flex items-center gap-2"
            >
              <Maximize2 className="w-4 h-4" />
              Fullscreen
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-500/10 rounded-xl transition-all duration-300 hover:scale-110 group"
            >
              <X className="w-5 h-5 text-muted-foreground group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-muted/20 relative">
          <iframe
            src={fileUrl}
            className="w-full h-full border-0"
            title={fileName}
          />
        </div>
      </div>
    </div>
  );
}
