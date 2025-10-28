/** @type {import('next').NextConfig} */
const nextConfig = {
  // Разрешить запросы с локальных IP для разработки
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1', 
    '192.168.31.89', // твой текущий IP
    '192.168.31.34', // предыдущий IP из ошибки
    '10.97.141.240', 
    '10.132.68.231', // еще один IP из логов
    '192.168.1.0/24', // весь диапазон локальной сети
  ],
  
  // Настройки CORS для API
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      {
        source: '/_next/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },

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

  // Логирование для отладки
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig