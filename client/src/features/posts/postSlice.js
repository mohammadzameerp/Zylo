import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Get all posts
export const getPosts = createAsyncThunk('posts/getAll', async (params = {}, thunkAPI) => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.sort) query.append('sort', params.sort);
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.tag) query.append('tag', params.tag);
    if (params.author) query.append('author', params.author);
    const response = await API.get(`/posts?${query.toString()}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch posts';
    return thunkAPI.rejectWithValue(message);
  }
});

// Get single post
export const getPost = createAsyncThunk('posts/getOne', async (id, thunkAPI) => {
  try {
    const response = await API.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch post';
    return thunkAPI.rejectWithValue(message);
  }
});

// Create post
export const createPost = createAsyncThunk('posts/create', async (formData, thunkAPI) => {
  try {
    const config = {};
    if (formData instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    const response = await API.post('/posts', formData, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to create post';
    return thunkAPI.rejectWithValue(message);
  }
});

// Update post
export const updatePost = createAsyncThunk('posts/update', async ({ id, data }, thunkAPI) => {
  try {
    const config = {};
    if (data instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    const response = await API.put(`/posts/${id}`, data, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to update post';
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete post
export const deletePost = createAsyncThunk('posts/delete', async (id, thunkAPI) => {
  try {
    await API.delete(`/posts/${id}`);
    return id;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to delete post';
    return thunkAPI.rejectWithValue(message);
  }
});

// Like post
export const likePost = createAsyncThunk('posts/like', async (id, thunkAPI) => {
  try {
    const response = await API.put(`/posts/${id}/like`);
    return { id, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to like post';
    return thunkAPI.rejectWithValue(message);
  }
});

// Bookmark post
export const bookmarkPost = createAsyncThunk('posts/bookmark', async (id, thunkAPI) => {
  try {
    const response = await API.put(`/posts/${id}/bookmark`);
    return { id, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to bookmark post';
    return thunkAPI.rejectWithValue(message);
  }
});

// Report post
export const reportPost = createAsyncThunk('posts/report', async (id, thunkAPI) => {
  try {
    const response = await API.put(`/posts/${id}/report`);
    return { id, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to report post';
    return thunkAPI.rejectWithValue(message);
  }
});

// Get bookmarked posts
export const getBookmarks = createAsyncThunk('posts/bookmarks', async (_, thunkAPI) => {
  try {
    const response = await API.get('/users/bookmarks');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to get bookmarks';
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  posts: [],
  post: null,
  bookmarks: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearPost: (state) => {
      state.post = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Posts
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts || action.payload.data || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        } else {
          state.pagination = {
            page: action.payload.page || 1,
            pages: action.payload.pages || action.payload.totalPages || 1,
            total: action.payload.total || action.payload.totalPosts || 0,
          };
        }
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Single Post
      .addCase(getPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.post = action.payload.post || action.payload.data || action.payload;
      })
      .addCase(getPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const newPost = action.payload.post || action.payload.data || action.payload;
        state.posts.unshift(newPost);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updated = action.payload.post || action.payload.data || action.payload;
        state.post = updated;
        state.posts = state.posts.map((p) => (p._id === updated._id ? updated : p));
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const likes = data?.data?.likes || data?.likes;
        const likesCount = data?.data?.likesCount !== undefined ? data.data.likesCount : data?.likesCount;
        state.posts = state.posts.map((p) =>
          p._id === id
            ? {
                ...p,
                likes: likes !== undefined ? likes : p.likes,
                likesCount: likesCount !== undefined ? likesCount : p.likesCount,
                likeCount: likesCount !== undefined ? likesCount : p.likeCount,
              }
            : p
        );
        if (state.post && state.post._id === id) {
          state.post = {
            ...state.post,
            likes: likes !== undefined ? likes : state.post.likes,
            likesCount: likesCount !== undefined ? likesCount : state.post.likesCount,
            likeCount: likesCount !== undefined ? likesCount : state.post.likeCount,
          };
        }
      })
      // Bookmark Post
      .addCase(bookmarkPost.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const bookmarks = data?.data?.bookmarks || data?.bookmarks;
        state.posts = state.posts.map((p) =>
          p._id === id ? { ...p, bookmarks: bookmarks || p.bookmarks } : p
        );
        if (state.post && state.post._id === id) {
          state.post = { ...state.post, bookmarks: bookmarks || state.post.bookmarks };
        }
        if (bookmarks) {
          state.bookmarks = state.bookmarks.filter((p) => bookmarks.includes(p._id));
        }
      })
      // Report Post
      .addCase(reportPost.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        const reportCount = data?.data?.reportCount !== undefined ? data.data.reportCount : data?.reportCount;
        const isReported = data?.data?.isReported !== undefined ? data.data.isReported : data?.isReported;
        state.posts = state.posts.map((p) =>
          p._id === id ? { ...p, reportCount, isReported } : p
        );
        if (state.post && state.post._id === id) {
          state.post = { ...state.post, reportCount, isReported };
        }
      })
      // Get Bookmarks
      .addCase(getBookmarks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBookmarks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookmarks = action.payload.posts || action.payload.bookmarks || action.payload.data || action.payload;
      })
      .addCase(getBookmarks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearPost } = postSlice.actions;
export default postSlice.reducer;
