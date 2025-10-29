'use client';
import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, QrCode } from 'lucide-react';
import styles from './QRCodeGenerator.module.css';

export default function QRCodeGenerator({ door }) {
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef(null);
  
  // Генерируем URL товара
  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/doors/${door.id}` : '';

  useEffect(() => {
    if (showQR && productUrl) {
      generateQRCode();
    }
  }, [showQR, productUrl]);

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(productUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const downloadQRCode = () => {
    if (qrDataUrl) {
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${door.name.replace(/\s+/g, '-')}.png`;
      downloadLink.href = qrDataUrl;
      downloadLink.click();
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      alert('Ссылка скопирована в буфер обмена!');
    } catch (err) {
      console.error('Ошибка копирования: ', err);
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = productUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Ссылка скопирована!');
    }
  };

  if (!productUrl) return null;

  return (
    <div className={styles.qrContainer}>
      <button 
        onClick={() => setShowQR(!showQR)}
        className={styles.toggleButton}
      >
        <QrCode size={18} />
        <span>QR-код товара</span>
      </button>

      {showQR && (
        <div className={styles.qrModal}>
          <div className={styles.qrContent}>
            <h3>QR-код для {door.name}</h3>
            
            <div className={styles.qrCode}>
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt={`QR Code for ${door.name}`}
                  className={styles.qrImage}
                />
              ) : (
                <div className={styles.loading}>Генерация QR-кода...</div>
              )}
            </div>
            
            <div className={styles.urlInfo}>
              <p className={styles.url}>{productUrl}</p>
              <p className={styles.note}>Отсканируйте код для быстрого доступа к товару</p>
            </div>
            
            <div className={styles.actions}>
              <button 
                onClick={downloadQRCode} 
                className={styles.downloadButton}
                disabled={!qrDataUrl}
              >
                <Download size={16} />
                <span>Скачать QR</span>
              </button>
              
              <button onClick={copyLink} className={styles.copyButton}>
                <Copy size={16} />
                <span>Копировать ссылку</span>
              </button>
              
              <button 
                onClick={() => setShowQR(false)} 
                className={styles.closeButton}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}