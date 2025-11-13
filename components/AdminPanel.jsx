// components/AdminPanel.jsx
'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Image, Percent, ArrowUp, ArrowDown, QrCode, Palette } from 'lucide-react';
import styles from './AdminPanel.module.css';
import Link from 'next/link';
import StoreQRCode from '../components/StoreQRCode';

export default function AdminPanel() {
  const [doors, setDoors] = useState([]);
  const [editingDoor, setEditingDoor] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    material: 'Производитель',
    size: '',
    color: '',
    glass: '',
    tearType: '',
    description: 'Количество полотен',
    isActive: true,
    colors: []
  });
  
  const [showMassUpdate, setShowMassUpdate] = useState(false);
  const [massUpdateData, setMassUpdateData] = useState({
    operation: 'increase',
    percentage: 10,
    category: 'all'
  });
  const [updatingPrices, setUpdatingPrices] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    fetchDoors();
  }, []);

  const fetchDoors = async () => {
    try {
      const res = await fetch('/api/doors?admin=true');
      const data = await res.json();
      setDoors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching doors:', error);
      setDoors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMassPriceUpdate = async () => {
    if (!massUpdateData.percentage || massUpdateData.percentage <= 0) {
      setUpdateMessage({ type: 'error', text: 'Введите корректный процент' });
      return;
    }

    setUpdatingPrices(true);
    setUpdateMessage('');

    try {
      const response = await fetch('/api/admin/update-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(massUpdateData),
      });

      const result = await response.json();

      if (result.success) {
        setUpdateMessage({ 
          type: 'success', 
          text: result.message 
        });
        setMassUpdateData({
          operation: 'increase',
          percentage: 10,
          category: 'all'
        });
        setShowMassUpdate(false);
        fetchDoors();
      } else {
        setUpdateMessage({ 
          type: 'error', 
          text: result.error || 'Ошибка при обновлении цен' 
        });
      }
    } catch (error) {
      console.error('Error updating prices:', error);
      setUpdateMessage({ 
        type: 'error', 
        text: 'Ошибка при обновлении цен' 
      });
    } finally {
      setUpdatingPrices(false);
    }
  };

  // Функции для работы с цветами
  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [
        ...(prev.colors || []),
        {
          name: '',
          hexCode: '#3B82F6',
          colorImage: '',
          images: [],
          isActive: true,
          newImageUrl: ''
        }
      ]
    }));
  };

  const removeColor = (colorIndex) => {
    setFormData(prev => ({
      ...prev,
      colors: (prev.colors || []).filter((_, index) => index !== colorIndex)
    }));
  };

  const updateColor = (colorIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      colors: (prev.colors || []).map((color, index) => 
        index === colorIndex ? { ...color, [field]: value } : color
      )
    }));
  };

  const addColorImage = (colorIndex) => {
    const color = formData.colors?.[colorIndex];
    if (color?.newImageUrl && color.newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        colors: (prev.colors || []).map((color, index) => 
          index === colorIndex 
            ? { 
                ...color, 
                images: [...(color.images || []), color.newImageUrl.trim()],
                newImageUrl: ''
              }
            : color
        )
      }));
    }
  };

  const removeColorImage = (colorIndex, imageIndex) => {
    setFormData(prev => ({
      ...prev,
      colors: (prev.colors || []).map((color, index) => 
        index === colorIndex 
          ? {
              ...color,
              images: (color.images || []).filter((_, i) => i !== imageIndex)
            }
          : color
      )
    }));
  };

  const moveColorImage = (colorIndex, fromIndex, toIndex) => {
    const currentColors = formData.colors || [];
    const color = currentColors[colorIndex];
    if (!color) return;

    const newImages = [...(color.images || [])];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    
    setFormData(prev => ({
      ...prev,
      colors: (prev.colors || []).map((color, index) => 
        index === colorIndex ? { ...color, images: newImages } : color
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingDoor ? `/api/doors/${editingDoor.id}` : '/api/doors';
      const method = editingDoor ? 'PUT' : 'POST';

      const submitData = {
        ...formData,
        price: parseInt(formData.price) || 0,
        colors: (formData.colors || []).map(color => ({
          name: color.name || '',
          hexCode: color.hexCode || '#3B82F6',
          colorImage: color.colorImage || '',
          images: (color.images || []).filter(url => url && url.trim() !== ''),
          isActive: color.isActive !== false
        })).filter(color => color.name.trim() !== '')
      };

      delete submitData.newImageUrl;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        resetForm();
        fetchDoors();
      }
    } catch (error) {
      console.error('Error saving door:', error);
    }
  };

  const resetForm = () => {
    setEditingDoor(null);
    setIsCreating(false);
    setFormData({
      name: '',
      price: '',
      material: '',
      size: '',
      color: '',
      glass: '',
      tearType: '',
      description: '',
      isActive: true,
      colors: []
    });
  };

  const editDoor = (door) => {
    console.log('Editing door:', door);
    
    setEditingDoor(door);
    setIsCreating(false);
    
    setFormData({
      name: door.name || '',
      price: door.price ? door.price.toString() : '',
      material: door.material || '',
      size: door.size || '',
      color: door.color || '',
      glass: door.glass || '',
      tearType: door.tearType || '', 
      description: door.description || '',
      isActive: door.isActive !== false,
      colors: door.colors?.map(color => ({
        name: color.name || '',
        hexCode: color.hexCode || '#3B82F6',
        colorImage: color.colorImage || '',
        images: color.images || [],
        isActive: color.isActive !== false,
        newImageUrl: ''
      })) || []
    });
  };

  const deleteDoor = async (id) => {
    if (confirm('Удалить эту дверь?')) {
      try {
        await fetch(`/api/doors/${id}`, { method: 'DELETE' });
        fetchDoors();
      } catch (error) {
        console.error('Error deleting door:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка админ-панели...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.adminTitle}>Панель управления</h1>
            <p className={styles.adminSubtitle}>Управление каталогом элитных дверей</p>
          </div>
        
          <div className={styles.headerActions}>
            <Link href="/admin/qr-codes" className={styles.qrCodesLink}>
              <QrCode size={18} />
              <span>QR-коды всех товаров</span>
            </Link>
            
            <StoreQRCode />
          </div>
        </div>
      </div>

      <div className={styles.adminContent}>
        <div className={styles.massUpdateSection}>
          <button
            onClick={() => setShowMassUpdate(!showMassUpdate)}
            className={styles.massUpdateToggle}
          >
            <Percent size={20} />
            <span>Массовое изменение цен</span>
          </button>

          {showMassUpdate && (
            <div className={styles.massUpdateForm}>
              <h3 className={styles.massUpdateTitle}>Массовое изменение цен</h3>
              
              <div className={styles.massUpdateGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Операция</label>
                  <select
                    value={massUpdateData.operation}
                    onChange={(e) => setMassUpdateData({...massUpdateData, operation: e.target.value})}
                    className={styles.select}
                  >
                    <option value="increase">Увеличить цены</option>
                    <option value="decrease">Уменьшить цены</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Процент (%)</label>
                  <input
                    type="number"
                    value={massUpdateData.percentage}
                    onChange={(e) => setMassUpdateData({...massUpdateData, percentage: parseInt(e.target.value) || 0})}
                    className={styles.input}
                    min="1"
                    max="1000"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Категория</label>
                  <select
                    value={massUpdateData.category}
                    onChange={(e) => setMassUpdateData({...massUpdateData, category: e.target.value})}
                    className={styles.select}
                  >
                    <option value="all">Все двери</option>
                  </select>
                </div>
              </div>

              {updateMessage && (
                <div className={`${styles.updateMessage} ${styles[updateMessage.type]}`}>
                  {updateMessage.text}
                </div>
              )}

              <div className={styles.massUpdateActions}>
                <button
                  onClick={handleMassPriceUpdate}
                  disabled={updatingPrices}
                  className={styles.massUpdateButton}
                >
                  {updatingPrices ? (
                    <>
                      <div className={styles.spinner}></div>
                      <span>Обновление...</span>
                    </>
                  ) : (
                    <>
                      {massUpdateData.operation === 'increase' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                      <span>
                        {massUpdateData.operation === 'increase' ? 'Увеличить' : 'Уменьшить'} на {massUpdateData.percentage}%
                      </span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setShowMassUpdate(false);
                    setUpdateMessage('');
                  }}
                  className={styles.massUpdateCancel}
                >
                  Отмена
                </button>
              </div>

              <div className={styles.massUpdateInfo}>
                <p>Будет обновлено: <strong>{doors.length} дверей</strong></p>
                <p>
                  Пример: цена 10,000 ₽ {massUpdateData.operation === 'increase' ? 'увеличится' : 'уменьшится'} до{' '}
                  <strong>
                    {Math.round(
                      massUpdateData.operation === 'increase' 
                        ? 10000 * (1 + massUpdateData.percentage / 100)
                        : 10000 * (1 - massUpdateData.percentage / 100)
                    ).toLocaleString()} ₽
                  </strong>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.formSection}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {editingDoor ? 'Редактировать дверь' : 'Добавить новую дверь'}
            </h2>
            <button
              onClick={() => {
                resetForm();
                setIsCreating(!isCreating);
              }}
              className={styles.toggleFormButton}
            >
              {isCreating || editingDoor ? 'Отмена' : (
                <>
                  <Plus size={20} />
                  <span>Добавить дверь</span>
                </>
              )}
            </button>
          </div>

          {(isCreating || editingDoor) && (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Название двери *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Цена (₽) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Покрытие *</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Тип открывания *</label>
                  <input
                    type="text"
                    value={formData.tearType}
                    onChange={(e) => setFormData({...formData, tearType: e.target.value})}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Размер *</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Стекло *</label>
                  <input
                    type="text"
                    value={formData.glass}
                    onChange={(e) => setFormData({...formData, glass: e.target.value})}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Производитель *</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({...formData, material: e.target.value})}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Количество полотен *</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              {/* Секция цветов товара */}
              <div className={styles.colorsSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>
                    <Palette size={20} />
                    Варианты цветов товара
                  </h3>
                  <button
                    type="button"
                    onClick={addColor}
                    className={styles.addColorButton}
                  >
                    <Plus size={16} />
                    <span>Добавить цвет</span>
                  </button>
                </div>

                <p className={styles.helpText}>
                  Добавьте цвета товара. Для каждого цвета можно указать фото образца и дополнительные фото дверей этого цвета.
                </p>

                {(formData.colors || []).map((color, colorIndex) => (
                  <div key={colorIndex} className={styles.colorItem}>
                    <div className={styles.colorHeader}>
                      <div className={styles.colorInfo}>
                        <div 
                          className={styles.colorPreview}
                          style={{ backgroundColor: color.hexCode }}
                          title={color.hexCode}
                        />
                        <input
                          type="text"
                          value={color.name}
                          onChange={(e) => updateColor(colorIndex, 'name', e.target.value)}
                          className={styles.input}
                          placeholder="Название цвета"
                          required
                        />
                        <input
                          type="color"
                          value={color.hexCode}
                          onChange={(e) => updateColor(colorIndex, 'hexCode', e.target.value)}
                          className={styles.colorPicker}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeColor(colorIndex)}
                        className={styles.removeButton}
                        title="Удалить цвет"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Фото цвета (URL) *</label>
                      <input
                        type="text"
                        value={color.colorImage || ''}
                        onChange={(e) => updateColor(colorIndex, 'colorImage', e.target.value)}
                        className={styles.input}
                        placeholder="https://example.com/color-sample.jpg"
                        required
                      />
                      {color.colorImage && (
                        <div className={styles.colorImagePreview}>
                          <img 
                            src={color.colorImage} 
                            alt="Preview" 
                            className={styles.previewImage}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className={styles.colorImages}>
                      <div className={styles.addImageForm}>
                        <input
                          type="text"
                          value={color.newImageUrl || ''}
                          onChange={(e) => updateColor(colorIndex, 'newImageUrl', e.target.value)}
                          className={styles.input}
                          placeholder="URL фото двери этого цвета"
                        />
                        <button
                          type="button"
                          onClick={() => addColorImage(colorIndex)}
                          className={styles.addImageButton}
                        >
                          <Plus size={16} />
                          <span>Добавить фото двери</span>
                        </button>
                      </div>

                      {(color.images || []).length > 0 && (
                        <div className={styles.imagesList}>
                          <h4 className={styles.imagesTitle}>
                            Фото дверей для {color.name || 'этого цвета'} ({(color.images || []).length})
                          </h4>
                          <div className={styles.imagesGrid}>
                            {(color.images || []).map((image, imageIndex) => (
                              <div key={imageIndex} className={styles.imageItem}>
                                <div className={styles.imagePreview}>
                                  <img 
                                    src={image} 
                                    alt={`${color.name} ${imageIndex + 1}`}
                                    onError={(e) => {
                                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9Ijc1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOWNhM2ZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+0J3QtdGCINC00LvRjyDQtNC+0LHQsNCy0LvQtdC90LjQtTwvdGV4dD48L3N2Zz4=';
                                    }}
                                  />
                                  <div className={styles.imageOverlay}>
                                    <span className={styles.imageNumber}>{imageIndex + 1}</span>
                                    <div className={styles.imageActions}>
                                      {imageIndex > 0 && (
                                        <button
                                          type="button"
                                          onClick={() => moveColorImage(colorIndex, imageIndex, imageIndex - 1)}
                                          className={styles.imageAction}
                                          title="Переместить вверх"
                                        >
                                          ↑
                                        </button>
                                      )}
                                      {imageIndex < (color.images || []).length - 1 && (
                                        <button
                                          type="button"
                                          onClick={() => moveColorImage(colorIndex, imageIndex, imageIndex + 1)}
                                          className={styles.imageAction}
                                          title="Переместить вниз"
                                        >
                                          ↓
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => removeColorImage(colorIndex, imageIndex)}
                                        className={styles.imageAction}
                                        title="Удалить"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {(!formData.colors || formData.colors.length === 0) && (
                  <div className={styles.emptyColors}>
                    <Palette size={48} />
                    <p>Нет добавленных цветов</p>
                    <button
                      type="button"
                      onClick={addColor}
                      className={styles.addColorButton}
                    >
                      <Plus size={16} />
                      <span>Добавить первый цвет</span>
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className={styles.checkbox}
                  />
                  <span>Активный товар (отображается в каталоге)</span>
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  <Save size={18} />
                  <span>{editingDoor ? 'Обновить дверь' : 'Создать дверь'}</span>
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className={styles.cancelButton}
                >
                  <X size={18} />
                  <span>Отмена</span>
                </button>
              </div>
            </form>
          )}
        </div>

        <div className={styles.doorsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Все двери ({doors.length})</h2>
            <div className={styles.stats}>
              <span className={styles.stat}>
                Активных: {doors.filter(d => d.isActive).length}
              </span>
              <span className={styles.stat}>
                Неактивных: {doors.filter(d => !d.isActive).length}
              </span>
              <span className={styles.stat}>
                С цветами: {doors.filter(d => d.colors && d.colors.length > 0).length}
              </span>
            </div>
          </div>

          <div className={styles.doorsGrid}>
            {doors.map((door) => (
              <div key={door.id} className={`${styles.doorCard} ${!door.isActive ? styles.inactiveDoor : ''}`}>
                <div className={styles.doorImage}>
                  <img 
                    src={door.colors?.[0]?.images?.[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPtCd0LXRgiDQvdCw0YfQsNC70LAg0LTQu9GPINC00L7QsdCw0LLQu9C10L3QuNC1PC90ZXh0Pjwvc3ZnPg=='} 
                    alt={door.name}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPtCd0LXRgiDQvdCw0YfQsNC70LAg0LTQu9GPINC00L7QsdCw0LLQu9C10L3QuNC1PC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  <div className={styles.doorBadges}>
                    {door.isActive ? (
                      <span className={styles.badgeActive}>Активно</span>
                    ) : (
                      <span className={styles.badgeInactive}>Неактивно</span>
                    )}
                    {door.colors && door.colors.length > 0 && (
                      <span className={styles.badgeColors}>
                        <Palette size={12} />
                        {door.colors.length}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className={styles.doorInfo}>
                  <h3 className={styles.doorName}>{door.name}</h3>
                  <p className={styles.doorPrice}>{door.price.toLocaleString()} ₽</p>
                  <div className={styles.doorSpecs}>
                    <span>•</span>
                    <span>{door.size}</span>
                    <span>•</span>
                    <span>{door.color}</span>
                  </div>
                  
                  <div className={styles.doorActions}>
                    <button
                      onClick={() => editDoor(door)}
                      className={styles.editButton}
                    >
                      <Edit size={16} />
                      <span>Редактировать</span>
                    </button>
  
                    <button
                      onClick={() => deleteDoor(door.id)}
                      className={styles.deleteButton}
                    >
                      <Trash2 size={16} />
                      <span>Удалить</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {doors.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🚪</div>
              <h3 className={styles.emptyTitle}>Нет добавленных дверей</h3>
              <p className={styles.emptyText}>
                Начните с добавления первой двери в каталог
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}