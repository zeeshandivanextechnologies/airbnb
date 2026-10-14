import { createSlice } from '@reduxjs/toolkit';

const initialUser = (() => {
  try {
    const saved = localStorage.getItem('airbnb_user_auth');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
})();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser?.user || null,
    token: initialUser?.token || null,
    isAuthenticated: !!initialUser?.token,
    authStep: 0,
    identifier: '',
    otpCode: '',
    isModalOpen: false,
  },
  reducers: {
    openAuthModal: (state) => {
      state.isModalOpen = true;
      state.authStep = 0;
    },
    closeAuthModal: (state) => {
      state.isModalOpen = false;
      state.authStep = 0;
      state.identifier = '';
      state.otpCode = '';
    },
    setAuthStep: (state, action) => {
      state.authStep = action.payload;
    },
    setIdentifier: (state, action) => {
      state.identifier = action.payload;
    },
    setOtpCode: (state, action) => {
      state.otpCode = action.payload;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isModalOpen = false;
      state.authStep = 0;
      localStorage.setItem('airbnb_user_auth', JSON.stringify({
        token: action.payload.token,
        user: action.payload.user
      }));
    },
    updateAvatar: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload;
        const saved = localStorage.getItem('airbnb_user_auth');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            parsed.user.avatar = action.payload;
            localStorage.setItem('airbnb_user_auth', JSON.stringify(parsed));
          } catch (e) {}
        }
      }
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        const saved = localStorage.getItem('airbnb_user_auth');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            parsed.user = { ...parsed.user, ...action.payload };
            localStorage.setItem('airbnb_user_auth', JSON.stringify(parsed));
          } catch (e) {}
        }
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isModalOpen = false;
      state.authStep = 0;
      localStorage.removeItem('airbnb_user_auth');
    }
  }
});

export const {
  openAuthModal,
  closeAuthModal,
  setAuthStep,
  setIdentifier,
  setOtpCode,
  loginSuccess,
  updateAvatar,
  updateUser,
  logoutUser
} = authSlice.actions;

export default authSlice.reducer;
