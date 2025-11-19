import { configureStore } from '@reduxjs/toolkit';
import workspacesReducer from './slices/workspacesSlice';
import projectsReducer from './slices/projectsSlice';
import authReducer from './slices/authSlice';
// import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    workspaces: workspacesReducer,
    projects: projectsReducer,
    auth: authReducer,
    // tasks: tasksReducer,
  },
});

// Tipos TypeScript (solo para referencia, no se usan en JS)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

