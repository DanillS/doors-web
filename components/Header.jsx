// components/Header.jsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Phone, Menu, X } from 'lucide-react';
import styles from './Header.module.css';

export default function Header({ cartItemsCount = 0, onCartClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const phoneNumber = '+79503101560';

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

            {/* Телефон */}
            <a 
              href={`tel:${phoneNumber}`}
              className={styles.phoneButton}
            >
              <Phone size={18} />
              <span className={styles.phoneText}>+7 (950) 310-15-60</span>
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
                <a 
                  href={`tel:${phoneNumber}`}
                  className={styles.mobilePhoneButton}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Phone size={18} />
                  <span>Позвонить</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}