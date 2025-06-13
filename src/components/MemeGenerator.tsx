'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas, Image, IText, FabricImage } from 'fabric';

const MemeGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    console.log('Initializing canvas...');
    const fabricCanvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0',
      preserveObjectStacking: true
    });

    // Forcer le rendu initial
    fabricCanvas.renderAll();
    setCanvas(fabricCanvas);

    return () => {
      console.log('Disposing canvas...');
      fabricCanvas.dispose();
    };
  }, [isClient]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) {
      console.log('No file or canvas:', { file, canvas });
      return;
    }

    console.log('Loading image...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      console.log('Image loaded as URL');
      
      // Créer un élément image temporaire
      const img = new window.Image();
      img.src = imgUrl;
      
      img.onload = () => {
        console.log('Image loaded, creating Fabric image');
        // Créer un objet Fabric.js Image
        const fabricImage = new Image(img);
        
        // Ajuster l'image à la taille du canvas
        const scale = Math.min(
          canvas.width! / img.width,
          canvas.height! / img.height
        );
        
        fabricImage.scale(scale);
        
        // Centrer l'image
        fabricImage.set({
          left: (canvas.width! - img.width * scale) / 2,
          top: (canvas.height! - img.height * scale) / 2
        });

        console.log('Adding image to canvas...');
        canvas.clear();
        canvas.add(fabricImage);
        canvas.renderAll();
        console.log('Canvas rendered');
        setHasImage(true);
      };
    };
    reader.readAsDataURL(file);
  };

  const addText = (position: 'top' | 'bottom') => {
    if (!canvas) return;

    const text = new IText('Double-cliquez pour éditer', {
      left: canvas.width! / 2,
      top: position === 'top' ? 50 : canvas.height! - 100,
      fontFamily: 'Impact',
      fontSize: 40,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 2,
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const handleClear = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.renderAll();
    setHasImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canvas) return;

    setIsLoading(true);
    try {
      const imageData = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1
      });
      const response = await fetch('https://meme-generator.osc-fr1.scalingo.io/api/memes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          topText: canvas.getObjects().find((obj: any) => obj.top === 50)?.get('text') as string || '',
          bottomText: canvas.getObjects().find((obj: any) => obj.top === canvas.height! - 100)?.get('text') as string || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create meme');
      }

      // Reset canvas
      handleClear();
    } catch (error) {
      console.error('Error creating meme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null; // Ne rien rendre côté serveur
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-xl shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4 bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors">
          <label className="block text-base sm:text-lg font-medium text-gray-700 text-center">
            Choisissez une image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500
              file:mr-2 sm:file:mr-4 file:py-2 sm:file:py-3 file:px-3 sm:file:px-6
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-500 file:text-white
              hover:file:bg-blue-600
              transition-all duration-200
              cursor-pointer"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-6">
          <button
            type="button"
            onClick={() => addText('top')}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
            <span>Texte en haut</span>
          </button>
          <button
            type="button"
            onClick={() => addText('bottom')}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span>Texte en bas</span>
          </button>
        </div>

        <div className="flex justify-center bg-gray-50 p-2 sm:p-4 rounded-xl shadow-inner">
          <canvas 
            ref={canvasRef} 
            className="border-2 border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 w-full max-w-[800px] h-auto aspect-[4/3]"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={handleClear}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Effacer tout</span>
          </button>
          <button
            type="submit"
            disabled={!hasImage || isLoading}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{isLoading ? 'Création...' : 'Créer le mème'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemeGenerator; 