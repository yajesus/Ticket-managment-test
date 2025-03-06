import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL, API_ENDPOINTS } from "./apiconfig";
import axios from "axios";
import { setUser } from "./redux/authSlice";
import UserLoginPage from "./pages/UserLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ element, role }) => {
  const userRole = useSelector((state) => state.auth.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated && userRole === role ? (
    element
  ) : (
    <Navigate to={role === "admin" ? "/admin-login" : "/user-login"} />
  );
};

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    } else {
      const fetchUser = async () => {
        try {
          console.log(isAuthenticated);
          const response = await axios.get(
            `${API_BASE_URL}${API_ENDPOINTS.UserMe}`,
            {
              withCredentials: true,
            }
          );
          dispatch(setUser(response.data));
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      };

      fetchUser();
    }
  }, [dispatch]);
  useEffect(() => {
    console.log("Redux State:", isAuthenticated, role, user);
  }, [isAuthenticated, role, user]);
  return (
    <Router>
      <Navbar />
      <div className="w-full container mx-auto p-4">
        <Routes>
          {isAuthenticated ? (
            role === "admin" ? (
              <Route path="/" element={<Navigate to="/admin-dashboard" />} />
            ) : (
              <Route path="/" element={<Navigate to="/user-dashboard" />} />
            )
          ) : (
            <Route path="/" element={<Navigate to="/user-login" />} />
          )}
          <Route path="/signup" element={<Signup />} />
          <Route path="/user-login" element={<UserLoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route
            path="/user-dashboard"
            element={<ProtectedRoute element={<UserDashboard />} role="user" />}
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute element={<AdminDashboard />} role="admin" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
