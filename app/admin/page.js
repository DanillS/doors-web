'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DoorOpen, RefreshCw } from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';
import './AdminPanel.css';

function AdminPanelContent() {
  const [doors, setDoors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDoor, setEditingDoor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    material: '',
    size: '',
    color: '',
    image: '',
    description: ''
  });
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    loadDoors();
  }, []);

  const loadDoors = async () => {
    try {
      setDebugInfo('Загрузка дверей...');
      const response = await fetch('/api/doors');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setDoors(data);
      setDebugInfo(`Успешно загружено ${data.length} дверей`);
      console.log('✅ Loaded doors:', data);
    } catch (error) {
      console.error('❌ Error loading doors:', error);
      setDebugInfo(`Ошибка загрузки: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setDebugInfo('Сохранение двери...');
      const url = editingDoor ? `/api/doors/${editingDoor.id}` : '/api/doors';
      const method = editingDoor ? 'PUT' : 'POST';

      console.log('📤 Sending data:', formData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Save result:', result);

      setDebugInfo(editingDoor ? '✅ Дверь обновлена' : '✅ Дверь добавлена');
      setShowForm(false);
      setEditingDoor(null);
      setFormData({
        name: '',
        price: '',
        material: '',
        size: '',
        color: '',
        image: '',
        description: ''
      });
      
      await loadDoors();
      
    } catch (error) {
      console.error('❌ Error saving door:', error);
      setDebugInfo(`❌ Ошибка сохранения: ${error.message}`);
      alert(`Ошибка сохранения: ${error.message}`);
    }
  };

  const handleEdit = (door) => {
    console.log('✏️ Editing door:', door);
    setEditingDoor(door);
    setFormData({
      name: door.name,
      price: door.price.toString(),
      material: door.material,
      size: door.size,
      color: door.color,
      image: door.image,
      description: door.description
    });
    setShowForm(true);
    setDebugInfo(`Редактирование: ${door.name}`);
  };

  const handleDelete = async (id) => {
    if (confirm('Вы уверены, что хотите удалить эту дверь?')) {
      try {
        setDebugInfo('Удаление двери...');
        const response = await fetch(`/api/doors/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Delete result:', result);

        setDebugInfo('✅ Дверь удалена');
        await loadDoors();
      } catch (error) {
        console.error('❌ Error deleting door:', error);
        setDebugInfo(`❌ Ошибка удаления: ${error.message}`);
        alert(`Ошибка удаления: ${error.message}`);
      }
    }
  };

  const DebugPanel = () => (
    <div className="debug-panel">
      <div className="debug-content">
        <div>
          <h3 className="debug-title">Отладочная информация:</h3>
          <p className="debug-info">{debugInfo || 'Готов к работе'}</p>
        </div>
        <button
          onClick={loadDoors}
          className="refresh-button"
          title="Обновить данные"
        >
          <RefreshCw size={16} />
          <span>Обновить</span>
        </button>
      </div>
    </div>
  );

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
    <div className="admin-container">
      <main className="admin-main">
        <DebugPanel />

        {/* Статистика и кнопка добавления */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number blue">{doors.length}</div>
            <div className="stat-label">Всего дверей</div>
          </div>
          <div className="stat-card">
            <div className="stat-number green">
              {doors.reduce((sum, door) => sum + door.price, 0).toLocaleString()} ₽
            </div>
            <div className="stat-label">Общая стоимость</div>
          </div>
          <div className="stat-card">
            <div className="stat-number purple">
              {doors.length > 0 ? Math.round(doors.reduce((sum, door) => sum + door.price, 0) / doors.length).toLocaleString() : 0} ₽
            </div>
            <div className="stat-label">Средняя цена</div>
          </div>
          <div className="stat-card">
            <button
              onClick={() => {
                setEditingDoor(null);
                setFormData({
                  name: '',
                  price: '',
                  material: '',
                  size: '',
                  color: '',
                  image: '',
                  description: ''
                });
                setShowForm(true);
                setDebugInfo('Добавление новой двери');
              }}
              className="add-button"
            >
              <Plus size={20} />
              <span>Добавить дверь</span>
            </button>
          </div>
        </div>

        {/* Форма добавления/редактирования */}
        {showForm && (
          <div className="form-container">
            <h2 className="form-title">
              {editingDoor ? '✏️ Редактировать дверь' : '➕ Добавить новую дверь'}
            </h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label className="form-label">Название двери</label>
                <input
                  type="text"
                  placeholder="Название двери"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Цена (₽)</label>
                <input
                  type="number"
                  placeholder="Цена"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Материал</label>
                <input
                  type="text"
                  placeholder="Материал"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Размер</label>
                <input
                  type="text"
                  placeholder="Размер"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Цвет</label>
                <input
                  type="text"
                  placeholder="Цвет"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">URL изображения</label>
                <input
                  type="text"
                  placeholder="URL изображения"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Описание</label>
                <textarea
                  placeholder="Описание"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  rows="3"
                  required
                />
              </div>
              <div className="form-actions full-width">
                <button
                  type="submit"
                  className="submit-button"
                >
                  <span>{editingDoor ? '💾 Обновить' : '➕ Добавить'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingDoor(null);
                    setDebugInfo('Форма закрыта');
                  }}
                  className="cancel-button"
                >
                  ❌ Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Карточки дверей в три столбца */}
        {doors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚪</div>
            <h3 className="empty-title">Нет дверей в каталоге</h3>
            <p className="empty-description">Добавьте первую дверь, нажав кнопку "Добавить дверь"</p>
            <button
              onClick={() => {
                setEditingDoor(null);
                setFormData({
                  name: '',
                  price: '',
                  material: '',
                  size: '',
                  color: '',
                  image: '',
                  description: ''
                });
                setShowForm(true);
                setDebugInfo('Добавление новой двери');
              }}
              className="empty-button"
            >
              ➕ Добавить первую дверь
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {doors.map((door) => (
              <div key={door.id} className="door-card">
                {/* Изображение с бейджем цены */}
                <div className="card-image-container">
                  <img
                    src={door.image}
                    alt={door.name}
                    className="card-image"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNkMzMiAxNiAzMiAzMiAxNiAzMkMzMiAzMiAxNiA0OCAxNiA0OCIgc3Ryb2tlPSIjOEU5MEE0IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg==';
                    }}
                  />
                  <div className="price-badge">
                    {door.price.toLocaleString()} ₽
                  </div>
                  <div className="material-badge">
                    {door.material}
                  </div>
                </div>

                {/* Информация о двери */}
                <div className="card-content">
                  <h3 className="card-title">
                    {door.name}
                  </h3>

                  <div className="card-details">
                    <div className="detail-row">
                      <span className="detail-label">Размер:</span>
                      <span className="detail-value">{door.size}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Цвет:</span>
                      <span className="detail-value">{door.color}</span>
                    </div>
                  </div>

                  <p className="card-description">
                    {door.description}
                  </p>

                  {/* Кнопки действий */}
                  <div className="card-actions">
                    <button
                      onClick={() => handleEdit(door)}
                      className="edit-button"
                    >
                      <Edit size={16} />
                      <span>Редактировать</span>
                    </button>
                    <button
                      onClick={() => handleDelete(door.id)}
                      className="delete-button"
                    >
                      <Trash2 size={16} />
                      <span>Удалить</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <AdminAuth>
      <AdminPanelContent />
    </AdminAuth>
  );
}