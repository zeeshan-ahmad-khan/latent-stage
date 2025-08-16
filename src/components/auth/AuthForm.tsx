// src/components/auth/AuthForm.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useAuthStore } from "../../stores/authStore";
import type { LoginCredentials, RegisterData, UserRole } from "../../types";

// The main AuthForm component does not need to change.
const AuthForm: React.FC = () => {
  const [formType, setFormType] = useState<"login" | "register">("login");
  // ... (rest of the component is the same)
  const { isLoading, error } = useAuthStore();
  const formVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tabButton,
              ...(formType === "login" ? styles.activeTab : {}),
            }}
            onClick={() => setFormType("login")}
          >
            Sign In
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(formType === "register" ? styles.activeTab : {}),
            }}
            onClick={() => setFormType("register")}
          >
            Create Account
          </button>
        </div>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <AnimatePresence mode="wait">
          <motion.div
            key={formType}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {formType === "login" ? <LoginForm /> : <RegisterForm />}
          </motion.div>
        </AnimatePresence>

        {isLoading && <p style={{ textAlign: "center" }}>Loading...</p>}
      </div>
    </div>
  );
};

// The LoginForm component does not need to change.
const LoginForm: React.FC = () => {
  // ... (code for LoginForm is the same)
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    const credentials: LoginCredentials = {
      loginIdentifier: data.loginIdentifier as string,
      password: data.password as string,
    };

    login(credentials);
  };

  return (
    <Form.Root onSubmit={handleSubmit}>
      <Form.Field name="loginIdentifier" style={styles.formField}>
        <Form.Label style={styles.formLabel}>Email or Username</Form.Label>
        <Form.Control asChild>
          <input type="text" required style={styles.input} />
        </Form.Control>
      </Form.Field>
      <Form.Field name="password" style={styles.formField}>
        <Form.Label style={styles.formLabel}>Password</Form.Label>
        <Form.Control asChild>
          <input type="password" required style={styles.input} />
        </Form.Control>
      </Form.Field>
      <Form.Submit asChild>
        <button style={styles.submitButton}>Sign In</button>
      </Form.Submit>
    </Form.Root>
  );
};

// --- THIS IS THE CORRECTED COMPONENT ---
const RegisterForm: React.FC = () => {
  const register = useAuthStore((state) => state.register);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    const userData: RegisterData = {
      firstName: data.firstName as string,
      lastName: data.lastName as string,
      username: data.username as string,
      email: data.email as string,
      password: data.password as string,
      dob: data.dob as string,
      role: data.role as UserRole,
    };

    register(userData);
  };

  return (
    <Form.Root onSubmit={handleSubmit}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Form.Field name="firstName" style={{ ...styles.formField, flex: 1 }}>
          <Form.Label style={styles.formLabel}>First Name</Form.Label>
          <Form.Control asChild>
            <input type="text" required style={styles.input} />
          </Form.Control>
        </Form.Field>
        <Form.Field name="lastName" style={{ ...styles.formField, flex: 1 }}>
          <Form.Label style={styles.formLabel}>Last Name</Form.Label>
          <Form.Control asChild>
            <input type="text" required style={styles.input} />
          </Form.Control>
        </Form.Field>
      </div>
      <Form.Field name="username" style={styles.formField}>
        <Form.Label style={styles.formLabel}>Username</Form.Label>
        <Form.Control asChild>
          <input type="text" required style={styles.input} />
        </Form.Control>
      </Form.Field>
      <Form.Field name="email" style={styles.formField}>
        <Form.Label style={styles.formLabel}>Email</Form.Label>
        <Form.Control asChild>
          <input type="email" required style={styles.input} />
        </Form.Control>
      </Form.Field>
      <Form.Field name="password" style={styles.formField}>
        <Form.Label style={styles.formLabel}>Password</Form.Label>
        <Form.Control asChild>
          <input type="password" required style={styles.input} />
        </Form.Control>
      </Form.Field>
      <Form.Field name="dob" style={styles.formField}>
        <Form.Label style={styles.formLabel}>Date of Birth</Form.Label>
        <Form.Control asChild>
          <input type="date" required style={styles.input} />
        </Form.Control>
      </Form.Field>
      <Form.Field name="role" style={styles.formField}>
        <Form.Label style={styles.formLabel}>I want to...</Form.Label>
        <RadioGroup.Root
          name="role"
          defaultValue="Audience"
          style={styles.radioGroup}
        >
          <div style={styles.radioItem}>
            {/* The RadioGroup.Item is the clickable circle */}
            <RadioGroup.Item value="Audience" id="r1" style={styles.radioRoot}>
              {/* The Indicator is the dot that appears inside */}
              <RadioGroup.Indicator style={styles.radioIndicator} />
            </RadioGroup.Item>
            <label htmlFor="r1" style={styles.radioLabel}>
              Listen
            </label>
          </div>
          <div style={styles.radioItem}>
            <RadioGroup.Item value="Performer" id="r2" style={styles.radioRoot}>
              <RadioGroup.Indicator style={styles.radioIndicator} />
            </RadioGroup.Item>
            <label htmlFor="r2" style={styles.radioLabel}>
              Perform
            </label>
          </div>
        </RadioGroup.Root>
      </Form.Field>
      <Form.Submit asChild>
        <button style={styles.submitButton}>Create Account</button>
      </Form.Submit>
    </Form.Root>
  );
};

// --- THESE ARE THE CORRECTED STYLES ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "var(--background)",
  },
  formWrapper: { width: "80%", maxWidth: "380px" },
  tabs: {
    display: "flex",
    borderBottom: "1px solid var(--border-color)",
    marginBottom: "2.5rem",
  },
  tabButton: {
    flex: 1,
    padding: "1rem 0.5rem",
    border: "none",
    background: "transparent",
    color: "var(--text-secondary)",
    fontSize: "1rem",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    marginBottom: "-1px",
    transition: "color 0.2s, border-color 0.2s",
  },
  activeTab: {
    color: "var(--accent)",
    borderBottom: "2px solid var(--accent)",
    fontWeight: 500,
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
    width: "100%",
    padding: "0.8rem",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "var(--accent)",
    color: "white",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "1.5rem",
  },
  radioGroup: { display: "flex", gap: "2rem", marginTop: "0.75rem" },
  radioItem: { display: "flex", alignItems: "center", gap: "0.5rem" },
  // This is the outer circle, the clickable button
  radioRoot: {
    all: "unset",
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: "2px solid var(--border-color)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  // This is the inner dot that appears when selected
  radioIndicator: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: "var(--accent)",
  },
  radioLabel: {
    color: "var(--text-primary)",
    userSelect: "none",
    cursor: "pointer",
  },
};

export default AuthForm;
