'use client';
import { useState } from 'react';
import { ShoppingCart, Plus, Minus, ArrowRight } from 'lucide-react';
import ImageSlider from './ImageSlider';
import Link from 'next/link';
import styles from './DoorCard.module.css';

export default function DoorCard({ door, onAddToCart }) {
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (onAddToCart && typeof onAddToCart === 'function') {
      onAddToCart(door, quantity);
      setQuantity(1); // Сбрасываем количество после добавления
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  // ОБНОВЛЕННЫЙ КОД: объединяем основное фото и дополнительные фото
  const doorImages = [];

  // Добавляем основное фото, если оно есть
  if (door.image && door.image.trim() !== '') {
    doorImages.push(door.image);
  }

  // Добавляем дополнительные фото, если они есть
  if (door.images && Array.isArray(door.images)) {
    door.images.forEach(img => {
      if (img && img.trim() !== '' && !doorImages.includes(img)) {
        doorImages.push(img);
      }
    });
  }

  // Если вообще нет фото, используем fallback
  if (doorImages.length === 0) {
    doorImages.push('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPtCd0LXRgiDQvdCw0YfQsNC70LAg0LTQu9GPINC00L7QsdCw0LLQu9C10L3QuNC1PC90ZXh0Pjwvc3ZnPg==');
  }

  return (
    <>
      <div className={styles.card}>
        {/* Область изображения */}
        <div className={styles.imageSection}>
          <div 
            className={styles.imageWrapper}
            onClick={() => setShowSliderModal(true)}
            role="button"
            tabIndex={0}
          >
            <ImageSlider 
              images={doorImages}
              productName={door.name}
              showThumbnails={false}
            />
          </div>

          {/* Бейдж цены */}
          <div className={styles.priceBadge}>
            {door.price.toLocaleString()} ₽
          </div>
        </div>

        {/* Информация о товаре */}
        <div className={styles.infoSection}>
          <Link href={`/doors/${door.id}`} className={styles.titleLink}>
            <h3 className={styles.title}>{door.name}</h3>
          </Link>

          <div className={styles.specs}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Стекло:</span>
              <span className={styles.specValue}>{door.glass}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Размер:</span>
              <span className={styles.specValue}>{door.size}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Покрытие:</span>
              <span className={styles.specValue}>{door.color}</span>
            </div>
          </div>

          {/* Счетчик количества */}
          <div className={styles.quantitySelector}>
            <span className={styles.quantityLabel}>Количество:</span>
            <div className={styles.quantityControls}>
              <button 
                onClick={decreaseQuantity}
                className={styles.quantityButton}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className={styles.quantityValue}>{quantity}</span>
              <button 
                onClick={increaseQuantity}
                className={styles.quantityButton}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className={styles.actions}>
            <button
              onClick={handleAddToCart}
              className={styles.cartButton}
            >
              <ShoppingCart size={18} />
              <span>В корзину • {quantity} шт.</span>
            </button>
            
            <Link href={`/doors/${door.id}`} className={styles.detailsButton}>
              <span>Подробнее</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Модальное окно слайдера */}
      {showSliderModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <ImageSlider 
              images={doorImages}
              productName={door.name}
              isModal={true}
              onClose={() => setShowSliderModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}