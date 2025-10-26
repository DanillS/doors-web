// app/doors/[id]/page.js
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '../../../context/CartContext'; // Добавляем импорт контекста
import { ShoppingCart, ArrowLeft, Plus, Minus, Truck, Shield, Award, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ImageSlider from '../../../components/ImageSlider';
import Header from '../../../components/Header';
import PaymentModal from '../../../components/PaymentModal';
import Link from 'next/link';
import styles from './DoorPage.module.css';

export default function DoorPage() {
  const params = useParams();
  const [door, setDoor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [cartNotification, setCartNotification] = useState(null);
  const [photoModal, setPhotoModal] = useState({
    isOpen: false,
    currentIndex: 0,
    images: []
  });

  // Используем контекст корзины вместо локального состояния
  const { cart, addToCart, getTotalItems } = useCart();

  useEffect(() => {
    fetchDoor();
  }, [params.id]);

  const fetchDoor = async () => {
    try {
      const res = await fetch(`/api/doors/${params.id}`);
      const data = await res.json();
      setDoor(data);
    } catch (error) {
      console.error('Error fetching door:', error);
    } finally {
      setLoading(false);
    }
  };

  // ОБНОВЛЕННАЯ функция добавления в корзину
  const handleAddToCart = () => {
    if (door) {
      addToCart(door, quantity); // Используем функцию из контекста
      
      // Показываем уведомление
      setCartNotification({
        message: `${quantity} × ${door.name} добавлено в корзину`,
        type: 'success'
      });
      
      setTimeout(() => {
        setCartNotification(null);
      }, 3000);
      
      setQuantity(1); // Сбрасываем количество после добавления
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const openPhotoModal = (images, startIndex = 0) => {
    setPhotoModal({
      isOpen: true,
      currentIndex: startIndex,
      images: images
    });
  };

  const closePhotoModal = () => {
    setPhotoModal({
      isOpen: false,
      currentIndex: 0,
      images: []
    });
  };

  const nextPhoto = () => {
    setPhotoModal(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevPhoto = () => {
    setPhotoModal(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!photoModal.isOpen) return;
      
      if (e.key === 'Escape') closePhotoModal();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [photoModal.isOpen]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <div className={styles.loadingText}>Загрузка товара...</div>
      </div>
    );
  }

  if (!door) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>🚪</div>
        <div className={styles.errorTitle}>Товар не найден</div>
        <p className={styles.errorDescription}>
          Возможно, эта дверь была удалена или перемещена
        </p>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={18} />
          <span>Вернуться в каталог</span>
        </Link>
      </div>
    );
  }

  const doorImages = door.images && door.images.length > 0 
    ? door.images 
    : door.image 
      ? [door.image] 
      : [];

  return (
    <div className={styles.container}>
      {/* Header с корзиной */}
      <Header 
        cartItemsCount={getTotalItems()} // Используем функцию из контекста
        onCartClick={() => setIsPaymentModalOpen(true)}
      />

      {/* Уведомление о добавлении в корзину */}
      {cartNotification && (
        <div className={`${styles.cartNotification} ${styles[cartNotification.type]}`}>
          <div className={styles.cartNotificationContent}>
            <span className={styles.cartNotificationMessage}>
              {cartNotification.message}
            </span>
            <button 
              onClick={() => setCartNotification(null)}
              className={styles.cartNotificationClose}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Навигация */}
      <div className={styles.navigation}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Назад к каталогу</span>
          </Link>
          <div className={styles.breadcrumbs}>
            <Link href="/">Каталог</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.currentPage}>{door.name}</span>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className={styles.content}>
        {/* Слайдер фото */}
        <div className={styles.sliderSection}>
          <div 
            onClick={() => openPhotoModal(doorImages)}
            style={{ cursor: 'pointer', width: '100%' }}
          >
            <ImageSlider 
              images={doorImages}
              productName={door.name}
              showThumbnails={true}
            />
          </div>
        </div>

        {/* Информация о товаре */}
        <div className={styles.infoSection}>
          <div className={styles.header}>
            <div className={styles.categoryBadge}>Элитные двери</div>
            <h1 className={styles.title}>{door.name}</h1>
          </div>

          {/* Цена */}
          <div className={styles.priceSection}>
            <div className={styles.price}>{door.price.toLocaleString()} ₽</div>
            <div className={styles.priceNote}>за единицу</div>
          </div>

          {/* Характеристики */}
          <div className={styles.specs}>
            <h3 className={styles.specsTitle}>Основные характеристики</h3>
            <div className={styles.specsGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Размер:</span>
                <span className={styles.specValue}>{door.size}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Цвет:</span>
                <span className={styles.specValue}>{door.color}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Тип открывания:</span>
                <span className={styles.specValue}>{door.tearType}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Стекло:</span>
                <span className={styles.specValue}>Без стекла</span>
              </div>
            </div>
          </div>

          {/* Статус и доставка */}
          <div className={styles.deliveryInfo}>
            <div className={styles.status}>
              <div className={`${styles.statusBadge} ${door.isActive ? styles.inStock : styles.outOfStock}`}>
                {door.isActive ? 'В наличии' : 'Нет в наличии'}
              </div>
              <span className={styles.deliveryTime}>Доставка: 3-5 рабочих дней</span>
            </div>
          </div>

          {/* Выбор количества */}
          <div className={styles.quantitySection}>
            <label className={styles.quantityLabel}>Количество:</label>
            <div className={styles.quantityControls}>
              <button 
                onClick={decreaseQuantity}
                className={styles.quantityButton}
                disabled={quantity <= 1}
              >
                <Minus size={18} />
              </button>
              <span className={styles.quantityValue}>{quantity}</span>
              <button 
                onClick={increaseQuantity}
                className={styles.quantityButton}
              >
                <Plus size={18} />
              </button>
            </div>
            <div className={styles.quantityTotal}>
              Итого: {(door.price * quantity).toLocaleString()} ₽
            </div>
          </div>

          {/* Кнопки действий */}
          <div className={styles.actionButtons}>
            <button
              onClick={handleAddToCart}
              disabled={!door.isActive}
              className={`${styles.cartButton} ${!door.isActive ? styles.disabled : ''}`}
            >
              <ShoppingCart size={20} />
              <span>{door.isActive ? `Добавить в корзину • ${quantity} шт.` : 'Нет в наличии'}</span>
            </button>
            
            <a 
              href="tel:+79503101560"
              className={styles.consultationButton}
            >
              <span>🛎️</span>
              <span>Бесплатная консультация</span>
            </a>
          </div>

          {/* Преимущества */}
          <div className={styles.features}>
            <div className={styles.feature}>
              <Truck size={20} />
              <span>Бесплатная доставка</span>
            </div>
            <div className={styles.feature}>
              <Shield size={20} />
              <span>Гарантия 2 года</span>
            </div>
            <div className={styles.feature}>
              <Award size={20} />
              <span>Премиум качество</span>
            </div>
          </div>
        </div>
      </div>

      {/* Детальная информация */}
      <div className={styles.detailsSection}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'description' ? styles.active : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Описание
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'specifications' ? styles.active : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Характеристики
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'delivery' ? styles.active : ''}`}
            onClick={() => setActiveTab('delivery')}
          >
            Доставка и установка
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'description' && (
            <div className={styles.description}>
              <h3>О товаре</h3>
              <p>{door.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className={styles.specifications}>
              <h3>Технические характеристики</h3>
              <div className={styles.specsTable}>
                <div className={styles.specRow}>
                  <span>Название</span>
                  <span>{door.name}</span>
                </div>
                <div className={styles.specRow}>
                  <span>Размер</span>
                  <span>{door.size}</span>
                </div>
                <div className={styles.specRow}>
                  <span>Стекло</span>
                  <span>{door.glass}</span>
                </div>
                <div className={styles.specRow}>
                  <span>Цвет</span>
                  <span>{door.color}</span>
                </div>
                <div className={styles.specRow}>
                  <span>Тип открывания</span>
                  <span>{door.tearType}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className={styles.delivery}>
              <h3>Доставка и установка</h3>
              <div className={styles.deliveryOptions}>
                <div className={styles.deliveryOption}>
                  <h4>🚚 Стандартная доставка</h4>
                  <p>Бесплатная доставка в пределах города. Срок: 3-5 рабочих дней</p>
                </div>
                <div className={styles.deliveryOption}>
                  <h4>⚡ Экспресс доставка</h4>
                  <p>Доставка в течение 24 часов - 2 000 ₽</p>
                </div>
                <div className={styles.deliveryOption}>
                  <h4>🔧 Установка</h4>
                  <p>Профессиональный монтаж - от 3 000 ₽</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно фото */}
      {photoModal.isOpen && (
        <div className={styles.photoModalOverlay} onClick={closePhotoModal}>
          <div className={styles.photoModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.photoModalClose} onClick={closePhotoModal}>
              <X size={24} />
            </button>
            
            <div className={styles.photoModalCounter}>
              {photoModal.currentIndex + 1} / {photoModal.images.length}
            </div>

            {photoModal.images.length > 1 && (
              <>
                <button className={`${styles.photoModalNav} ${styles.photoModalPrev}`} onClick={prevPhoto}>
                  <ChevronLeft size={24} />
                </button>
                <button className={`${styles.photoModalNav} ${styles.photoModalNext}`} onClick={nextPhoto}>
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <img
              src={photoModal.images[photoModal.currentIndex]}
              alt={`${door.name} - фото ${photoModal.currentIndex + 1}`}
              className={styles.photoModalImage}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjM3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzljYTNmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKdpO+4j+WIhuW6pzwvdGV4dD48L3N2Zz4=';
              }}
            />
          </div>
        </div>
      )}

      {/* Футер */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <div className={styles.footerLogoIcon}>🚪</div>
              <div className={styles.footerLogoText}>
                <h3 className={styles.footerLogoTitle}>Elite Doors</h3>
                <p className={styles.footerLogoSubtitle}>Премиальные решения</p>
              </div>
            </div>
            <p className={styles.footerDescription}>
              Ведущий поставщик элитных межкомнатных и входных дверей от европейских производителей. 
              Индивидуальный подход и гарантия качества.
            </p>
          </div>

          <div className={styles.footerContacts}>
            <h4 className={styles.footerLinksTitle}>Контакты</h4>
            <a href="tel:+79046726360" className={styles.footerContact}>
              <div className={styles.footerContactIcon}>📞</div>
              <span>+7 (950) 310-15-60</span>
            </a>
            <a href="mailto:stepanovpg@mail.ru" className={styles.footerContact}>
              <div className={styles.footerContactIcon}>✉️</div>
              <span>stepanovpg@mail.ru</span>
            </a>
            <div className={styles.footerContact}>
              <div className={styles.footerContactIcon}>🕒</div>
              <span>Пн-Пт: 9:00-18:00</span>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <h4 className={styles.footerLinksTitle}>Навигация</h4>
            <Link href="/" className={styles.footerLink}>
              <span className={styles.footerLinkIcon}>›</span>
              <span>Каталог дверей</span>
            </Link>
            <Link href="/admin" className={styles.footerLink}>
              <span className={styles.footerLinkIcon}>›</span>
              <span>Админ-панель</span>
            </Link>
            <a href="tel:+79046726360" className={styles.footerLink}>
              <span className={styles.footerLinkIcon}>›</span>
              <span>Консультация</span>
            </a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            &copy; 2025 Elite Doors. Все права защищены.
          </p>
        </div>
      </footer>

      {/* Модальное окно корзины */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        cartItems={cart} // Используем cart из контекста
        onCartUpdate={() => {}} // Теперь не нужно, так как используем контекст
      />
    </div>
  );
}