import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workspacesApi } from '../../api/workspacesApi';

// Async thunks
export const fetchWorkspaces = createAsyncThunk(
  'workspaces/fetchAll',
  async () => {
    const response = await workspacesApi.getAllWorkspaces();
    return response;
  }
);

export const createWorkspace = createAsyncThunk(
  'workspaces/create',
  async ({ name, description }) => {
    const response = await workspacesApi.createWorkspace(name, description);
    return response;
  }
);

export const updateWorkspace = createAsyncThunk(
  'workspaces/update',
  async ({ id, name, description }) => {
    const response = await workspacesApi.updateWorkspace(id, { name, description });
    return response;
  }
);

export const deleteWorkspace = createAsyncThunk(
  'workspaces/delete',
  async (id) => {
    await workspacesApi.deleteWorkspace(id);
    return id;
  }
);

const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        const index = state.items.findIndex((w) => w.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.items = state.items.filter((w) => w.id !== action.payload);
      });
  },
});

export default workspacesSlice.reducer;

