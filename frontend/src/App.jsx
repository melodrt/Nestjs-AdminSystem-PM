import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Workspaces from './pages/Workspaces';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workspaces" element={<Workspaces />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Configuración</h1><p className="mt-4">Página de configuración (próximamente)</p></div>} />
      </Routes>
    </Layout>
  );
}

export default App;
