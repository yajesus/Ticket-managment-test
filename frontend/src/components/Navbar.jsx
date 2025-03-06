import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/user-login");
  };

  return (
    <nav className="w-full bg-blue-500 p-4 text-white flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Ticketing System
      </Link>
      <div>
        {user ? (
          <>
            <span className="mr-4">Welcome, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/user-login" className="mr-4">
              Login
            </Link>
            <Link to="/signup" className="bg-green-500 px-4 py-2 rounded">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
