import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { useAuthStore } from "../../stores/authStore";
import Spinner from "../Spinner";

const ProfileSettings: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    profilePictureUrl: user?.profilePictureUrl || "",
    bio: user?.bio || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      console.log("Profile updated successfully!");
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
    }
  };

  return (
    <Form.Root onSubmit={handleSubmit}>
      <h2 style={styles.sectionHeader}>Profile Information</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Form.Field name="firstName" style={{ ...styles.formField, flex: 1 }}>
          <Form.Label style={styles.formLabel}>First Name</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              style={styles.input}
            />
          </Form.Control>
        </Form.Field>
        <Form.Field name="lastName" style={{ ...styles.formField, flex: 1 }}>
          <Form.Label style={styles.formLabel}>Last Name</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={styles.input}
            />
          </Form.Control>
        </Form.Field>
      </div>
      <Form.Field name="profilePictureUrl" style={styles.formField}>
        <Form.Label style={styles.formLabel}>Profile Picture URL</Form.Label>
        <Form.Control asChild>
          <input
            type="text"
            name="profilePictureUrl"
            value={formData.profilePictureUrl}
            onChange={handleChange}
            style={styles.input}
          />
        </Form.Control>
      </Form.Field>
      {user?.role === "Performer" && (
        <Form.Field name="bio" style={styles.formField}>
          <Form.Label style={styles.formLabel}>Bio</Form.Label>
          <Form.Control asChild>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              style={{ ...styles.input, height: "100px" }}
            />
          </Form.Control>
        </Form.Field>
      )}
      <Form.Submit asChild>
        <button style={styles.submitButton} disabled={isLoading}>
          {isLoading ? <Spinner /> : "Save Changes"}
        </button>
      </Form.Submit>
    </Form.Root>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sectionHeader: {
    marginTop: "2rem",
    marginBottom: "1rem",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "0.5rem",
  },
  formField: { marginBottom: "1.25rem" },
  formLabel: {
    display: "block",
    textAlign: "left",
    fontSize: "0.875rem",
    color: "var(--text-secondary)",
    marginBottom: "0.5rem",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--surface)",
    color: "var(--text-primary)",
    fontSize: "1rem",
  },
  submitButton: {
    padding: "0.8rem 1.5rem",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "var(--accent)",
    color: "white",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "44px",
  },
};

export default ProfileSettings;
