import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/slices/authSlice';
import { LayoutDashboard, ListTodo, Settings, FolderKanban, LogOut } from 'lucide-react';
import SearchBar from './SearchBar';
import Notifications from './Notifications';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state?.auth || {});

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/workspaces', label: 'Workspaces', icon: FolderKanban },
    { path: '/projects', label: 'Proyectos', icon: FolderKanban },
    { path: '/tasks', label: 'Tareas', icon: ListTodo },
    { path: '/settings', label: 'Configuración', icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-10 flex flex-col">
        <div className="p-6 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            📋 PM Platform
          </h1>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Top Bar */}
      <header className="fixed top-0 left-64 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-20 flex items-center justify-between px-6">
        <div className="flex-1 max-w-2xl">
          <SearchBar />
        </div>
        <div className="flex items-center gap-4">
          <Notifications />
          <div className="relative z-50">
            <ThemeToggle />
          </div>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 mt-16" style={{ marginLeft: '16rem', marginTop: '4rem', padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}

