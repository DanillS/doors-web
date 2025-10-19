'use client';
import { useFavorites } from '../../context/FavoritesContext';
import DoorCard from '../../components/DoorCard';
import PaymentModal from '../../components/PaymentModal';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, MessageCircle } from 'lucide-react';
import './FavoritesPage.css';

export default function FavoritesPage() {
  const { favorites, clearFavorites, addOrder } = useFavorites();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalAmount = favorites.reduce((sum, door) => sum + door.price, 0);

  const handlePaymentSuccess = (paymentMethod) => {
    console.log('Payment successful with method:', paymentMethod);
    
    const order = addOrder({
      items: [...favorites],
      totalAmount,
      paymentMethod,
      status: 'paid'
    });

    console.log('Order created:', order);
    clearFavorites();

    setTimeout(() => {
      window.location.href = `/orders/${order.id}`;
    }, 1000);
  };

  const handleQuickWhatsApp = () => {
    const doorNames = favorites.map(door => door.name).join(', ');
    const message = `Здравствуйте! Хочу заказать следующие двери из избранного:\n\n${doorNames}\n\nОбщая сумма: ${totalAmount.toLocaleString()} ₽\nКоличество: ${favorites.length} шт.`;
    const whatsappUrl = `https://wa.me/79046726360?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!mounted) {
    return (
      <div className="favorites-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      {/* Хедер */}
      <header className="favorites-header">
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
            <div className="header-right">
              <Link 
                href="/"
                className="back-link"
              >
                ← В каталог
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="favorites-main">
        {/* Хлебные крошки */}
        <nav className="breadcrumbs">
          <ol className="breadcrumbs-list">
            <li><Link href="/" className="breadcrumb-link">Главная</Link></li>
            <li className="breadcrumb-separator">›</li>
            <li className="breadcrumb-current">Избранное</li>
          </ol>
        </nav>

        {/* Заголовок */}
        <div className="page-header">
          <h1 className="page-title">⭐ Избранные двери</h1>
          <p className="page-subtitle">
            {favorites.length === 0 
              ? 'Здесь будут отображаться понравившиеся вам двери'
              : `У вас ${favorites.length} товаров в избранном`
            }
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-icon">⭐</div>
            <h2 className="empty-title">
              В избранном пока пусто
            </h2>
            <p className="empty-description">
              Добавляйте понравившиеся двери в избранное, нажимая на сердечко ❤️ в карточке товара
            </p>
            <Link
              href="/"
              className="empty-action-button"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <>
            {/* Панель управления заказом */}
            <div className="order-panel">
              <div className="order-panel-content">
                {/* Информация о заказе */}
                <div className="order-info">
                  <h3 className="order-title">Ваш заказ</h3>
                  <div className="order-details">
                    <span className="order-total">
                      {totalAmount.toLocaleString()} ₽
                    </span>
                    <div className="order-meta">
                      <span>{favorites.length} товар{favorites.length > 1 ? 'а' : ''}</span>
                      <span className="meta-separator">•</span>
                      <span>Доставка: бесплатно</span>
                    </div>
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="order-actions">
                  <button
                    onClick={() => {
                      console.log('Opening payment modal');
                      setShowPaymentModal(true);
                    }}
                    className="action-button payment-button"
                  >
                    <ShoppingCart size={20} />
                    <span>Заказ в WhatsApp</span>
                  </button>

                  <button
                    onClick={clearFavorites}
                    className="action-button clear-button"
                  >
                    <Trash2 size={18} />
                    <span>Очистить</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Сетка товаров */}
            <div className="favorites-grid">
              {favorites.map(door => (
                <DoorCard key={door.id} door={door} />
              ))}
            </div>
          </>
        )}

        {/* Модальное окно оплаты */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          totalAmount={totalAmount}
          doorCount={favorites.length}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </main>
    </div>
  );
}