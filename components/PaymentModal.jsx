'use client';
import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  totalAmount, 
  doorCount, 
  onPaymentSuccess 
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWhatsAppOrder = () => {
    const phoneNumber = '79046726360';
    const message = `Здравствуйте! Хочу заказать ${doorCount} дверей на сумму ${totalAmount.toLocaleString()} ₽`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  // Обработка клика на фон
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px'
      }}
      onClick={handleBackdropClick}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '448px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Заголовок */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
          }}>
            Оформление заказа
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {/* Информация о заказе */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ color: '#6b7280' }}>Сумма заказа:</span>
            <span style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#059669'
            }}>
              {totalAmount.toLocaleString()} ₽
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <span>Товаров:</span>
            <span>{doorCount} шт.</span>
          </div>
        </div>

        {/* Способ связи */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleWhatsAppOrder}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                textAlign: 'left',
                backgroundColor: 'white',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                opacity: isProcessing ? 0.5 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (!isProcessing) {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseOut={(e) => {
                if (!isProcessing) {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = 'white';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div 
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#059669',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MessageCircle size={24} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 600,
                    color: '#1f2937',
                    fontSize: '16px'
                  }}>
                    Заказ через WhatsApp
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    Напишите нам в мессенджер для оформления заказа
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Инструкция */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#f0fdf4',
            borderRadius: '8px',
            border: '1px solid #bbf7d0'
          }}>
            <h4 style={{
              fontWeight: 600,
              color: '#065f46',
              marginBottom: '8px',
              marginTop: 0
            }}>
              Как оформить заказ:
            </h4>
            <ol style={{
              color: '#065f46',
              fontSize: '14px',
              margin: 0,
              paddingLeft: '16px'
            }}>
              <li>Нажмите кнопку "Заказ через WhatsApp"</li>
              <li>В открывшемся чате напишите нам</li>
              <li>Укажите какие двери вас интересуют</li>
              <li>Мы ответим в течение 5 минут</li>
            </ol>
          </div>

          {/* Контактная информация */}
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <span>📞 +7 (904) 672-63-60</span>
              <span>🕒 9:00 - 21:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}