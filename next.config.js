/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  // Добавляем конфигурацию для CORS в development
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '192.168.137.222' // ваш IP адрес
  ]
}

module.exports = nextConfig