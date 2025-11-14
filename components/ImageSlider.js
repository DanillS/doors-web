// ImageSlider.js
'use client';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Images } from 'lucide-react';
import styles from './ImageSlider.module.css';

export default function ImageSlider({ 
  images = [], 
  productName = '', 
  isModal = false, 
  onClose,
  showThumbnails = true,
  initialIndex = 0
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const slideImages = images && images.length > 0 ? images : ['/placeholder-door.jpg'];

  const nextSlide = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === slideImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [slideImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? slideImages.length - 1 : prevIndex - 1
    );
  }, [slideImages.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsLoading(true);
    setError(false);
  };

  // Обработка клавиатуры
  useEffect(() => {
    if (!isModal) return;

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          onClose?.();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModal, onClose, nextSlide, prevSlide]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
  };

  const placeholderSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjM3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzljYTNmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKdpO+4j+WIhuW6pzwvdGV4dD48L3N2Zz4=';

  // Полноэкранный режим
  if (isModal) {
    return (
      <div className={styles.slFullscreenOverlay}>
        <div className={styles.slFullscreenContainer}>
          <div className={styles.slFullscreenImageWrapper}>
            {isLoading && <div className={styles.slSpinner} />}
            
            <img
              src={error ? placeholderSvg : slideImages[currentIndex]}
              alt={`${productName} - фото ${currentIndex + 1}`}
              className={`${styles.slFullscreenImage} ${isLoading ? styles.slImageLoading : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />

            {slideImages.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className={`${styles.slNavButton} ${styles.slPrev}`}
                  aria-label="Предыдущее фото"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={nextSlide}
                  className={`${styles.slNavButton} ${styles.slNext}`}
                  aria-label="Следующее фото"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {slideImages.length > 1 && (
              <div className={styles.slCounter}>
                <span className={styles.slCurrent}>{currentIndex + 1}</span>
                /<span>{slideImages.length}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className={styles.slClose}
              aria-label="Закрыть просмотр"
            >
              <X size={24} />
            </button>
          </div>

          {showThumbnails && slideImages.length > 1 && (
            <div className={styles.slFullscreenThumbnails}>
              {slideImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`${styles.slThumbnail} ${
                    index === currentIndex ? styles.slThumbnailActive : ''
                  }`}
                  aria-label={`Перейти к фото ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`Миниатюра ${index + 1}`}
                    className={styles.slThumbnailImage}
                    onError={(e) => {
                      e.currentTarget.src = placeholderSvg;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Обычный слайдер
  return (
    <div className={styles.slWrapper}>
      <div className={styles.slImageContainer}>
        <div className={styles.slImageWrapper}>
          {isLoading && <div className={styles.slSpinner} />}
          
          <img
            src={error ? placeholderSvg : slideImages[currentIndex]}
            alt={`${productName} - фото ${currentIndex + 1}`}
            className={`${styles.slImage} ${isLoading ? styles.slImageLoading : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />

          {slideImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className={`${styles.slNavButton} ${styles.slPrev}`}
                aria-label="Предыдущее фото"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextSlide}
                className={`${styles.slNavButton} ${styles.slNext}`}
                aria-label="Следующее фото"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {slideImages.length > 1 && (
            <div className={styles.slCounter}>
              <span className={styles.slCurrent}>{currentIndex + 1}</span>
              /<span>{slideImages.length}</span>
            </div>
          )}

          {slideImages.length > 1 && (
            <div className={styles.slPhotoBadge}>
              <Images size={12} />
              <span>{slideImages.length}</span>
            </div>
          )}
        </div>
      </div>

      {showThumbnails && slideImages.length > 1 && (
        <div className={styles.slThumbnails}>
          {slideImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${styles.slThumbnail} ${
                index === currentIndex ? styles.slThumbnailActive : ''
              }`}
              aria-label={`Перейти к фото ${index + 1}`}
            >
              <img
                src={image}
                alt={`Миниатюра ${index + 1}`}
                className={styles.slThumbnailImage}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = placeholderSvg;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}