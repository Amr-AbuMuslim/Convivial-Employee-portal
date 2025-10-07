import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Users as UsersIcon,
  Camera,
  Calendar,
  MapPin,
  CreditCard,
  Shield,
  FileText,
  Upload,
  XCircle, // Import XCircle icon for "clear"
} from "lucide-react";
import { Navbar } from "../../components/common/Navbar";
import { Input } from "../../components/UI/Input";
import { Button } from "../../components/UI/Button";
import { Toast } from "../../components/UI/Toast";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { updateUserProfile } from "../../store/authSlice";
import { updateUser } from "../../store/userSlice";
import "./Profile.css"; // Ensure your CSS is still here

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
  "https://portal.convivial.site/api";

export const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.user);

  const profilePictureRef = useRef<HTMLInputElement>(null);
  const idPhotocopyRef = useRef<HTMLInputElement>(null);
  const educationalCertificateRef = useRef<HTMLInputElement>(null);
  const militaryServiceRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);

  // originalData will hold the state as it was when editing started or last saved
  const [originalData, setOriginalData] = useState({
    name: user?.name || "",
    americanName: user?.americanName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    department: user?.department || "",
    teamName: user?.teamName || "",
    dateOfBirth: user?.dateOfBirth || "",
    startDate: user?.startDate || "",
    instaPay: user?.instaPay || "",
    teamLeaderId: user?.teamLeaderId || "",
    status: user?.status || "",
  });

  // formData holds the current values in the input fields
  const [formData, setFormData] = useState({
    name: user?.name || "",
    americanName: user?.americanName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    department: user?.department || "",
    teamName: user?.teamName || "",
    dateOfBirth: user?.dateOfBirth || "",
    startDate: user?.startDate || "",
    instaPay: user?.instaPay || "",
    teamLeaderId: user?.teamLeaderId || "",
    status: user?.status || "",
  });

  const [files, setFiles] = useState<{
    profilePicture?: File;
    idPhotocopy?: File;
    educationalCertificate?: File;
    militaryService?: File;
  }>({});

  const [previewUrls, setPreviewUrls] = useState<{
    profilePicture?: string;
  }>({});

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Initialize formData and originalData when user data is available/changes
  useEffect(() => {
    if (user) {
      const initialData = {
        name: user.name || "",
        americanName: user.americanName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        department: user.department || "",
        teamName: user.teamName || "",
        dateOfBirth: user.dateOfBirth || "",
        startDate: user.startDate || "",
        instaPay: user.instaPay || "",
        teamLeaderId: user.teamLeaderId || "",
        status: user.status || "",
      };
      setFormData(initialData);
      setOriginalData(initialData); // Set original data on mount or user change
    }
  }, [user]);

  // Handle changes to form inputs (does NOT dispatch immediately)
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  // Handle file selection (previews profile pic, stores files)
  const handleFileChange = (field: string, file: File | null) => {
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [field]: file,
      }));

      if (field === "profilePicture") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls((prev) => ({
            ...prev,
            profilePicture: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      // If file is cleared
      setFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[field as keyof typeof newFiles];
        return newFiles;
      });
      // Also clear the actual file input element's value
      if (field === "profilePicture" && profilePictureRef.current) {
        profilePictureRef.current.value = "";
      } else if (field === "idPhotocopy" && idPhotocopyRef.current) {
        idPhotocopyRef.current.value = "";
      } else if (
        field === "educationalCertificate" &&
        educationalCertificateRef.current
      ) {
        educationalCertificateRef.current.value = "";
      } else if (field === "militaryService" && militaryServiceRef.current) {
        militaryServiceRef.current.value = "";
      }

      if (field === "profilePicture") {
        setPreviewUrls((prev) => {
          const newPreviewUrls = { ...prev };
          delete newPreviewUrls.profilePicture;
          return newPreviewUrls;
        });
      }
    }
  };

  // The main save handler for ALL changes (text and files)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setToastMessage("User not logged in.");
      setToastType("error");
      setShowToast(true);
      return;
    }

    const formDataToSend = new FormData();
    let hasChanges = false;
    let profilePictureChanged = false;

    // 1. Add changed text fields to formDataToSend
    Object.entries(formData).forEach(([key, value]) => {
      const originalValue = originalData[key as keyof typeof originalData];
      // Convert to string for consistent comparison and FormData append
      const stringValue = String(value || "");
      const stringOriginalValue = String(originalValue || "");

      if (stringValue !== stringOriginalValue) {
        formDataToSend.append(key, stringValue);
        hasChanges = true;
      }
    });

    // 2. Add selected files to formDataToSend
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formDataToSend.append(key, file);
        hasChanges = true;
        if (key === "profilePicture") {
          profilePictureChanged = true;
        }
      }
    });

    if (!hasChanges) {
      setToastMessage("No changes to save.");
      setToastType("error");
      setShowToast(true);
      return;
    }

    try {
      const result = await dispatch(
        updateUser({
          id: user.id,
          data: formDataToSend,
        })
      ).unwrap();

      dispatch(updateUserProfile(result)); // Update Redux store with the new user data

      // Update originalData to reflect the newly saved state
      setOriginalData(formData);
      setFiles({}); // Clear selected files after successful upload
      setPreviewUrls({}); // Clear preview URLs as well

      // Determine toast message
      if (profilePictureChanged) {
        setToastMessage(
          "Profile picture and other changes uploaded successfully!"
        );
      } else {
        setToastMessage("Profile updated successfully!");
      }
      setToastType("success");
      setShowToast(true);
      setIsEditing(false); // Exit editing mode after saving
    } catch (error: any) {
      console.error("Profile update error:", error);
      setToastMessage(error?.message || "Failed to update profile");
      setToastType("error");
      setShowToast(true);
    }
  };

  const handleCancel = () => {
    if (user) {
      // Revert formData to originalData (which holds the last saved state)
      setFormData(originalData);
      setFiles({}); // Clear any selected files
      setPreviewUrls({}); // Clear any file previews

      // Clear actual file input elements
      if (profilePictureRef.current) profilePictureRef.current.value = "";
      if (idPhotocopyRef.current) idPhotocopyRef.current.value = "";
      if (educationalCertificateRef.current)
        educationalCertificateRef.current.value = "";
      if (militaryServiceRef.current) militaryServiceRef.current.value = "";
    }
    setIsEditing(false); // Exit editing mode
  };

  const getImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    // console.log(`${API_BASE_URL}/${path}`);

    return `${API_BASE_URL}/${path}`;
  };

  const getDisplayImage = () => {
    // Show preview if a new file is selected
    if (previewUrls.profilePicture) {
      return previewUrls.profilePicture;
    }
    // Otherwise, show the user's current profile picture if available
    if (user?.profilePicture) {
      return getImageUrl(user.profilePicture);
    }
    return null;
  };

  // Helper to check if there are any pending changes (text fields or files)
  const hasPendingChanges = () => {
    // Check text field changes
    const textFieldsChanged = Object.entries(formData).some(([key, value]) => {
      const originalValue = originalData[key as keyof typeof originalData];
      return String(value || "") !== String(originalValue || "");
    });

    // Check file changes
    const fileFieldsChanged = Object.keys(files).length > 0;

    return textFieldsChanged || fileFieldsChanged;
  };

  return (
    <div className="profile-page">
      <Navbar />
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="profile-content">
        <motion.div
          className="profile-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {getDisplayImage() ? (
                  <img
                    src={getDisplayImage() || ""}
                    alt={user?.name || "Profile"}
                    className="profile-avatar-img"
                  />
                ) : (
                  <User size={48} />
                )}
              </div>
              <input
                type="file"
                ref={profilePictureRef}
                onChange={(e) =>
                  handleFileChange(
                    "profilePicture",
                    e.target.files?.[0] || null
                  )
                }
                accept="image/*"
                style={{ display: "none" }}
                disabled={!isEditing} // Disable file input if not editing
              />
              <button
                type="button"
                className="profile-avatar-upload"
                onClick={() => isEditing && profilePictureRef.current?.click()} // Only allow click if editing
                disabled={!isEditing}
              >
                <Camera size={20} />
              </button>
              {isEditing &&
                files.profilePicture && ( // Show clear button for profile picture
                  <button
                    type="button"
                    className="profile-avatar-clear"
                    onClick={() => handleFileChange("profilePicture", null)}
                    title="Clear profile picture"
                  >
                    <XCircle size={20} />
                  </button>
                )}
            </div>
            <div className="profile-header-info">
              <h1 className="profile-name">{user?.name}</h1>
              <p className="profile-role">{user?.role}</p>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2 className="form-section-title">Personal Information</h2>
              <div className="form-grid">
                <Input
                  label="Full Name (Arabic)"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={<User size={20} />}
                  disabled={!isEditing}
                />

                <Input
                  label="American Name"
                  name="americanName"
                  value={formData.americanName}
                  onChange={handleChange}
                  icon={<User size={20} />}
                  disabled={!isEditing}
                  placeholder="Enter American name"
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={<Mail size={20} />}
                  disabled={!isEditing}
                />

                <div className="input-wrapper">
                  <label className="input-label">Role</label>
                  <div className="input-container">
                    <div className="input-icon">
                      <Shield size={20} />
                    </div>
                    <input
                      type="text"
                      value={user?.role || ""}
                      disabled
                      className="input input-with-icon"
                      style={{
                        backgroundColor: "#f7fafc",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </div>

                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={<Phone size={20} />}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                />

                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  icon={<MapPin size={20} />}
                  disabled={!isEditing}
                  placeholder="Enter address"
                />

                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  icon={<Calendar size={20} />}
                  disabled={!isEditing}
                />

                <Input
                  label="InstaPay"
                  name="instaPay"
                  value={formData.instaPay}
                  onChange={handleChange}
                  icon={<CreditCard size={20} />}
                  disabled={!isEditing}
                  placeholder="Enter InstaPay"
                />
              </div>
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Work Information</h2>
              <div className="form-grid">
                <Input
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  icon={<Briefcase size={20} />}
                  disabled={!isEditing}
                  placeholder="e.g., Engineering"
                />

                <Input
                  label="Team Name"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  icon={<UsersIcon size={20} />}
                  disabled={!isEditing}
                  placeholder="e.g., Frontend"
                />

                <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  icon={<Calendar size={20} />}
                  disabled={!isEditing}
                />

                <Input
                  label="Team Leader ID"
                  name="teamLeaderId"
                  value={formData.teamLeaderId}
                  onChange={handleChange}
                  icon={<User size={20} />}
                  disabled={!isEditing}
                  placeholder="Enter team leader ID"
                />

                <Input
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  icon={<Shield size={20} />}
                  disabled={!isEditing}
                  placeholder="e.g., Active, Inactive"
                />

                <div className="input-wrapper">
                  <label className="input-label">Account Status</label>
                  <div className="input-container">
                    <div className="input-icon">
                      <Shield size={20} />
                    </div>
                    <input
                      type="text"
                      value={user?.isActivated ? "Activated" : "Not Activated"}
                      disabled
                      className="input input-with-icon"
                      style={{
                        backgroundColor: "#f7fafc",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {
              <div className="form-section">
                <h2 className="form-section-title">Documents</h2>
                <div className="file-upload-grid">
                  {/* ID Photocopy */}
                  <div className="file-upload-item">
                    <label className="file-upload-label">
                      <FileText size={24} />
                      <span>ID Photocopy</span>
                      {user?.idPhotocopy && !files.idPhotocopy && (
                        <a
                          href={getImageUrl(user.idPhotocopy) || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-link"
                        >
                          View Current
                        </a>
                      )}
                      {files.idPhotocopy && (
                        <span className="file-selected">
                          {files.idPhotocopy.name}
                        </span>
                      )}
                    </label>
                    <input
                      type="file"
                      ref={idPhotocopyRef}
                      onChange={(e) =>
                        handleFileChange(
                          "idPhotocopy",
                          e.target.files?.[0] || null
                        )
                      }
                      accept="image/*,application/pdf"
                      style={{ display: "none" }}
                      disabled={!isEditing} // Disable if not editing
                    />
                    <div className="file-actions">
                      {" "}
                      {/* New wrapper for buttons */}
                      <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        onClick={() =>
                          isEditing && idPhotocopyRef.current?.click()
                        }
                        disabled={!isEditing}
                      >
                        <Upload size={16} />
                        Upload
                      </Button>
                      {isEditing &&
                        files.idPhotocopy && ( // Show clear button if editing and file selected
                          <Button
                            type="button"
                            variant="danger" // You might want to define a danger variant in your Button component
                            size="small"
                            onClick={() =>
                              handleFileChange("idPhotocopy", null)
                            }
                          >
                            <XCircle size={16} />
                            Clear
                          </Button>
                        )}
                    </div>
                  </div>

                  {/* Educational Certificate */}
                  <div className="file-upload-item">
                    <label className="file-upload-label">
                      <FileText size={24} />
                      <span>Educational Certificate</span>
                      {user?.educationalCertificate &&
                        !files.educationalCertificate && (
                          <a
                            href={
                              getImageUrl(user.educationalCertificate) || "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-link"
                          >
                            View Current
                          </a>
                        )}
                      {files.educationalCertificate && (
                        <span className="file-selected">
                          {files.educationalCertificate.name}
                        </span>
                      )}
                    </label>
                    <input
                      type="file"
                      ref={educationalCertificateRef}
                      onChange={(e) =>
                        handleFileChange(
                          "educationalCertificate",
                          e.target.files?.[0] || null
                        )
                      }
                      accept="image/*,application/pdf"
                      style={{ display: "none" }}
                      disabled={!isEditing} // Disable if not editing
                    />
                    <div className="file-actions">
                      <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        onClick={() =>
                          isEditing &&
                          educationalCertificateRef.current?.click()
                        }
                        disabled={!isEditing}
                      >
                        <Upload size={16} />
                        Upload
                      </Button>
                      {isEditing && files.educationalCertificate && (
                        <Button
                          type="button"
                          variant="danger"
                          size="small"
                          onClick={() =>
                            handleFileChange("educationalCertificate", null)
                          }
                        >
                          <XCircle size={16} />
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Military Service */}
                  <div className="file-upload-item">
                    <label className="file-upload-label">
                      <FileText size={24} />
                      <span>Military Service</span>
                      {user?.militaryService && !files.militaryService && (
                        <a
                          href={getImageUrl(user.militaryService) || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-link"
                        >
                          View Current
                        </a>
                      )}
                      {files.militaryService && (
                        <span className="file-selected">
                          {files.militaryService.name}
                        </span>
                      )}
                    </label>
                    <input
                      type="file"
                      ref={militaryServiceRef}
                      onChange={(e) =>
                        handleFileChange(
                          "militaryService",
                          e.target.files?.[0] || null
                        )
                      }
                      accept="image/*,application/pdf"
                      style={{ display: "none" }}
                      disabled={!isEditing} // Disable if not editing
                    />
                    <div className="file-actions">
                      <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        onClick={() =>
                          isEditing && militaryServiceRef.current?.click()
                        }
                        disabled={!isEditing}
                      >
                        <Upload size={16} />
                        Upload
                      </Button>
                      {isEditing && files.militaryService && (
                        <Button
                          type="button"
                          variant="danger"
                          size="small"
                          onClick={() =>
                            handleFileChange("militaryService", null)
                          }
                        >
                          <XCircle size={16} />
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            }

            <div className="profile-actions">
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  variant="primary"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={!hasPendingChanges() || isLoading} // Disable if no changes or loading
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
