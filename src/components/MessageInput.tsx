import React from "react";
import * as Form from "@radix-ui/react-form";

const MessageInput: React.FC = () => (
  <Form.Root style={{ display: "flex", gap: "10px" }}>
    <Form.Field name="message" style={{ flexGrow: 1 }}>
      <Form.Control asChild>
        <input
          type="text"
          placeholder="Type your message..."
          style={styles.input}
        />
      </Form.Control>
    </Form.Field>
    <Form.Submit asChild>
      <button style={styles.button}>Send</button>
    </Form.Submit>
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
    backgroundColor: "var(--accent)",
    color: "white",
    cursor: "pointer",
  },
};

export default MessageInput;
