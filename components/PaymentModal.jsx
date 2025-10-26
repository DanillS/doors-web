'use client';
import { useState } from 'react';
import { X, MessageCircle, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Добавляем импорт контекста
import styles from './PaymentModal.module.css';

export default function PaymentModal({ 
  isOpen, 
  onClose 
}) {
  const [sending, setSending] = useState(false);

  // Используем контекст корзины
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotalItems,
    getTotalPrice 
  } = useCart();

  // Функции управления корзиной (исправленные)
  const increaseQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const decreaseQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  // Расчет итогов
  const totalAmount = getTotalPrice();
  const totalItems = getTotalItems();

  const handleWhatsAppOrder = async () => {
    if (cart.length === 0) return;
    
    setSending(true);
    
    const phoneNumber = '79046726360';
    
    // Форматируем детали заказа
    const orderDetails = cart.map((item, index) => 
      `🏷️ Товар ${index + 1}:
📝 ${item.name}
💰 Цена: ${item.price.toLocaleString()} ₽ × ${item.quantity} шт. = ${(item.price * item.quantity).toLocaleString()} ₽
📏 Размер: ${item.size}
🎨 Материал: ${item.material}
🌈 Цвет: ${item.color}`
    ).join('\n\n');

    const message = `Здравствуйте! Хочу оформить заказ:

${orderDetails}

📊 ИТОГО:
📦 Общее количество: ${totalItems} шт.
💰 Сумма заказа: ${totalAmount.toLocaleString()} ₽

Прошу связаться со мной для подтверждения заказа и согласования деталей доставки и монтажа.`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Открываем WhatsApp
    window.open(url, '_blank');
    
    // Закрываем модалку через секунду
    setTimeout(() => {
      setSending(false);
      onClose();
      handleClearCart(); // Очищаем корзину после отправки
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* Заголовок */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>Корзина заказов</h2>
            <p className={styles.subtitle}>Проверьте ваш заказ перед отправкой</p>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        {/* Содержимое корзины */}
        <div className={styles.content}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyIcon}>🛒</div>
              <h3 className={styles.emptyTitle}>Корзина пуста</h3>
              <p className={styles.emptyText}>Добавьте товары из каталога</p>
            </div>
          ) : (
            <>
              {/* Список товаров */}
              <div className={styles.cartItems}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Y2EzZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7inaTvuI88L3RleHQ+PC9zdmc+';
                        }}
                      />
                    </div>
                    
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemName}>{item.name}</h4>
                      <div className={styles.itemSpecs}>
                        <span>{item.material}</span>
                        <span>•</span>
                        <span>{item.size}</span>
                        <span>•</span>
                        <span>{item.color}</span>
                      </div>
                      <div className={styles.itemPrice}>
                        {item.price.toLocaleString()} ₽/шт.
                      </div>
                    </div>

                    <div className={styles.itemControls}>
                      <div className={styles.quantityControls}>
                        <button 
                          onClick={() => decreaseQuantity(item.id)}
                          className={styles.quantityButton}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button 
                          onClick={() => increaseQuantity(item.id)}
                          className={styles.quantityButton}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className={styles.itemTotal}>
                        {(item.price * item.quantity).toLocaleString()} ₽
                      </div>
                      
                      <button 
                        onClick={() => handleRemoveFromCart(item.id)}
                        className={styles.removeButton}
                        title="Удалить из корзины"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Итоговая сумма */}
              <div className={styles.orderSummary}>
                <div className={styles.summaryRow}>
                  <span>Количество товаров:</span>
                  <span>{totalItems} шт.</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Общая стоимость:</span>
                  <span className={styles.totalAmount}>
                    {totalAmount.toLocaleString()} ₽
                  </span>
                </div>
              </div>

              {/* Кнопка очистки корзины */}
              <div className={styles.cartActions}>
                <button onClick={handleClearCart} className={styles.clearButton}>
                  Очистить корзину
                </button>
              </div>
            </>
          )}
        </div>

        {/* Футер с кнопкой отправки */}
        {cart.length > 0 && (
          <div className={styles.footer}>
            <button
              onClick={handleWhatsAppOrder}
              disabled={sending || cart.length === 0}
              className={styles.whatsappButton}
            >
              {sending ? (
                <>
                  <div className={styles.spinner}></div>
                  <span>Отправка...</span>
                </>
              ) : (
                <>
                  <MessageCircle size={24} />
                  <span>Отправить заказ в WhatsApp</span>
                </>
              )}
            </button>
            
            <div className={styles.securityBadges}>
              <span>🔒 Конфиденциально</span>
              <span>⚡ Мгновенно</span>
              <span>💬 Персональный менеджер</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}