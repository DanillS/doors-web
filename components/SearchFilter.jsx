'use client';
import { useState } from 'react';
import './SearchFilter.css';

export default function SearchFilter({ onSearch, onFilter, doors }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedMaterial, setSelectedMaterial] = useState('');

  const materials = [...new Set(doors.map(door => door.material))];

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handlePriceChange = (e) => {
    const newMaxPrice = parseInt(e.target.value);
    const newPriceRange = [0, newMaxPrice];
    setPriceRange(newPriceRange);
    onFilter({ priceRange: newPriceRange, material: selectedMaterial });
  };

  const handleMaterialChange = (e) => {
    const material = e.target.value;
    setSelectedMaterial(material);
    onFilter({ priceRange, material });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 50000]);
    setSelectedMaterial('');
    onSearch('');
    onFilter({ priceRange: [0, 50000], material: '' });
  };

  return (
    <div className="search-filter-container">
      <h2 className="search-filter-title">
        🎯 Найди свою идеальную дверь
      </h2>
      
      <div className="search-filter-grid">
        
        {/* Поиск по названию */}
        <div className="filter-group">
          <label className="filter-label">
            🔍 Поиск дверей
          </label>
          <div className="search-input-container">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Название двери..."
              className="search-input"
            />
            <div className="search-icon">
              🔎
            </div>
          </div>
        </div>

        {/* Фильтр по цене */}
        <div className="filter-group">
          <label className="filter-label">
            💰 Диапазон цен
          </label>
          <div className="price-filter-container">
            <div className="price-display">
              <span className="price-value">
                до {priceRange[1].toLocaleString()} ₽
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="price-slider"
            />
            <div className="price-labels">
              <span>0 ₽</span>
              <span>25,000 ₽</span>
              <span>50,000 ₽</span>
            </div>
          </div>
        </div>

        {/* Фильтр по материалу */}
        <div className="filter-group">
          <label className="filter-label">
            🏗️ Материал двери
          </label>
          <div className="select-container">
            <select
              value={selectedMaterial}
              onChange={handleMaterialChange}
              className="material-select"
            >
              <option value="">Все материалы</option>
              {materials.map(material => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
            <div className="select-arrow">
              ⬇️
            </div>
          </div>
        </div>

      </div>

      {/* Кнопка сброса */}
      <div className="reset-button-container">
        <button
          onClick={resetFilters}
          className="reset-button"
        >
          <span className="reset-icon">🔄</span>
          <span className="reset-text">Сбросить фильтры</span>
        </button>
      </div>
    </div>
  );
}