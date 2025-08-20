import React from "react";

const MessageList: React.FC = () => (
  <div style={styles.container}>
    <div>
      <strong style={{ color: "var(--accent)" }}>JaneSings:</strong> Hello
      everyone!
    </div>
    <div>
      <strong style={{ color: "var(--accent)" }}>JohnListens:</strong> This is
      great!
    </div>
  </div>
);

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    border: "1px solid var(--border-color)",
    height: "100%",
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    textAlign: "left",
    backgroundColor: "var(--surface)",
  },
};

export default MessageList;
