import React, { useState } from 'react';

interface ImageCarouselProps {
    images: string[];
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="image-carousel">
            <div className="carousel-main">
                <div className="carousel-image-wrapper">
                    <img
                        src={images[currentImageIndex]}
                        alt={`Container ${currentImageIndex + 1}`}
                        className="carousel-image"
                    />
                </div>
                <button className="carousel-btn carousel-btn-prev" onClick={prevImage}>
                    ‹
                </button>
                <button className="carousel-btn carousel-btn-next" onClick={nextImage}>
                    ›
                </button>
            </div>
            <div className="carousel-thumbnails">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`thumbnail ${index === currentImageIndex ? 'thumbnail-active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                    >
                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};