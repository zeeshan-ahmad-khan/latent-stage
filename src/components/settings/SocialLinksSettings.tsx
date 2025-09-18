import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { useAuthStore } from "../../stores/authStore";
import Spinner from "../Spinner";

const SocialLinksSettings: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [links, setLinks] = useState({
    youtube: user?.socialLinks?.youtube || "",
    instagram: user?.socialLinks?.instagram || "",
    facebook: user?.socialLinks?.facebook || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ socialLinks: links });
      console.log("Social links updated!");
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
    }
  };

  return (
    <Form.Root onSubmit={handleSubmit}>
      <h2 style={styles.sectionHeader}>Social Media Links</h2>
      <Form.Field name="youtube" style={styles.formField}>
        <Form.Label style={styles.formLabel}>YouTube</Form.Label>
        <Form.Control asChild>
          <input
            type="text"
            name="youtube"
            value={links.youtube}
            onChange={handleChange}
            style={styles.input}
            placeholder="https://youtube.com/your-channel"
          />
        </Form.Control>
      </Form.Field>
      <Form.Field name="instagram" style={styles.formField}>
        <Form.Label style={styles.formLabel}>Instagram</Form.Label>
        <Form.Control asChild>
          <input
            type="text"
            name="instagram"
            value={links.instagram}
            onChange={handleChange}
            style={styles.input}
            placeholder="https://instagram.com/your-profile"
          />
        </Form.Control>
      </Form.Field>
      <Form.Field name="facebook" style={styles.formField}>
        <Form.Label style={styles.formLabel}>Facebook</Form.Label>
        <Form.Control asChild>
          <input
            type="text"
            name="facebook"
            value={links.facebook}
            onChange={handleChange}
            style={styles.input}
            placeholder="https://facebook.com/your-page"
          />
        </Form.Control>
      </Form.Field>
      <Form.Submit asChild>
        <button style={styles.submitButton} disabled={isLoading}>
          {isLoading ? <Spinner /> : "Save Links"}
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

export default SocialLinksSettings;
