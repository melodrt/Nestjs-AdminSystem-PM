import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectsApi } from '../../api/projectsApi';

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (workspaceId = null) => {
    const response = await projectsApi.getAllProjects(workspaceId);
    return response;
  }
);

export const createProject = createAsyncThunk(
  'projects/create',
  async ({ workspaceId, name, description }) => {
    const response = await projectsApi.createProject(workspaceId, name, description);
    return response;
  }
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, name, description, status }) => {
    const response = await projectsApi.updateProject(id, { name, description, status });
    return response;
  }
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id) => {
    await projectsApi.deleteProject(id);
    return id;
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default projectsSlice.reducer;

