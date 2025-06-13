'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Meme {
  _id: string;
  image: string;
  topText: string;
  bottomText: string;
  createdAt: string;
}

const MemeGallery = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const response = await fetch('https://meme-generator.osc-fr1.scalingo.io/api/memes');
      if (!response.ok) throw new Error('Failed to fetch memes');
      const data = await response.json();
      setMemes(data);
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (meme: Meme) => {
    const link = document.createElement('a');
    link.href = meme.image;
    link.download = `meme-${meme._id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  

  const handleShare = async (meme: Meme) => {
    const shareUrl = `${window.location.origin}/meme/${meme._id}`;
    
    // Copier le lien dans le presse-papiers avec une méthode alternative
    const copyToClipboard = (text: string) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
      document.body.removeChild(textArea);
    };

    // Copier le lien
    copyToClipboard(shareUrl);

    // Forcer l'affichage des applications de partage
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mon mème',
          text: 'Regarde ce mème que j\'ai créé !',
          url: shareUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Si l'API de partage n'est pas disponible, afficher un message
      alert('Le lien a été copié dans le presse-papiers !');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Galerie de Mèmes</h1>
          <p className="text-base sm:text-lg text-gray-600">Retrouvez tous vos mèmes créés</p>
        </div>

        {memes.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-lg sm:text-xl text-gray-600">Aucun mème n'a été créé pour le moment</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer un mème
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {memes.map((meme) => (
              <div key={meme._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105">
                <div className="relative aspect-square">
                  <img
                    src={meme.image}
                    alt="Meme"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs sm:text-sm text-gray-500">
                      {new Date(meme.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={() => handleDownload(meme)}
                      className="flex items-center justify-center px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Télécharger
                    </button>
                    <button
                      onClick={() => handleShare(meme)}
                      className="flex items-center justify-center px-2 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Partager
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemeGallery; 