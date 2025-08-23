import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { useChatStore } from "../stores/chatStore";

interface MessageInputProps {
  roomName: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ roomName }) => {
  const { sendMessage, isConnected } = useChatStore();
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim()) {
      sendMessage(roomName, message);
      setMessage("");
    }
  };

  return (
    <Form.Root onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
      <Form.Field name="message" style={{ flexGrow: 1 }}>
        <Form.Control asChild>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!isConnected}
            style={styles.input}
          />
        </Form.Control>
      </Form.Field>
      <Form.Submit asChild>
        <button style={styles.button} disabled={!isConnected}>
          Send
        </button>
      </Form.Submit>
    </Form.Root>
  );
};

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
