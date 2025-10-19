'use client';
import { useFavorites } from '../context/FavoritesContext';
import Link from 'next/link';
import './Header.css';

export default function Header() {
  const { favorites } = useFavorites();
  const phoneNumber = '+7 (904) 672-63-60';

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Логотип */}
          <Link href="/" className="logo-link">
            <div className="logo">
              <span className="logo-text">Д</span>
            </div>
            <div className="logo-info">
              <h1 className="logo-title">Дверной Мир</h1>
              <p className="logo-subtitle">Интернет-магазин дверей</p>
            </div>
          </Link>

          {/* Контакты и избранное */}
          <div className="header-actions">
            {/* Ссылка на избранное */}
            <Link 
              href="/favorites"
              className="favorites-link"
            >
              <span className="favorites-icon">⭐</span>
              <span className="favorites-text">Избранное</span>
              {favorites.length > 0 && (
                <span className="favorites-badge">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Телефон */}
            <a 
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="phone-button"
            >
              <span className="phone-icon">📞</span>
              <span className="phone-text">{phoneNumber}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}