'use client';

import { useState } from 'react';
import MemeGenerator from '../src/components/MemeGenerator';
import MemeGallery from '../src/components/MemeGallery';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'gallery'>('create');

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Générateur de Mèmes</h1>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200">
            <button
              className={`px-4 py-2 rounded-l-lg ${
                activeTab === 'create'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700'
              }`}
              onClick={() => setActiveTab('create')}
            >
              Créer un mème
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg ${
                activeTab === 'gallery'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700'
              }`}
              onClick={() => setActiveTab('gallery')}
            >
              Galerie
            </button>
          </div>
        </div>

        {activeTab === 'create' ? <MemeGenerator /> : <MemeGallery />}
      </div>
    </main>
  );
} 