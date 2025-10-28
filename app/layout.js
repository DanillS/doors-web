// app/layout.js
'use client';
import { FavoritesProvider } from '../context/FavoritesContext';
import { CartProvider } from '../context/CartContext';
import KeepAlive from '../components/KeepAlive'; // Добавляем импорт
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <title>Магазин дверей | Купить качественные двери</title>
        <meta name="description" content="Продажа качественных межкомнатных и входных дверей" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <CartProvider>
          <FavoritesProvider>
            <KeepAlive /> {/* Добавляем компонент здесь */}
            {children}
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}