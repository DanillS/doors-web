'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Images } from 'lucide-react';
import styles from './ImageSlider.module.css';

export default function ImageSlider({ 
  images, 
  productName, 
  isModal = false, 
  onClose,
  showThumbnails = true 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Если images пустой, создаем массив из одного элемента
  const slideImages = images && images.length > 0 ? images : ['/placeholder-door.jpg'];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slideImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slideImages.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Обработка клавиатуры
  useEffect(() => {
    if (!isModal) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      } else if (event.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModal, onClose]);

  return (
    <>
      <div className={`${styles.sliderContainer} ${isModal ? styles.modalSlider : ''}`}>
        {/* Основное изображение */}
        <div className={styles.imageWrapper}>
          <img
            src={slideImages[currentIndex]}
            alt={`${productName} - фото ${currentIndex + 1}`}
            className={styles.image}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjM3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzljYTNmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKdpO+4j+WIhuW6pzwvdGV4dD48L3N2Zz4=';
            }}
          />

          {/* Кнопки навигации */}
          {slideImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className={`${styles.navButton} ${styles.prevButton}`}
                aria-label="Предыдущее фото"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className={`${styles.navButton} ${styles.nextButton}`}
                aria-label="Следующее фото"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Счетчик фото */}
          {slideImages.length > 1 && (
            <div className={styles.counter}>
              {currentIndex + 1} / {slideImages.length}
            </div>
          )}

          {/* Бейдж количества фото (только не в модалке) */}
          {!isModal && slideImages.length > 1 && (
            <div className={styles.photoCountBadge}>
              <Images size={14} />
              <span>{slideImages.length}</span>
            </div>
          )}

          {/* Кнопка закрытия для модалки */}
          {isModal && onClose && (
            <button
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Закрыть просмотр"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Миниатюры */}
      {showThumbnails && slideImages.length > 1 && (
        <div className={styles.thumbnails}>
          {slideImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${styles.thumbnail} ${
                index === currentIndex ? styles.thumbnailActive : ''
              }`}
              aria-label={`Перейти к фото ${index + 1}`}
              aria-current={index === currentIndex}
            >
              <img
                src={image}
                alt={`Миниатюра ${index + 1}`}
                className={styles.thumbnailImage}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Y2EzZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7inaTvuI88L3RleHQ+PC9zdmc+';
                }}
              />
              {index === currentIndex && <div className={styles.thumbnailOverlay} />}
            </button>
          ))}
        </div>
      )}
    </>
  );
}