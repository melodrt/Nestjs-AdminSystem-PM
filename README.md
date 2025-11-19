# 📋 Proyecto Full Stack - React + NestJS

Aplicación de gestión de tareas (To-Do) construida con React en el frontend y NestJS en el backend.

## 🚀 Características

- ✅ CRUD completo de tareas
- 🎨 Interfaz moderna y responsive
- 🔄 Comunicación en tiempo real entre frontend y backend
- 📱 Diseño adaptable para móviles
- ⚡ Backend rápido con NestJS
- ⚛️ Frontend con React y Vite

## 📁 Estructura del Proyecto

```
Nextjs-pm/
├── backend/          # API REST con NestJS
│   ├── src/
│   │   ├── tasks/    # Módulo de tareas
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
└── frontend/         # Aplicación React
    ├── src/
    │   ├── api/      # Servicios API
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **NestJS** - Framework Node.js progresivo
- **TypeScript** - Lenguaje de programación
- **CORS** - Configurado para permitir peticiones del frontend

### Frontend
- **React** - Biblioteca de JavaScript
- **Vite** - Herramienta de construcción
- **Axios** - Cliente HTTP
- **CSS3** - Estilos modernos

## 📦 Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn

### Pasos

1. **Clonar o navegar al proyecto**
   ```bash
   cd Nextjs-pm
   ```

2. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   ```

3. **Instalar dependencias del frontend**
   ```bash
   cd ../frontend
   npm install
   ```

## ▶️ Ejecución

### Backend

En una terminal, ejecuta:

```bash
cd backend
npm run start:dev
```

El backend estará disponible en: `http://localhost:3000`

### Frontend

En otra terminal, ejecuta:

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 📡 Endpoints de la API

### Tareas

- `GET /tasks` - Obtener todas las tareas
- `GET /tasks/:id` - Obtener una tarea por ID
- `POST /tasks` - Crear una nueva tarea
  ```json
  {
    "title": "Título de la tarea",
    "description": "Descripción opcional"
  }
  ```
- `PUT /tasks/:id` - Actualizar una tarea
  ```json
  {
    "title": "Nuevo título",
    "description": "Nueva descripción",
    "completed": true
  }
  ```
- `DELETE /tasks/:id` - Eliminar una tarea

## 🎯 Funcionalidades

- **Crear tareas**: Agrega nuevas tareas con título y descripción
- **Listar tareas**: Visualiza todas las tareas creadas
- **Editar tareas**: Modifica el contenido de las tareas existentes
- **Eliminar tareas**: Borra tareas que ya no necesites
- **Marcar como completada**: Cambia el estado de las tareas

## 🔧 Configuración

### CORS

El backend está configurado para aceptar peticiones desde `http://localhost:5173` (puerto por defecto de Vite). Si cambias el puerto del frontend, actualiza la configuración en `backend/src/main.ts`.

### Puerto del Backend

Por defecto, el backend corre en el puerto 3000. Puedes cambiarlo usando la variable de entorno `PORT`:

```bash
PORT=4000 npm run start:dev
```

## 📝 Notas

- Los datos se almacenan en memoria (se pierden al reiniciar el servidor)
- Para persistencia de datos, considera agregar una base de datos (PostgreSQL, MongoDB, etc.)
- El proyecto está listo para ser extendido con autenticación, validaciones avanzadas, y más funcionalidades

## 🤝 Contribuir

Las contribuciones son bienvenidas. Siéntete libre de abrir issues o pull requests.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

¡Disfruta construyendo! 🚀

