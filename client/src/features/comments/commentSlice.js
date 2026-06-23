import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Get comments for a post
export const getComments = createAsyncThunk('comments/getAll', async (postId, thunkAPI) => {
  try {
    const response = await API.get(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch comments';
    return thunkAPI.rejectWithValue(message);
  }
});

// Create comment
export const createComment = createAsyncThunk('comments/create', async ({ postId, content }, thunkAPI) => {
  try {
    const response = await API.post(`/posts/${postId}/comments`, { content });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to create comment';
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete comment
export const deleteComment = createAsyncThunk('comments/delete', async (id, thunkAPI) => {
  try {
    await API.delete(`/comments/${id}`);
    return id;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to delete comment';
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  comments: [],
  isLoading: false,
  isError: false,
  message: '',
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Comments
      .addCase(getComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload.comments || action.payload.data || action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Comment
      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        const newComment = action.payload.comment || action.payload.data || action.payload;
        state.comments.unshift(newComment);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
