import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FolderKanban, ListTodo, FolderOpen } from 'lucide-react';
import { projectsApi } from '../api/projectsApi';
import { tasksApi } from '../api/tasksApi';
import { workspacesApi } from '../api/workspacesApi';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], tasks: [], workspaces: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K o Cmd+K para abrir búsqueda
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      // ESC para cerrar
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 0) {
      performSearch();
    } else {
      setResults({ projects: [], tasks: [], workspaces: [] });
    }
  }, [query]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const [projects, tasks, workspaces] = await Promise.all([
        projectsApi.getAllProjects(),
        tasksApi.getAllTasks(),
        workspacesApi.getAllWorkspaces(),
      ]);

      const searchTerm = query.toLowerCase();
      const filteredProjects = projects
        .filter((p) => p.name.toLowerCase().includes(searchTerm))
        .slice(0, 5);
      const filteredTasks = tasks
        .filter((t) => t.title.toLowerCase().includes(searchTerm))
        .slice(0, 5);
      const filteredWorkspaces = workspaces
        .filter((w) => w.name.toLowerCase().includes(searchTerm))
        .slice(0, 5);

      setResults({
        projects: filteredProjects,
        tasks: filteredTasks,
        workspaces: filteredWorkspaces,
      });
    } catch (err) {
      console.error('Error en búsqueda:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (type, id) => {
    setIsOpen(false);
    setQuery('');
    if (type === 'project') {
      navigate('/projects');
    } else if (type === 'task') {
      navigate('/tasks');
    } else if (type === 'workspace') {
      navigate('/workspaces');
    }
  };

  const totalResults = results.projects.length + results.tasks.length + results.workspaces.length;

  return (
    <div className="relative" ref={searchRef}>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full max-w-md"
      >
        <Search size={18} />
        <span className="text-sm">Buscar...</span>
        <kbd className="ml-auto hidden md:inline-flex items-center px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
          Ctrl+K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setIsOpen(false)}></div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Search size={20} className="text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar proyectos, tareas, workspaces..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Buscando...
              </div>
            ) : query.trim().length === 0 ? (
              <div className="p-8 text-center">
                <Search size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Escribe para buscar proyectos, tareas o workspaces
                </p>
              </div>
            ) : totalResults === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No se encontraron resultados para "{query}"
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.projects.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Proyectos ({results.projects.length})
                    </div>
                    {results.projects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => handleResultClick('project', project.id)}
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                      >
                        <FolderOpen size={18} className="text-purple-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {project.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.tasks.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Tareas ({results.tasks.length})
                    </div>
                    {results.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleResultClick('task', task.id)}
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                      >
                        <ListTodo size={18} className="text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.workspaces.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Workspaces ({results.workspaces.length})
                    </div>
                    {results.workspaces.map((workspace) => (
                      <div
                        key={workspace.id}
                        onClick={() => handleResultClick('workspace', workspace.id)}
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                      >
                        <FolderKanban size={18} className="text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {workspace.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

