import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Settings, FolderKanban } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/workspaces', label: 'Workspaces', icon: FolderKanban },
    { path: '/projects', label: 'Proyectos', icon: FolderKanban },
    { path: '/tasks', label: 'Tareas', icon: ListTodo },
    { path: '/settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-10">
        <div className="p-6">
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

      {/* Main Content */}
      <main className="ml-64" style={{ marginLeft: '16rem', padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}

