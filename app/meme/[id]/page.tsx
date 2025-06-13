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

type PageProps = {
  params: { id: string };
};


export default function MemePage({ params }: PageProps) {
  const [meme, setMeme] = useState<Meme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMeme();
  }, [params.id]);

  const fetchMeme = async () => {
    try {
      const response = await fetch(`https://meme-generator.osc-fr1.scalingo.io/api/memes/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch meme');
      const data = await response.json();
      setMeme(data);
    } catch (error) {
      console.error('Error fetching meme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!meme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Mème non trouvé</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retour à la galerie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="relative aspect-square">
            <img
              src={meme.image}
              alt="Meme"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-sm text-gray-500">
                {new Date(meme.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => router.push('/')}
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retour à la galerie
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 