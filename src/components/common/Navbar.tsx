import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Users, LayoutDashboard } from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout } from "../../store/authSlice";
import "./Navbar.css";

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="navbar-title">Employee Portal</h1>
        </div>

        <div className="navbar-links">
          <Link
            to="/dashboard"
            className={`navbar-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/profile"
            className={`navbar-link ${isActive("/profile") ? "active" : ""}`}
          >
            <User size={20} />
            <span>Profile</span>
          </Link>

          {user?.role === "SUPER_ADMIN" && (
            <Link
              to="/users"
              className={`navbar-link ${isActive("/users") ? "active" : ""}`}
            >
              <Users size={20} />
              <span>Users</span>
            </Link>
          )}
        </div>

        <div className="navbar-user">
          <div className="navbar-user-info">
            <span className="navbar-user-name">{user?.name}</span>
            <span className="navbar-user-role">{user?.role}</span>
          </div>
          <button className="navbar-logout" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};
