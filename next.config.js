/** @type {import('next').NextConfig} */
const nextConfig = {
  // Разрешить запросы с локальных IP для разработки
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '192.168.31.89', // твой IP
    '192.168.1.0/24', // или весь диапазон локальной сети
  ],
  
  // Опционально: настройки для изображений
  images: {
    domains: [
      'images.unsplash.com',
      'picsum.photos',
      'via.placeholder.com',
      'localhost',
      '127.0.0.1',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // разрешить все домены
      },
      {
        protocol: 'http',
        hostname: '**', // разрешить все локальные домены
      },
    ],
  },

  // Включить строгий режим React
  reactStrictMode: true,

  // Оптимизации для продакшена
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig