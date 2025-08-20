import React from "react";
import * as Form from "@radix-ui/react-form";

const ConnectionBar: React.FC = () => (
  <Form.Root
    style={{
      marginBottom: "1rem",
      display: "flex",
      gap: "10px",
      alignItems: "center",
    }}
  >
    <Form.Field name="jwt" style={{ flexGrow: 1 }}>
      <Form.Control asChild>
        <input
          type="text"
          placeholder="Paste JWT Token Here"
          style={styles.input}
        />
      </Form.Control>
    </Form.Field>
    <button style={styles.button}>Connect</button>
  </Form.Root>
);

const styles: { [key: string]: React.CSSProperties } = {
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--surface)",
    color: "var(--text-primary)",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "var(--accent-green, #28a745)",
    color: "white",
    cursor: "pointer",
  },
};

export default ConnectionBar;
