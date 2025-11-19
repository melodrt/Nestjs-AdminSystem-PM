import { useState, useEffect } from 'react';
import { tasksApi } from '../api/tasksApi';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksApi.getAllTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error al cargar tareas:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard
        </h1>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Total de Tareas
              </h2>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {tasks.length}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tareas Completadas
              </h2>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {tasks.filter(t => t.completed).length}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tareas Pendientes
              </h2>
              <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                {tasks.filter(t => !t.completed).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

