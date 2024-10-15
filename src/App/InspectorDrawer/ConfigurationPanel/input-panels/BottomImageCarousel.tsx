import React, { useState } from 'react';
import { Image, ImageProps } from '@usewaypoint/block-image';

interface ImageItem {
  url: string;
  alt: string;
}

interface BottomImageCarouselProps extends Omit<ImageProps, 'props'> {
  props: {
    images: ImageItem[];
  } & ImageProps['props'];
}

const BottomImageCarousel: React.FC<BottomImageCarouselProps> = ({ style, props }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ensure props.images is defined
  if (!props.images || !Array.isArray(props.images) || props.images.length === 0) {
    return null;
  }

  const thumbnailContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  };

  const thumbnailStyle: React.CSSProperties = {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    margin: '0 5px',
    cursor: 'pointer',
    border: '2px solid transparent',
  };

  return (
    <div>
      <Image
        style={style}
        props={{
          ...props,
          url: props.images[currentIndex].url,
          alt: props.images[currentIndex].alt,
        }}
      />
      <div style={thumbnailContainerStyle}>
        {props.images.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={image.alt}
            style={{
              ...thumbnailStyle,
              border: index === currentIndex ? '2px solid blue' : '2px solid transparent',
            }}
            onMouseEnter={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomImageCarousel;
