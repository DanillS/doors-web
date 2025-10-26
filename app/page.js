// app/page.js
"use client";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import SearchFilter from "../components/SearchFilter";
import DoorCard from "../components/DoorCard";
import PaymentModal from "../components/PaymentModal";
import Link from "next/link";
import "./globals.css";
import "./Home.css";

export default function Home() {
  const [doors, setDoors] = useState([]);
  const [filteredDoors, setFilteredDoors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 500000],
    material: "",
    minPrice: "",
    maxPrice: "",
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [cartNotification, setCartNotification] = useState(null);

  // Используем контекст корзины
  const { cart, addToCart, getTotalItems } = useCart();

  useEffect(() => {
    loadDoors();
  }, []);

  const loadDoors = async () => {
    try {
      const response = await fetch("/api/doors");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const doorsArray = Array.isArray(data) ? data : [];

      setDoors(doorsArray);
      setFilteredDoors(doorsArray);
      setError(null);
    } catch (error) {
      console.error("❌ Ошибка загрузки дверей:", error);
      setError(error.message);
      setDoors([]);
      setFilteredDoors([]);
    } finally {
      setLoading(false);
    }
  };

  // Функция добавления в корзину
  const handleAddToCart = (door, quantity = 1) => {
    addToCart(door, quantity);

    // Показываем уведомление
    setCartNotification({
      message: `${quantity} × ${door.name} добавлено в корзину`,
      type: "success",
    });

    setTimeout(() => {
      setCartNotification(null);
    }, 3000);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterDoors(term, filters);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    filterDoors(searchTerm, newFilters);
  };

  const filterDoors = (search, filter) => {
    let filtered = Array.isArray(doors) ? doors : [];

    if (search) {
      filtered = filtered.filter(
        (door) =>
          door.name?.toLowerCase().includes(search.toLowerCase()) ||
          door.description?.toLowerCase().includes(search.toLowerCase()) ||
          door.material?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter.priceRange) {
      filtered = filtered.filter(
        (door) =>
          door.price >= filter.priceRange[0] &&
          door.price <= filter.priceRange[1]
      );
    }

    if (filter.material) {
      filtered = filtered.filter((door) => door.material === filter.material);
    }

    setFilteredDoors(filtered);
  };

  const handleCloseModal = () => {
    setIsPaymentModalOpen(false);
  };

  const getDoorsCount = () => {
    return Array.isArray(filteredDoors) ? filteredDoors.length : 0;
  };

  const getDoorsArray = () => {
    return Array.isArray(filteredDoors) ? filteredDoors : [];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Загрузка каталога...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <h3 className="error-title">Ошибка загрузки</h3>
          <p className="error-description">{error}</p>
          <button onClick={loadDoors} className="retry-button">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  const doorsArray = getDoorsArray();
  const doorsCount = getDoorsCount();
  const totalCartItems = getTotalItems();

  return (
    <div className="home-container">
      <Header
        cartItemsCount={totalCartItems}
        onCartClick={() => setIsPaymentModalOpen(true)}
      />

      {/* Уведомление о добавлении в корзину */}
      {cartNotification && (
        <div className={`cart-notification ${cartNotification.type}`}>
          <div className="cart-notification-content">
            <span className="cart-notification-message">
              {cartNotification.message}
            </span>
            <button
              onClick={() => setCartNotification(null)}
              className="cart-notification-close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <main className="home-main">
        {/* Заголовок */}
        <div className="home-header">
          <h1 className="home-title">Элитные межкомнатные двери</h1>
          <p className="home-subtitle">
            Эксклюзивные решения для вашего интерьера
          </p>
        </div>

        {/* Фильтры и поиск - ВОТ ВАШ ПОИСКОВИК */}
        <div className="filters-section">
          <SearchFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            doors={doorsArray}
          />
        </div>

        {/* Основной каталог */}
        <section className="catalog-section">
          <div className="catalog-header">
            <h2 className="catalog-title">Коллекция дверей</h2>
            <p className="catalog-count">{doorsCount} моделей в каталоге</p>
          </div>

          {doorsCount === 0 ? (
            <div className="empty-catalog">
              <div className="empty-icon">🚪</div>
              <h3 className="empty-title">
                {Array.isArray(doors) && doors.length === 0
                  ? "Каталог пуст"
                  : "Товары не найдены"}
              </h3>
              <p className="empty-description">
                {Array.isArray(doors) && doors.length === 0
                  ? "Добавьте товары через админ-панель"
                  : "Попробуйте изменить параметры поиска"}
              </p>
            </div>
          ) : (
            <div className="doors-grid">
              {doorsArray.map((door) => (
                <DoorCard
                  key={door.id}
                  door={door}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Футер */}
      <footer className="home-footer">
        <div className="footer-content">
          {/* Бренд */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">🚪</div>
              <div className="footer-logo-text">
                <h3 className="footer-logo-title">Elite Doors</h3>
                <p className="footer-logo-subtitle">Премиальные решения</p>
              </div>
            </div>
            <p className="footer-description">
              Ведущий поставщик элитных межкомнатных дверей. Индивидуальный подход и гарантия
              качества.
            </p>
          </div>

          {/* Контакты */}
          <div className="footer-contacts">
            <h4 className="footer-links-title">Контакты</h4>
            <a href="tel:+79046726360" className="footer-contact">
              <div className="footer-contact-icon">📞</div>
              <span>+7 (950) 310-15-60</span>
            </a>
            <a href="mailto:stepanovpg@mail.ru.ru" className="footer-contact">
              <div className="footer-contact-icon">✉️</div>
              <span>stepanovpg@mail.ru.ru</span>
            </a>
            <div className="footer-contact">
              <div className="footer-contact-icon">🕒</div>
              <span>Пн-Пт: 9:00-18:00</span>
            </div>
          </div>

          {/* Ссылки */}
          <div className="footer-links">
            <h4 className="footer-links-title">Навигация</h4>
            <Link href="/admin" className="footer-link">
              <span className="footer-link-icon">›</span>
              <span>Админ-панель</span>
            </Link>
            <a href="tel:+79046726360" className="footer-link">
              <span className="footer-link-icon">›</span>
              <span>Консультация</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; 2025 Elite Doors. Все права защищены.
          </p>
        </div>
      </footer>

      {/* Модальное окно оплаты */}
      <PaymentModal isOpen={isPaymentModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
