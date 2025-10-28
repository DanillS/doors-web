'use client';
import { useEffect } from 'react';

export default function KeepAlive() {
  useEffect(() => {
    const pingServer = async () => {
      try {
        await fetch('/api/keep-alive');
        console.log('✅ Keep-alive успешен:', new Date().toLocaleTimeString());
      } catch (error) {
        console.warn('⚠️ Keep-alive ошибка');
      }
    };

    // Запускаем каждые 4 минуты когда есть посетители
    const interval = setInterval(pingServer, 4 * 60 * 1000);
    pingServer(); // Первый запрос сразу

    return () => clearInterval(interval);
  }, []);

  return null;
}