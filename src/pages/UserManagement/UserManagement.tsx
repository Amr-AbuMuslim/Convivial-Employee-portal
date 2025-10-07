import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  CreditCard as Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Link as LinkIcon,
} from "lucide-react";
import { Navbar } from "../../components/common/Navbar";
import { Button } from "../../components/UI/Button";
import { Input } from "../../components/UI/Input";
import { Modal } from "../../components/UI/Modal";
import { Spinner } from "../../components/UI/Spinner";
import { Toast } from "../../components/UI/Toast";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  fetchUsers,
  inviteUser,
  updateUser,
  deleteUser,
  setSearchQuery,
} from "../../store/userSlice";
import type { User } from "../../api/userApi";
import "./UserManagement.css";

// interface UserFormData {
//   name: string;
//   email: string;
//   role: "SUPER_ADMIN" | "USER";
//   department?: string;
//   team?: string;
// }

export const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, total, page, totalPages, isLoading, searchQuery } =
    useAppSelector((state) => state.user);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [invitationLink, setInvitationLink] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    department: "",
    teamName: "",
    role: "" as "USER" | "SUPER_ADMIN",
    isActivated: false,
  });

  useEffect(() => {
    dispatch(fetchUsers({ page, limit: 10, search: searchQuery }));
  }, [dispatch, page, searchQuery]);

  const handleSearch = () => {
    dispatch(setSearchQuery(searchTerm));
    dispatch(fetchUsers({ page: 1, limit: 10, search: searchTerm }));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(fetchUsers({ page: newPage, limit: 10, search: searchQuery }));
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await dispatch(inviteUser(inviteForm)).unwrap();

      if (result.token) {
        // Fixed invitation link
        const link = `http://localhost:5173/create-password?token=${result.token}`;
        setInvitationLink(link);
        setShowInviteModal(false);
        setShowInviteLinkModal(true);

        setToastMessage("Invitation link generated successfully!");
        setToastType("success");
        setShowToast(true);
      } else {
        setToastMessage("User invited successfully!");
        setToastType("success");
        setShowToast(true);
        setShowInviteModal(false);
      }

      // Reset form
      setInviteForm({
        name: "",
        email: "",
      });

      // Refresh user list
      dispatch(fetchUsers({ page: 1, limit: 10, search: searchQuery }));
    } catch (error: any) {
      console.error("Invite error:", error);
      setToastMessage(error?.message || error || "Failed to invite user");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      phone: user.phone || "",
      department: user.department || "",
      teamName: user.teamName || "",
      role: user.role || "USER",
      isActivated: user.isActivated || false,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        updateUser({ id: selectedUser.id, data: editForm })
      ).unwrap();
      setToastMessage("User updated successfully!");
      setToastType("success");
      setShowToast(true);
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Update error:", error);
      setToastMessage(error?.message || error || "Failed to update user");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await dispatch(deleteUser(selectedUser.id)).unwrap();
      setToastMessage("User deleted successfully!");
      setToastType("success");
      setShowToast(true);
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Delete error:", error);
      setToastMessage(error?.message || error || "Failed to delete user");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="user-management-page">
      <Navbar />
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="user-management-content">
        <motion.div
          className="user-management-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">
              Manage all users in your organization
            </p>
          </div>
          <Button onClick={() => setShowInviteModal(true)}>
            <Plus size={20} />
            Invite User
          </Button>
        </motion.div>

        <motion.div
          className="user-management-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="search-bar">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              icon={<Search size={20} />}
            />
            <Button onClick={handleSearch} variant="secondary">
              Search
            </Button>
          </div>
        </motion.div>

        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "60px 0",
            }}
          >
            <Spinner size="large" />
          </div>
        ) : (
          <>
            <motion.div
              className="users-table-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Team</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {users.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="user-name-cell">
                          <div className="user-avatar-small">
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                          {user.name}
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{user.department || "-"}</td>
                        <td>{user.teamName || "-"}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              user.isActivated
                                ? "status-active"
                                : "status-inactive"
                            }`}
                          >
                            {user.isActivated ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEditClick(user)}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteClick(user)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {users.length === 0 && !isLoading && (
                <div className="empty-state">
                  <p>No users found. Start by inviting a new user.</p>
                </div>
              )}
            </motion.div>

            {totalPages > 1 && (
              <div className="pagination">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft size={20} />
                  Previous
                </Button>
                <div className="pagination-info">
                  Page {page} of {totalPages} ({total} users)
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight size={20} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* INVITE USER MODAL - Simple form without role */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite New User"
        size="medium"
      >
        <form onSubmit={handleInviteSubmit} className="user-form">
          <Input
            label="Full Name"
            value={inviteForm.name}
            onChange={(e) =>
              setInviteForm({ ...inviteForm, name: e.target.value })
            }
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={inviteForm.email}
            onChange={(e) =>
              setInviteForm({ ...inviteForm, email: e.target.value })
            }
            required
          />

          <div className="modal-actions">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowInviteModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* INVITATION LINK MODAL */}
      <Modal
        isOpen={showInviteLinkModal}
        onClose={() => {
          setShowInviteLinkModal(false);
          setInvitationLink("");
          setCopiedLink(false);
        }}
        title="Invitation Link Generated"
        size="medium"
      >
        <div className="invitation-link-content">
          <div className="link-icon-wrapper">
            <LinkIcon size={48} />
          </div>
          <p className="invitation-message">
            Share this link with the invited user to set up their password:
          </p>
          <div className="invitation-link-box">
            <input
              type="text"
              value={invitationLink}
              readOnly
              className="invitation-link-input"
            />
            <button className="copy-link-btn" onClick={handleCopyLink}>
              {copiedLink ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
          <p className="invitation-note">
            This link contains a unique token for password creation.
          </p>
          <div className="modal-actions">
            <Button
              variant="primary"
              onClick={() => {
                setShowInviteLinkModal(false);
                setInvitationLink("");
                setCopiedLink(false);
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* EDIT USER MODAL - Admin can change role and activation */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
        size="medium"
      >
        <form onSubmit={handleEditSubmit} className="user-form">
          <Input
            label="Full Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            value={editForm.phone}
            onChange={(e) =>
              setEditForm({ ...editForm, phone: e.target.value })
            }
          />
          <Input
            label="Department"
            value={editForm.department}
            onChange={(e) =>
              setEditForm({ ...editForm, department: e.target.value })
            }
          />
          <Input
            label="Team"
            value={editForm.teamName}
            onChange={(e) =>
              setEditForm({ ...editForm, teamName: e.target.value })
            }
          />

          {/* Role Selection - Admin Feature */}
          <div className="form-group">
            <label
              htmlFor="role"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              Role
            </label>
            <select
              id="role"
              value={editForm.role}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  role: e.target.value as "USER" | "SUPER_ADMIN",
                })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <option value="USER">User</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          {/* Account Activation - Admin Feature */}
          <div className="form-group">
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={editForm.isActivated}
                onChange={(e) =>
                  setEditForm({ ...editForm, isActivated: e.target.checked })
                }
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span style={{ fontWeight: "500" }}>Account Activated</span>
            </label>
          </div>

          <div className="modal-actions">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE USER MODAL */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
        size="small"
      >
        <div className="delete-modal-content">
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedUser?.name}</strong>? This action cannot be undone.
          </p>
          <div className="modal-actions">
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete User"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
