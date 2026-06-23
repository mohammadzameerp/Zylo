import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Register
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await API.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Registration failed';
    return thunkAPI.rejectWithValue(message);
  }
});

// Login
export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await API.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed';
    return thunkAPI.rejectWithValue(message);
  }
});

// Logout
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await API.post('/auth/logout');
  } catch (error) {
    // Continue with logout even if API fails
  }
  localStorage.removeItem('token');
});

// Get current user
export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    const response = await API.get('/auth/me');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch user';
    return thunkAPI.rejectWithValue(message);
  }
});

// Update profile
export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, thunkAPI) => {
  try {
    const response = await API.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to update profile';
    return thunkAPI.rejectWithValue(message);
  }
});

// Get user stats
export const getUserStats = createAsyncThunk('auth/getUserStats', async (_, thunkAPI) => {
  try {
    const response = await API.get('/users/stats');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to get stats';
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  stats: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.stats = null;
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || action.payload.data || action.payload;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.token = null;
        localStorage.removeItem('token');
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user || action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Stats
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats || action.payload;
      })
      // Listen for bookmark toggle to update user's bookmarks list in auth state
      .addCase('posts/bookmark/fulfilled', (state, action) => {
        const { data } = action.payload;
        const bookmarks = data?.data?.bookmarks || data?.bookmarks;
        if (state.user && bookmarks) {
          state.user.bookmarks = bookmarks;
        }
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
