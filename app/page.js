'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchFilter from '../components/SearchFilter';
import DoorCard from '../components/DoorCard';
import './globals.css';
import './Home.css';

export default function Home() {
  const [doors, setDoors] = useState([]);
  const [filteredDoors, setFilteredDoors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    material: ''
  });

  useEffect(() => {
    loadDoors();
  }, []);

  const loadDoors = async () => {
    try {
      console.log('🔄 Загрузка дверей с API...');
      const response = await fetch('/api/doors');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Получены двери:', data);
      setDoors(data);
      setFilteredDoors(data);
    } catch (error) {
      console.error('❌ Ошибка загрузки дверей:', error);
      setDoors([]);
      setFilteredDoors([]);
    } finally {
      setLoading(false);
    }
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
    let filtered = doors;

    if (search) {
      filtered = filtered.filter(door =>
        door.name.toLowerCase().includes(search.toLowerCase()) ||
        door.description.toLowerCase().includes(search.toLowerCase()) ||
        door.material.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter.priceRange) {
      filtered = filtered.filter(door => 
        door.price >= filter.priceRange[0] && 
        door.price <= filter.priceRange[1]
      );
    }

    if (filter.material) {
      filtered = filtered.filter(door => 
        door.material === filter.material
      );
    }

    setFilteredDoors(filtered);
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

  return (
    <div className="home-container">
      <Header />
      
      <main className="home-main">
        {/* Заголовок */}
        <div className="home-header">
          <h1 className="home-title">Каталог дверей</h1>
          <p className="home-subtitle">
            Широкий выбор качественных дверей от проверенных производителей
          </p>
        </div>

        {/* Фильтры и поиск */}
        <div className="filters-section">
          <SearchFilter 
            onSearch={handleSearch}
            onFilter={handleFilter}
            doors={doors}
          />
        </div>

        {/* Основной каталог */}
        <section className="catalog-section">
          <div className="catalog-header">
            <h2 className="catalog-title">Все товары</h2>
            <p className="catalog-count">
              {filteredDoors.length} товаров
            </p>
          </div>

          {filteredDoors.length === 0 ? (
            <div className="empty-catalog">
              <div className="empty-icon">🚪</div>
              <h3 className="empty-title">
                {doors.length === 0 ? 'Каталог пуст' : 'Товары не найдены'}
              </h3>
              <p className="empty-description">
                {doors.length === 0 
                  ? 'Добавьте товары через админ-панель' 
                  : 'Попробуйте изменить параметры поиска'
                }
              </p>
            </div>
          ) : (
            <div className="doors-grid">
              {filteredDoors.map(door => (
                <DoorCard key={door.id} door={door} />
              ))}
            </div>
          )}
        </section>

        {/* Контактная информация */}
        <section className="contact-section">
          <div className="contact-content">
            <h2 className="contact-title">Нужна консультация?</h2>
            <p className="contact-description">
              Наши специалисты помогут выбрать идеальную дверь
            </p>
            <a
              href={`tel:+79046726360`}
              className="contact-button"
            >
              📞 +7 (904)-672-63-60
            </a>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-content">
          <p className="footer-text">
            &copy; 2025 Дверной Мир. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}