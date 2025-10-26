'use client';
import { useParams } from 'next/navigation';
import { useFavorites } from '../../../context/FavoritesContext';
import Link from 'next/link';
import { CheckCircle, Truck, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OrderPage() {
  const params = useParams();
  const orderId = params.id;
  const { orders } = useFavorites();
  const [order, setOrder] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (orderId && orders.length > 0) {
      const foundOrder = orders.find(o => o.id === parseInt(orderId));
      setOrder(foundOrder);
    }
  }, [orderId, orders]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка заказа...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Заказ не найден</h1>
          <Link href="/favorites" className="text-blue-600 hover:text-blue-800">
            Вернуться в избранное
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Д</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Дверной Мир</h1>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Заголовок успеха */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Заказ оформлен!</h1>
            <p className="text-gray-600">Номер заказа: #{order.id}</p>
          </div>

          {/* Статус заказа */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Статус заказа</h2>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Оплачено
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Truck size={16} />
                <span>Доставка: 2-3 рабочих дня</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          </div>

          {/* Детали заказа */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Детали заказа</h2>
            
            <div className="space-y-3">
              {order.items.map((door, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="font-medium">{door.name}</div>
                    <div className="text-sm text-gray-500">{door.material}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{door.price.toLocaleString()} ₽</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Итого:</span>
                <span>{order.totalAmount.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Способ оплаты:</span>
                <span>{order.paymentMethod === 'card' ? 'Банковская карта' : order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Продолжить покупки
            </Link>
            <Link
              href="/favorites"
              className="flex-1 border border-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg font-medium transition-colors hover:bg-gray-50"
            >
              В избранное
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}