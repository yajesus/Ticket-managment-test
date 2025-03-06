import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setUser } from "../redux/authSlice";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../apiconfig";
const LoginForm = ({ isAdmin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.UserAdminLogin}`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUser(response.data.user));
      navigate(
        response.data.user.role === "admin"
          ? "/admin-dashboard"
          : "/user-dashboard"
      );
    } catch (error) {
      setError(
        error.response?.data?.message || "Login error. Please try again."
      );
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 px-3 flex items-center"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <button
        type="submit"
        className={`w-full bg-blue-500 text-white p-2 rounded flex justify-center`}
        disabled={loading}
      >
        {loading ? (
          <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : isAdmin ? (
          "Admin Login"
        ) : (
          "User Login"
        )}
      </button>
      {!isAdmin && (
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Sign up
          </Link>
        </p>
      )}
    </form>
  );
};

export default LoginForm;
