import { configureStore } from '@reduxjs/toolkit';
import workspacesReducer from './slices/workspacesSlice';
// import tasksReducer from './slices/tasksSlice';
// import projectsReducer from './slices/projectsSlice';
// import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    workspaces: workspacesReducer,
    // tasks: tasksReducer,
    // projects: projectsReducer,
    // auth: authReducer,
  },
});

// Tipos TypeScript (solo para referencia, no se usan en JS)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

