'use client';
import { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import styles from './SearchFilter.module.css';

export default function SearchFilter({ onSearch, onFilter, doors }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 500000],
    material: '',
    minPrice: '',
    maxPrice: ''
  });

  // Уникальные материалы для фильтра
  const materials = [...new Set(doors.map(door => door.material).filter(Boolean))];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    
    // Обновляем диапазон цен
    if (key === 'minPrice' || key === 'maxPrice') {
      const min = key === 'minPrice' ? parseInt(value) || 0 : parseInt(filters.minPrice) || 0;
      const max = key === 'maxPrice' ? parseInt(value) || 500000 : parseInt(filters.maxPrice) || 500000;
      newFilters.priceRange = [min, max];
    }
    
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleMaterialChange = (material) => {
    const newFilters = { ...filters, material };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      priceRange: [0, 500000],
      material: '',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  const hasActiveFilters = filters.material || filters.minPrice || filters.maxPrice;

  return (
    <div className={styles.searchFilter}>
      {/* Основная строка поиска */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Поиск по названию, материалу или описанию..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`${styles.filterToggle} ${showFilters ? styles.active : ''} ${hasActiveFilters ? styles.hasFilters : ''}`}
          >
            <SlidersHorizontal size={20} />
            <span>Фильтры</span>
            {hasActiveFilters && <div className={styles.filterDot}></div>}
          </button>
        </div>
      </div>

      {/* Расширенные фильтры */}
      {showFilters && (
        <div className={styles.filtersSection}>
          <div className={styles.filtersHeader}>
            <h3 className={styles.filtersTitle}>Расширенные фильтры</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className={styles.clearFilters}>
                <X size={16} />
                Сбросить
              </button>
            )}
          </div>

          <div className={styles.filtersGrid}>
            {/* Фильтр по цене */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Диапазон цен</label>
              <div className={styles.priceInputs}>
                <div className={styles.priceInput}>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className={styles.input}
                  />
                  <span className={styles.currency}>₽</span>
                </div>
                <div className={styles.priceSeparator}>—</div>
                <div className={styles.priceInput}>
                  <input
                    type="number"
                    placeholder="500000"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className={styles.input}
                  />
                  <span className={styles.currency}>₽</span>
                </div>
              </div>
            </div>

            {/* Фильтр по материалу */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Материал</label>
              <div className={styles.materialFilters}>
                <button
                  onClick={() => handleMaterialChange('')}
                  className={`${styles.materialButton} ${!filters.material ? styles.active : ''}`}
                >
                  Все материалы
                </button>
                {materials.map(material => (
                  <button
                    key={material}
                    onClick={() => handleMaterialChange(material)}
                    className={`${styles.materialButton} ${filters.material === material ? styles.active : ''}`}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Активные фильтры */}
          {hasActiveFilters && (
            <div className={styles.activeFilters}>
              <span className={styles.activeFiltersLabel}>Активные фильтры:</span>
              <div className={styles.activeFiltersList}>
                {filters.material && (
                  <span className={styles.activeFilter}>
                    Материал: {filters.material}
                    <button onClick={() => handleMaterialChange('')}>×</button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className={styles.activeFilter}>
                    Цена: {filters.minPrice || 0}₽ — {filters.maxPrice || '500000'}₽
                    <button onClick={() => {
                      handleFilterChange('minPrice', '');
                      handleFilterChange('maxPrice', '');
                    }}>×</button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}