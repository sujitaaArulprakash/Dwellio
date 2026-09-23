import React, { useState } from 'react';

const ImageGallery = ({ images = [] }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80';
  const validImages = images.length > 0 ? images : [defaultImage];
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
      {/* Featured Large Image */}
      <div
        style={{
          width: '100%',
          height: '460px',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          backgroundColor: '#e2e8f0',
          position: 'relative',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <img
          src={validImages[selectedIndex]}
          alt="Property preview"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }}
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: '600',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {selectedIndex + 1} / {validImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              style={{
                width: '100px',
                height: '70px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                flexShrink: 0,
                border: selectedIndex === idx ? '2px solid var(--primary)' : '2px solid transparent',
                opacity: selectedIndex === idx ? 1 : 0.65,
                transition: 'var(--transition)',
                padding: 0,
              }}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
