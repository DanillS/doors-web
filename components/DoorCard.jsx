'use client';
import { useFavorites } from '../context/FavoritesContext';
import { useState } from 'react';
import Link from 'next/link';
import '../app/Home.css';

export default function DoorCard({ door }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(door);
  };

  return (
    <Link href={`/doors/${door.id}`} className="door-card-link">
      <div className="door-card">
        
        {/* Изображение товара */}
        <div className="door-image-container">
          {imageError ? (
            <div className="door-image-fallback">
              <div className="fallback-content">
                <span className="fallback-icon">🚪</span>
                <span className="fallback-text">Изображение двери</span>
              </div>
            </div>
          ) : (
            <img
              src={door.image}
              alt={door.name}
              className="door-image"
              onError={() => setImageError(true)}
            />
          )}
          
          {/* Кнопка избранного */}
          <button
            onClick={handleFavoriteClick}
            className={`favorite-button ${isFavorite(door.id) ? 'favorite-active' : ''}`}
          >
            {isFavorite(door.id) ? '❤️' : '🤍'}
          </button>

          {/* Бейдж цены */}
          <div className="price-badge">
            {door.price.toLocaleString()} ₽
          </div>
        </div>

        {/* Информация о товаре */}
        <div className="door-info">
          <h3 className="door-title">
            {door.name}
          </h3>

          <div className="door-details">
            <div className="detail-row">
              <span className="detail-label">Материал:</span>
              <span className="detail-value">{door.material}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Размер:</span>
              <span className="detail-value">{door.size}</span>
            </div>
          </div>

          {/* Кнопка быстрого заказа */}
          <div
            onClick={(e) => e.preventDefault()}
            className="quick-order-button"
          >
            <span className="button-icon">📞</span>
            <span className="button-text">Подробнее</span>
          </div>
        </div>
      </div>
    </Link>
  );
}