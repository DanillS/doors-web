// components/AdminPanel.jsx
'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Image, Upload } from 'lucide-react';
import styles from './AdminPanel.module.css';

export default function AdminPanel() {
  const [doors, setDoors] = useState([]);
  const [editingDoor, setEditingDoor] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    material: '',
    size: '',
    color: '',
    image: '',
    images: [],
    glass: '',
    tearType: '',
    description: '',
    isActive: true
  });
  const [newImageUrl, setNewImageUrl] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingDoor ? `/api/doors/${editingDoor.id}` : '/api/doors';
      const method = editingDoor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          images: formData.images.filter(url => url.trim() !== '')
        }),
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
      image: '',
      glass: '',
      tearType: '',
      images: [],
      description: '',
      isActive: true
    });
    setNewImageUrl('');
  };

  const editDoor = (door) => {
    setEditingDoor(door);
    setIsCreating(false);
    setFormData({
      name: door.name,
      price: door.price.toString(),
      material: door.material,
      size: door.size,
      color: door.color,
      glass: door.glass,
      tearType: door.tearType, 
      image: door.image || '',
      images: door.images || [],
      description: door.description,
      isActive: door.isActive
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

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...formData.images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setFormData(prev => ({ ...prev, images: newImages }));
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
        <h1 className={styles.adminTitle}>Панель управления</h1>
        <p className={styles.adminSubtitle}>Управление каталогом элитных дверей</p>
      </div>

      <div className={styles.adminContent}>
        {/* Форма создания/редактирования */}
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
                  <label className={styles.label}>Основное фото (URL) *</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className={styles.input}
                    placeholder="https://example.com/photo.jpg"
                    required
                  />
                </div>
              </div>

              {/* Дополнительные фото для слайдера */}
              <div className={styles.imagesSection}>
                <label className={styles.label}>Дополнительные фото для слайдера</label>
                <p className={styles.helpText}>
                  Добавьте URL изображений для создания слайдера. Первое фото будет основным в каталоге.
                </p>
                
                <div className={styles.addImageForm}>
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className={styles.input}
                    placeholder="https://example.com/photo2.jpg"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className={styles.addImageButton}
                  >
                    <Plus size={16} />
                    <span>Добавить фото</span>
                  </button>
                </div>

                {/* Список добавленных фото */}
                {formData.images.length > 0 && (
                  <div className={styles.imagesList}>
                    <h4 className={styles.imagesTitle}>
                      Добавленные фото ({formData.images.length})
                    </h4>
                    <div className={styles.imagesGrid}>
                      {formData.images.map((url, index) => (
                        <div key={index} className={styles.imageItem}>
                          <div className={styles.imagePreview}>
                            <img 
                              src={url} 
                              alt={`Preview ${index + 1}`}
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9Ijc1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOWNhM2ZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+0J3QtdGCINC00LvRjyDQtNC+0LHQsNCy0LvQtdC90LjQtTwvdGV4dD48L3N2Zz4=';
                              }}
                            />
                            <div className={styles.imageOverlay}>
                              <span className={styles.imageNumber}>{index + 1}</span>
                              <div className={styles.imageActions}>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => moveImage(index, index - 1)}
                                    className={styles.imageAction}
                                    title="Переместить вверх"
                                  >
                                    ↑
                                  </button>
                                )}
                                {index < formData.images.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => moveImage(index, index + 1)}
                                    className={styles.imageAction}
                                    title="Переместить вниз"
                                  >
                                    ↓
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
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

              <div className={styles.formGroup}>
                <label className={styles.label}>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className={styles.textarea}
                  rows="4"
                />
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

        {/* Список дверей */}
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
                С фото: {doors.filter(d => d.images && d.images.length > 0).length}
              </span>
            </div>
          </div>

          <div className={styles.doorsGrid}>
            {doors.map((door) => (
              <div key={door.id} className={`${styles.doorCard} ${!door.isActive ? styles.inactiveDoor : ''}`}>
                <div className={styles.doorImage}>
                  <img 
                    src={door.image} 
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
                    {door.images && door.images.length > 0 && (
                      <span className={styles.badgePhotos}>
                        <Image size={12} />
                        {door.images.length + 1}
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