'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './AdminAuth.css';

export default function AdminAuth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/check-auth');
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
      } else {
        alert('Неверные данные для входа');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Ошибка при входе');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="auth-loading-container">
        <div className="auth-loading-content">
          <div className="auth-loading-spinner"></div>
          <p className="auth-loading-text">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <>
      <AdminHeader onLogout={handleLogout} />
      {children}
    </>
  );
}

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Заполните все поля');
      return;
    }
    
    setIsLoading(true);
    await onLogin(username, password);
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-text">A</span>
          </div>
          <h2 className="login-title">Вход в админ-панель</h2>
          <p className="login-subtitle">
            Введите данные для доступа к управлению сайтом
          </p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-inputs">
            <div className="input-group">
              <label htmlFor="username" className="input-label">
                Логин
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="login-input"
                placeholder="Введите логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="login-input"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? (
              <div className="button-spinner"></div>
            ) : (
              'Войти в админ-панель'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminHeader({ onLogout }) {
  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="admin-header-left">
          <div className="admin-logo">
            <span className="admin-logo-text">A</span>
          </div>
          <div className="admin-header-info">
            <h1 className="admin-header-title">Админ-панель</h1>
            <p className="admin-header-subtitle">Управление сайтом</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="logout-button"
        >
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Выйти</span>
        </button>
      </div>
    </header>
  );
}