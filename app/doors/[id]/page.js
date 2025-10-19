'use client';
import { useParams } from 'next/navigation';
import { useFavorites } from '../../../context/FavoritesContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './DoorPage.css';

export default function DoorPage() {
  const params = useParams();
  const [door, setDoor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const phoneNumber = '+7 (904) 672-63-60';

  useEffect(() => {
    const loadDoor = async () => {
      try {
        const response = await fetch(`/api/doors/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setDoor(data);
        } else {
          console.error('Door not found');
        }
      } catch (error) {
        console.error('Error loading door:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDoor();
  }, [params.id]);

  if (loading) {
    return (
      <div className="door-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Загрузка двери...</p>
        </div>
      </div>
    );
  }

  if (!door) {
    return (
      <div className="door-not-found">
        <div className="not-found-content">
          <h1 className="not-found-title">Дверь не найдена</h1>
          <Link href="/" className="not-found-link">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="door-page">
      {/* Хедер */}
      <header className="door-header">
        <div className="header-container">
          <div className="header-content">
            <div className="header-left">
              <Link href="/" className="logo-link">
                <div className="logo">
                  <span className="logo-text">Д</span>
                </div>
                <div>
                  <h1 className="logo-title">Дверной Мир</h1>
                </div>
              </Link>
            </div>
            <a 
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="phone-button"
            >
              <span className="phone-icon">📞</span>
              <span className="phone-text">{phoneNumber}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Хлебные крошки */}
      <nav className="door-breadcrumbs">
        <div className="breadcrumbs-container">
          <ol className="breadcrumbs-list">
            <li><Link href="/" className="breadcrumb-link">Главная</Link></li>
            <li className="breadcrumb-separator">›</li>
            <li><Link href="/" className="breadcrumb-link">Каталог</Link></li>
            <li className="breadcrumb-separator">›</li>
            <li className="breadcrumb-current">{door.name}</li>
          </ol>
        </div>
      </nav>

      {/* Основной контент */}
      <main className="door-main">
        <div className="door-content-grid">
          {/* Изображение */}
          <div className="door-image-section">
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
          </div>

          {/* Информация о двери */}
          <div className="door-info-section">
            <div className="door-header-info">
              <h1 className="door-title">{door.name}</h1>
              <button
                onClick={() => toggleFavorite(door)}
                className={`favorite-button ${isFavorite(door.id) ? 'favorite-active' : ''}`}
              >
                {isFavorite(door.id) ? '❤️' : '🤍'}
              </button>
            </div>

            <div className="door-price">
              {door.price.toLocaleString()} ₽
            </div>

            <p className="door-description">{door.description}</p>

            {/* Характеристики */}
            <div className="door-specs">
              <div className="spec-row">
                <span className="spec-label">Материал:</span>
                <span className="spec-value">{door.material}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Размер:</span>
                <span className="spec-value">{door.size}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Цвет:</span>
                <span className="spec-value">{door.color}</span>
              </div>
            </div>

            {/* Кнопка заказа */}
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="order-button"
            >
              <span className="order-icon">📞</span>
              <span className="order-text">Заказать по телефону</span>
            </a>

            {/* Дополнительная информация */}
            <div className="order-info">
              <h3 className="order-info-title">Условия заказа</h3>
              <ul className="order-info-list">
                <li>• Бесплатная консультация</li>
                <li>• Замер на дому</li>
                <li>• Доставка и установка</li>
                <li>• Гарантия 2 года</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}