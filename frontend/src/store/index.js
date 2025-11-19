import { configureStore } from '@reduxjs/toolkit';
import workspacesReducer from './slices/workspacesSlice';
import projectsReducer from './slices/projectsSlice';
// import tasksReducer from './slices/tasksSlice';
// import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    workspaces: workspacesReducer,
    projects: projectsReducer,
    // tasks: tasksReducer,
    // auth: authReducer,
  },
});

// Tipos TypeScript (solo para referencia, no se usan en JS)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

