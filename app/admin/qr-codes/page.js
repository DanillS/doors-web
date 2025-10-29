'use client';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './QRCodesPage.module.css';

export default function QRCodesPage() {
  const [doors, setDoors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrCodes, setQrCodes] = useState({});

  useEffect(() => {
    fetchDoors();
  }, []);

  useEffect(() => {
    if (doors.length > 0) {
      generateAllQRCodes();
    }
  }, [doors]);

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

  const generateAllQRCodes = async () => {
    const codes = {};
    for (const door of doors) {
      try {
        const productUrl = `${window.location.origin}/doors/${door.id}`;
        const qrDataUrl = await QRCode.toDataURL(productUrl, {
          width: 120,
          margin: 1
        });
        codes[door.id] = qrDataUrl;
      } catch (err) {
        console.error(`Error generating QR for ${door.name}:`, err);
      }
    }
    setQrCodes(codes);
  };

  const downloadAllQRCodes = async () => {
    for (const door of doors) {
      if (qrCodes[door.id]) {
        await downloadQRCode(door, qrCodes[door.id]);
        // Задержка между скачиваниями
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  };

  const downloadQRCode = (door, qrDataUrl) => {
    return new Promise((resolve) => {
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${door.name.replace(/\s+/g, '-')}.png`;
      downloadLink.href = qrDataUrl;
      downloadLink.click();
      resolve();
    });
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка товаров...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin" className={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Назад в админ-панель</span>
        </Link>
        <h1>QR-коды всех товаров</h1>
        <button 
          onClick={downloadAllQRCodes} 
          className={styles.downloadAllButton}
          disabled={Object.keys(qrCodes).length === 0}
        >
          <Download size={18} />
          <span>Скачать все QR-коды</span>
        </button>
      </div>

      <div className={styles.qrGrid}>
        {doors.map((door) => (
          <div key={door.id} className={styles.qrCard}>
            <div className={styles.qrCode}>
              {qrCodes[door.id] ? (
                <img 
                  src={qrCodes[door.id]} 
                  alt={`QR Code for ${door.name}`}
                  className={styles.qrImage}
                />
              ) : (
                <div className={styles.qrLoading}>Генерация...</div>
              )}
            </div>
            <div className={styles.doorInfo}>
              <h3>{door.name}</h3>
              <p className={styles.price}>{door.price.toLocaleString()} ₽</p>
              <button 
                onClick={() => downloadQRCode(door, qrCodes[door.id])}
                className={styles.downloadButton}
                disabled={!qrCodes[door.id]}
              >
                <Download size={14} />
                <span>Скачать</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}