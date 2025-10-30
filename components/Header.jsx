// components/Header.jsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Phone, Menu, X, MessageCircle } from 'lucide-react'; // Добавлен MessageCircle
import styles from './Header.module.css';

export default function Header({ cartItemsCount = 0, onCartClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const phoneNumber = '79503101560'; // Без + для WhatsApp
  const formattedPhoneNumber = '+7 (950) 310-15-60'; // Для отображения

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          {/* Логотип */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>🚪</div>
            <div className={styles.logoText}>
              <h1 className={styles.logoTitle}>Elite Doors</h1>
              <p className={styles.logoSubtitle}>Премиальные решения</p>
            </div>
          </Link>

          {/* Десктопная навигация */}
          <nav className={styles.nav}>
          </nav>

          {/* Действия */}
          <div className={styles.actions}>
            {/* Корзина */}
            <button 
              onClick={onCartClick}
              className={styles.cartButton}
            >
              <div className={styles.cartIcon}>
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && (
                  <span className={styles.cartBadge}>
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </div>
              <span className={styles.cartText}>Корзина</span>
            </button>

            {/* WhatsApp вместо телефона */}
            <a 
              href={`https://wa.me/${phoneNumber}`}
              className={styles.whatsappButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} />
              <span className={styles.whatsappText}>WhatsApp</span>
            </a>

            {/* Мобильное меню */}
            <button 
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNav}>
              <div className={styles.mobileActions}>
                <button 
                  onClick={() => {
                    onCartClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={styles.mobileCartButton}
                >
                  <ShoppingCart size={20} />
                  <span>Корзина ({cartItemsCount})</span>
                </button>
                {/* WhatsApp в мобильном меню */}
                <a 
                  href={`https://wa.me/${phoneNumber}`}
                  className={styles.mobileWhatsappButton}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MessageCircle size={18} />
                  <span>Написать в WhatsApp</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}