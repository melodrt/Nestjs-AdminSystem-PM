import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

// Función para obtener el tema inicial
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Si no hay tema guardado, usar preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

// Función para aplicar el tema
const applyTheme = (isDark) => {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const theme = getInitialTheme();
    // Aplicar tema inmediatamente
    applyTheme(theme);
    return theme;
  });

  useEffect(() => {
    // Aplicar tema cuando cambie el estado
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newIsDark = !isDark;
    
    // Aplicar inmediatamente antes de actualizar el estado
    const root = document.documentElement;
    if (newIsDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    setIsDark(newIsDark);
  };

  // Remover console.log en producción

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
      aria-label="Toggle theme"
      type="button"
      style={{ zIndex: 1000 }}
    >
      {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-600 dark:text-gray-300" />}
    </button>
  );
}

