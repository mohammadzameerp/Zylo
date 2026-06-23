import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Get notifications
export const getNotifications = createAsyncThunk('notifications/getAll', async (_, thunkAPI) => {
  try {
    const response = await API.get('/notifications');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch notifications';
    return thunkAPI.rejectWithValue(message);
  }
});

// Mark single notification as read
export const markAsRead = createAsyncThunk('notifications/markRead', async (id, thunkAPI) => {
  try {
    const response = await API.put(`/notifications/${id}/read`);
    return { id, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to mark as read';
    return thunkAPI.rejectWithValue(message);
  }
});

// Mark all notifications as read
export const markAllAsRead = createAsyncThunk('notifications/markAllRead', async (_, thunkAPI) => {
  try {
    const response = await API.put('/notifications/read-all');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to mark all as read';
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isError: false,
  message: '',
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Notifications
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        const notifs = action.payload.notifications || action.payload.data || action.payload;
        state.notifications = Array.isArray(notifs) ? notifs : [];
        state.unreadCount = state.notifications.filter((n) => !n.read).length;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Mark As Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((n) =>
          n._id === action.payload.id ? { ...n, read: true } : n
        );
        state.unreadCount = state.notifications.filter((n) => !n.read).length;
      })
      // Mark All As Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
        state.unreadCount = 0;
      });
  },
});

export default notificationSlice.reducer;
