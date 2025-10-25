// app/layout.js
'use client';
import { FavoritesProvider } from '../context/FavoritesContext';
import { CartProvider } from '../context/CartContext'; // Добавляем импорт
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
        <CartProvider> {/* Добавляем CartProvider */}
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}