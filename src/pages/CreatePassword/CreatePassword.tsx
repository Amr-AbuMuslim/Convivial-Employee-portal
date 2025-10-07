import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, CheckCircle } from "lucide-react";
import { authApi } from "../../api/authApi";
import { Button } from "../../components/UI/Button";
import { Input } from "../../components/UI/Input";
import { Toast } from "../../components/UI/Toast";
import "./CreatePassword.css";

export const CreatePassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setToastType("error");
      setShowToast(true);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setToastType("error");
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    try {
      await authApi.createPassword({ token, password });
      setSuccess(true);
      setToastType("success");
      setShowToast(true);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      sessionStorage.clear();

      setTimeout(() => {
        if (localStorage.getItem("authToken")) {
          navigate("/login");
        }
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create password");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="create-password-page">
        <div className="create-password-container">
          <motion.div
            className="success-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <h1 className="success-title">Password Created!</h1>
            <p className="success-text">
              Your password has been set successfully. Redirecting to login...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-password-page">
      <Toast
        message={error || "Password created successfully!"}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <div className="create-password-container">
        <motion.div
          className="create-password-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="create-password-header">
            <h1 className="create-password-title">Create Your Password</h1>
            <p className="create-password-subtitle">
              Set a strong password for your account
            </p>
          </div>

          <form className="create-password-form" onSubmit={handleSubmit}>
            <Input
              type="password"
              label="New Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={20} />}
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock size={20} />}
              required
            />

            <div className="password-requirements">
              <p className="requirements-title">Password Requirements:</p>
              <ul className="requirements-list">
                <li className={password.length >= 8 ? "requirement-met" : ""}>
                  At least 8 characters
                </li>
                <li
                  className={
                    password === confirmPassword && password.length > 0
                      ? "requirement-met"
                      : ""
                  }
                >
                  Passwords match
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="create-password-button"
            >
              Create Password
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
