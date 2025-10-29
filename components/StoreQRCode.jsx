'use client';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, QrCode, Home, Phone, Mail } from 'lucide-react';
import './StoreQRCode.css';

export default function StoreQRCode() {
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [selectedPage, setSelectedPage] = useState('home');
  
  const pages = {
    home: {
      name: 'Главная страница',
      url: typeof window !== 'undefined' ? window.location.origin : '',
      icon: <Home size={20} />
    },
    catalog: {
      name: 'Каталог товаров', 
      url: typeof window !== 'undefined' ? `${window.location.origin}/` : '',
      icon: <QrCode size={20} />
    },
    phone: {
      name: 'Телефон для связи',
      url: 'tel:+79503101560',
      icon: <Phone size={20} />
    },
    email: {
      name: 'Электронная почта',
      url: 'mailto:stepanovpg@mail.ru',
      icon: <Mail size={20} />
    }
  };

  useEffect(() => {
    if (showQR && pages[selectedPage].url) {
      generateQRCode();
    }
  }, [showQR, selectedPage]);

  const generateQRCode = async () => {
    try {
      const url = pages[selectedPage].url;
      const qrUrl = await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrDataUrl(qrUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const downloadQRCode = () => {
    if (qrDataUrl) {
      const pageName = pages[selectedPage].name.toLowerCase().replace(/\s+/g, '-');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${pageName}.png`;
      downloadLink.href = qrDataUrl;
      downloadLink.click();
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pages[selectedPage].url);
      alert('Ссылка скопирована в буфер обмена!');
    } catch (err) {
      console.error('Ошибка копирования: ', err);
      const textArea = document.createElement('textarea');
      textArea.value = pages[selectedPage].url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Ссылка скопирована!');
    }
  };

  return (
    <div className="storeQRContainer">
      <button 
        onClick={() => setShowQR(!showQR)}
        className="toggleButton"
      >
        <QrCode size={18} />
        <span>QR-коды магазина</span>
      </button>

      {showQR && (
        <div className="qrModal">
          <div className="qrContent">
            <h2>QR-коды магазина Elite Doors</h2>
            
            {/* Выбор страницы */}
            <div className="pageSelector">
              {Object.entries(pages).map(([key, page]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPage(key)}
                  className={`pageButton ${selectedPage === key ? 'active' : ''}`}
                >
                  {page.icon}
                  <span>{page.name}</span>
                </button>
              ))}
            </div>

            {/* QR-код */}
            <div className="qrSection">
              <h3>{pages[selectedPage].name}</h3>
              
              <div className="qrCode">
                {qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt={`QR Code for ${pages[selectedPage].name}`}
                    className="qrImage"
                  />
                ) : (
                  <div className="loading">Генерация QR-кода...</div>
                )}
              </div>
              
              <div className="urlInfo">
                <p className="url">{pages[selectedPage].url}</p>
                <p className="note">
                  {selectedPage === 'phone' && 'Наведите камеру чтобы позвонить'}
                  {selectedPage === 'email' && 'Наведите камеру чтобы написать письмо'}
                  {(selectedPage === 'home' || selectedPage === 'catalog') && 'Наведите камеру чтобы перейти на сайт'}
                </p>
              </div>
            </div>
            
            {/* Действия */}
            <div className="actions">
              <button 
                onClick={downloadQRCode} 
                className="downloadButton"
                disabled={!qrDataUrl}
              >
                <Download size={16} />
                <span>Скачать QR</span>
              </button>
              
              <button onClick={copyLink} className="copyButton">
                <Copy size={16} />
                <span>Копировать ссылку</span>
              </button>
              
              <button 
                onClick={() => setShowQR(false)} 
                className="closeButton"
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