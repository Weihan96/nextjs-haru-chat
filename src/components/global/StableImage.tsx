"use client"

import React from 'react';
import Image from "next/image";
interface StableImageProps {
  src: string;
  alt: string;
  className?: string;
}

function StableImage({ src, alt, className }: StableImageProps) {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const imgRef = React.useRef<HTMLImageElement>(null);
  
  React.useEffect(() => {
    if (!dimensions.width && !dimensions.height) {
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        setDimensions({
          width: img.width,
          height: img.height
        });
        
        // Force hardware acceleration on the actual image element
        if (imgRef.current) {
          imgRef.current.style.transform = 'translateZ(0)';
        }
      };
    }
  }, [src, dimensions]);
  
  // Use aspect ratio to preserve space
  const aspectRatio = dimensions.width && dimensions.height 
    ? dimensions.width / dimensions.height 
    : 1;
    
  return (
    <div 
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Preserve aspect ratio even before image loads */}
      <div
        style={{
          paddingBottom: `${(1 / aspectRatio) * 100}%`,
          width: '100%',
        }}
      />
      
      {/* Actual image with fixed positioning */}
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          willChange: 'transform'
        }} width={500} height={300} />
    </div>
  );
}

export default StableImage; 
