import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleAuthProvider } from "../firebase/firebase";

export const startLogin = createAsyncThunk("auth/startLogin", async () => {
  await signInWithPopup(auth, googleAuthProvider);
});

export const startLogout = createAsyncThunk("auth/startLogout", async () => {
  await signOut(auth);
});

const authSlice = createSlice({
  name: "auth",
  initialState: {},
  reducers: {
    login: (_state, action) => ({ uid: action.payload }),
    logout: () => ({}),
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
