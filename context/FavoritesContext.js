'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);

  // Загрузка из localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('door-favorites');
    const savedOrders = localStorage.getItem('door-orders');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem('door-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('door-orders', JSON.stringify(orders));
  }, [orders]);

  const toggleFavorite = (door) => {
    setFavorites(prev => {
      const isFavorite = prev.find(fav => fav.id === door.id);
      if (isFavorite) {
        return prev.filter(fav => fav.id !== door.id);
      } else {
        return [...prev, door];
      }
    });
  };

  const isFavorite = (doorId) => {
    return favorites.some(fav => fav.id === doorId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const removeFromFavorites = (doorId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== doorId));
  };

  const addOrder = (order) => {
    const newOrder = {
      id: Date.now(),
      ...order,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      toggleFavorite, 
      isFavorite, 
      clearFavorites,
      removeFromFavorites,
      orders,
      addOrder
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};