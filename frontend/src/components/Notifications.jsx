import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import { tasksApi } from '../api/tasksApi';
import { useAppSelector } from '../hooks/redux';

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state?.auth?.user);

  useEffect(() => {
    if (isOpen && user?.id) {
      loadMyTasks();
    }
  }, [isOpen, user?.id]);

  const loadMyTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await tasksApi.getAllTasks();
      // Filtrar tareas asignadas al usuario que no estén completadas
      const myPendingTasks = allTasks.filter(
        (task) => task.assignedTo === user?.id && task.status !== 'done'
      );
      setTasks(myPendingTasks.slice(0, 10)); // Últimas 10
    } catch (err) {
      console.error('Error al cargar tareas:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = tasks.length;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 size={16} className="text-green-600" />;
      case 'in-progress':
        return <PlayCircle size={16} className="text-yellow-600" />;
      default:
        return <Circle size={16} className="text-gray-500" />;
    }
  };

  const handleTaskClick = (task) => {
    navigate('/tasks');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Bell size={20} />
        {pendingCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {pendingCount > 9 ? '9+' : pendingCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Notificaciones
              </h3>
              {pendingCount > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {pendingCount} tarea{pendingCount !== 1 ? 's' : ''} pendiente{pendingCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Cargando...
                </div>
              ) : tasks.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {getStatusIcon(task.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Proyecto: {task.project?.name || 'Sin proyecto'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No hay notificaciones
                  </p>
                </div>
              )}
            </div>
            {tasks.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    navigate('/tasks');
                    setIsOpen(false);
                  }}
                  className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline text-center"
                >
                  Ver todas las tareas
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

