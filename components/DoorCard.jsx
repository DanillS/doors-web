// components/DoorCard.jsx
'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import Link from 'next/link';
import styles from './DoorCard.module.css';

export default function DoorCard({ door, onAddToCart }) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [isAdded, setIsAdded] = useState(false);

  // Автоматически выбираем первый цвет при загрузке
  useEffect(() => {
    if (door.colors?.length > 0) {
      setSelectedColor(door.colors[0]);
    }
  }, [door.colors]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  // Получаем первое изображение для показа
  const getMainImage = () => {
    if (selectedColor?.images?.length > 0) {
      return selectedColor.images[0];
    }
    
    if (door.images?.length > 0) {
      return door.images[0];
    }
    
    return door.image || '/placeholder-door.jpg';
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      const cartItem = {
        ...door,
        selectedColor,
        quantity: 1
      };
      onAddToCart(cartItem, 1);
      
      // Показываем состояние "добавлено"
      setIsAdded(true);
      
      // Через 2 секунды возвращаем в исходное состояние
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }
  };

  const mainImage = getMainImage();

  return (
    <div className={styles.card}>
      {/* Область изображения */}
      <div className={styles.imageSection}>
        <div className={styles.imageWrapper}>
          <img 
            src={mainImage} 
            alt={door.name}
            className={styles.doorImage}
            loading="lazy"
          />
        </div>

        {/* <div className={styles.priceBadge}>
          {door.price.toLocaleString()} ₽
        </div>

        {door.isBestPrice && (
          <div className={styles.bestPriceBadge}>
            лучшая цена
          </div>
        )} */}
      </div>

      {/* Выбор цвета под изображением */}
      {door.colors?.length > 0 && (
        <div className={styles.variantsSection}>
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

        {/* Убрано описание */}

        <div className={styles.priceSection}>
          <span className={styles.currentPrice}>{door.price.toLocaleString()} ₽</span>
          {door.oldPrice && (
            <span className={styles.oldPrice}>{door.oldPrice.toLocaleString()} ₽</span>
          )}
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
          {door.size && (
            <li className={styles.optionItem}>
              <span className={styles.optionLabel}>Размер:</span>
              <span className={styles.optionValue}>{door.size}</span>
            </li>
          )}
        </ul>

        {/* Кнопка добавления в корзину */}
        <button
          onClick={handleAddToCart}
          className={`${styles.cartButton} ${isAdded ? styles.added : ''}`}
          disabled={isAdded}
        >
          <ShoppingCart size={16} />
          <span className={styles.buttonText}>В корзину</span>
          <Check className={styles.checkIcon} size={16} />
          <span className={styles.successText}>Добавлено</span>
        </button>
      </div>
    </div>
  );
}