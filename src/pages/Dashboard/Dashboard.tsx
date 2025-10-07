import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Calendar,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/common/Navbar";
import { useAppSelector } from "../../hooks/useAppSelector";
import "./Dashboard.css";

export const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const stats = [
    {
      icon: <Users size={32} />,
      label: "Total Employees",
      value: "248",
      change: "+12%",
      color: "#2563eb",
    },
    {
      icon: <UserCheck size={32} />,
      label: "Active Users",
      value: "232",
      change: "+8%",
      color: "#10b981",
    },
    {
      icon: <Calendar size={32} />,
      label: "This Month",
      value: "18",
      change: "+3%",
      color: "#f59e0b",
    },
    {
      icon: <TrendingUp size={32} />,
      label: "Growth Rate",
      value: "23%",
      change: "+5%",
      color: "#8b5cf6",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-hero">
        <div className="hero-background">
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80"
            alt="Team collaboration"
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>

        <svg
          className="hero-svg hero-svg-1"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="rgba(255, 255, 255, 0.1)"
            d="M47.1,-57.7C59.9,-49.1,68.4,-33.3,71.5,-16.2C74.6,0.9,72.2,19.3,63.6,34.1C55,48.9,40.2,60.1,23.8,65.4C7.4,70.7,-10.6,70.1,-26.3,64.2C-42,58.3,-55.4,47.1,-63.5,32.7C-71.6,18.3,-74.4,0.7,-71.1,-15.5C-67.8,-31.7,-58.4,-46.5,-45.6,-55.1C-32.8,-63.7,-16.4,-65.9,0.5,-66.5C17.4,-67.1,34.3,-66.3,47.1,-57.7Z"
            transform="translate(100 100)"
          />
        </svg>

        <svg
          className="hero-svg hero-svg-2"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="rgba(255, 255, 255, 0.08)"
            d="M41.3,-54.4C54.4,-45.1,66.4,-33.5,71.8,-19.1C77.2,-4.7,76,12.5,69.5,27.3C63,42.1,51.2,54.5,37,61.2C22.8,67.9,6.2,68.9,-10.8,67.2C-27.8,65.5,-45.2,61.1,-57.5,50.4C-69.8,39.7,-77,22.7,-77.7,5.3C-78.4,-12.1,-72.6,-29.9,-61.8,-42.7C-51,-55.5,-35.2,-63.3,-19.8,-70.1C-4.4,-76.9,10.6,-82.7,23.7,-79.9C36.8,-77.1,28.2,-65.7,41.3,-54.4Z"
            transform="translate(100 100)"
          />
        </svg>

        <svg
          className="hero-svg hero-svg-3"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="rgba(255, 255, 255, 0.06)"
            d="M39.5,-52.6C51.4,-43.2,61.3,-31.1,66.1,-17.1C70.9,-3.1,70.6,12.8,64.8,26.3C59,39.8,47.7,50.9,34.8,58.4C21.9,65.9,7.4,69.8,-7.8,70.1C-23,70.4,-39.7,67.1,-52.2,57.8C-64.7,48.5,-73,33.2,-75.4,17C-77.8,0.8,-74.3,-16.3,-66.2,-30.7C-58.1,-45.1,-45.4,-56.8,-31.5,-65.3C-17.6,-73.8,-2.5,-79.1,10.7,-77.8C23.9,-76.5,27.6,-62,39.5,-52.6Z"
            transform="translate(100 100)"
          />
        </svg>

        <div className="dashboard-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="dashboard-hero-title">
              Welcome back, {user?.name}!
            </h1>
            <p className="dashboard-hero-subtitle">
              Empowering teams, driving success. Here's your organization at a
              glance.
            </p>

            <div className="hero-actions">
              {user?.role === "SUPER_ADMIN" ? (
                <>
                  <Link to="/users" className="hero-btn hero-btn-primary">
                    Manage Users
                    <ArrowRight size={20} />
                  </Link>
                  <Link to="/profile" className="hero-btn hero-btn-secondary">
                    View Profile
                  </Link>
                </>
              ) : (
                <Link to="/profile" className="hero-btn hero-btn-primary">
                  View Profile
                  <ArrowRight size={20} />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="dashboard-content">
        <motion.div
          className="dashboard-stats"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value}</h3>
                <span className="stat-change">
                  {stat.change} from last month
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="dashboard-sections"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="dashboard-section">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="activity-text">New user registered: John Doe</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="activity-text">Profile updated: Jane Smith</p>
                  <span className="activity-time">5 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="activity-text">
                    New team member added to Engineering
                  </p>
                  <span className="activity-time">1 day ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="activity-text">
                    Department update: Marketing restructured
                  </p>
                  <span className="activity-time">2 days ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions">
              {user?.role === "SUPER_ADMIN" && (
                <>
                  <Link to="/users" className="quick-action-card">
                    <div className="quick-action-icon">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3>Invite User</h3>
                      <p>Add new team members to your organization</p>
                    </div>
                  </Link>
                  <Link to="/users" className="quick-action-card">
                    <div className="quick-action-icon">
                      <UserCheck size={24} />
                    </div>
                    <div>
                      <h3>Manage Users</h3>
                      <p>View and manage all users in your system</p>
                    </div>
                  </Link>
                </>
              )}
              <Link to="/profile" className="quick-action-card">
                <div className="quick-action-icon">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3>Update Profile</h3>
                  <p>Keep your information up to date</p>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
