// components/DoorCard.jsx
'use client';
import { useState } from 'react';
import { ShoppingCart, Plus, Minus, ArrowRight } from 'lucide-react';
import ImageSlider from './ImageSlider';
import Link from 'next/link';
import styles from './DoorCard.module.css';

export default function DoorCard({ door, onAddToCart }) {
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);

  // Автоматически выбираем первый цвет при загрузке
  useState(() => {
    if (door.colors && door.colors.length > 0) {
      setSelectedColor(door.colors[0]);
    }
  });

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  // Получаем фото дверей для выбранного цвета
  const getCurrentImages = () => {
    if (selectedColor && selectedColor.images && selectedColor.images.length > 0) {
      return selectedColor.images;
    }
    
    // Если нет цветов или фото для цвета, используем старые поля
    if (door.images && door.images.length > 0) {
      return door.images;
    }
    
    return door.image ? [door.image] : [];
  };

  const handleAddToCart = () => {
    if (onAddToCart && typeof onAddToCart === 'function') {
      const cartItem = {
        ...door,
        selectedColor: selectedColor,
        quantity: quantity
      };
      onAddToCart(cartItem, quantity);
      setQuantity(1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const currentImages = getCurrentImages();

  return (
    <>
      <div className={styles.card}>
        {/* Область изображения - ФОТО ДВЕРЕЙ */}
        <div className={styles.imageSection}>
          <div 
            className={styles.imageWrapper}
            onClick={() => setShowSliderModal(true)}
            role="button"
            tabIndex={0}
          >
            <ImageSlider 
              images={currentImages}
              productName={door.name}
              showThumbnails={false}
            />
          </div>

          {/* Бейдж цены */}
          <div className={styles.priceBadge}>
            {door.price.toLocaleString()} ₽
          </div>

          {/* Бейдж лучшая цена */}
          <div className={styles.bestPriceBadge}>
            лучшая цена
          </div>
        </div>

        {/* Выбор цвета - ФОТО ЦВЕТА в кружках */}
        {door.colors && door.colors.length > 0 && (
          <div className={styles.variantsSlider}>
            <div className={styles.variantsList}>
              {door.colors.map((color, index) => (
                <button
                  key={index}
                  className={`${styles.variantItem} ${
                    selectedColor?.name === color.name ? styles.variantActive : ''
                  }`}
                  onClick={() => handleColorChange(color)}
                  title={color.name}
                >
                  <img 
                    src={color.colorImage} 
                    alt={color.name}
                    className={styles.variantImage}
                    onError={(e) => {
                      // Если фото цвета не загрузилось, показываем hexCode
                      e.target.style.display = 'none';
                      e.target.parentElement.style.backgroundColor = color.hexCode;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Информация о товаре */}
        <div className={styles.infoSection}>
          <Link href={`/doors/${door.id}`} className={styles.titleLink}>
            <h3 className={styles.title}>{door.name}</h3>
          </Link>

          <p className={styles.description}>дверь межкомнатная</p>

          <div className={styles.priceSection}>
            <span className={styles.currentPrice}>{door.price.toLocaleString()} ₽</span>
            <span className={styles.oldPrice}>{Math.round(door.price * 1.1).toLocaleString()} ₽</span>
          </div>

          <ul className={styles.options}>
            <li className={styles.optionItem}>
              <span className={styles.optionLabel}>Цвет:</span>
              <span className={styles.optionValue}>
                {selectedColor ? selectedColor.name : door.color}
              </span>
            </li>
            <li className={styles.optionItem}>
              <span className={styles.optionLabel}>Производитель:</span>
              <span className={styles.optionValue}>{door.material}</span>
            </li>
          </ul>

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
              <span>В корзину</span>
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
              images={currentImages}
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