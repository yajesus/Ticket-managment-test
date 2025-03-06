import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../apiconfig";
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  role: localStorage.getItem("role") || null,
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (action.payload) {
        state.user = action.payload;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("role", action.payload.role);
        localStorage.setItem("isAuthenticated", "true");
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("isAuthenticated");
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export const logout = () => async (dispatch) => {
  try {
    await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.UserLogout}`,
      {},
      { withCredentials: true }
    );
    dispatch(logoutUser());
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
export default authSlice.reducer;
