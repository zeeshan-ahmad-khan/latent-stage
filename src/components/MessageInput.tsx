import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { useChatStore } from "../stores/chatStore";
import { IoMdSend } from "react-icons/io"; // Import a send icon

interface MessageInputProps {
  roomName: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ roomName, disabled }) => {
  const { sendMessage, status } = useChatStore();
  const [message, setMessage] = useState("");
  const isConnected = status === "connected";
  const isDisabled = disabled || !isConnected;

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
            placeholder={
              isConnected ? "Type your message..." : "Connecting to chat..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isDisabled}
            style={styles.input}
          />
        </Form.Control>
      </Form.Field>
      <Form.Submit asChild>
        <button
          style={styles.button}
          disabled={!isConnected || !message.trim()}
        >
          <IoMdSend size={20} />
        </button>
      </Form.Submit>
    </Form.Root>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 15px",
    borderRadius: "22px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--surface)",
    color: "var(--text-primary)",
  },
  button: {
    padding: "10px",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "var(--accent)",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default MessageInput;
