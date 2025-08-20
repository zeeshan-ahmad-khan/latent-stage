import React, { useState, useEffect, useRef, type FormEvent } from "react";

interface Message {
  sender: string;
  message: string;
  timestamp: string;
}

const ChatClient: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [token, setToken] = useState("");
  const [room] = useState("main-stage");
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      if (socket.current) socket.current.close();
    };
  }, []);

  const handleConnect = () => {
    if (!token) {
      alert("Please provide a JWT token.");
      return;
    }
    if (socket.current) socket.current.close();
    const wsUrl = `ws://localhost:8080?room=${room}&token=${token}`;
    socket.current = new WebSocket(wsUrl);
    socket.current.onopen = () => {
      setIsConnected(true);
      setMessages([]);
    };
    socket.current.onmessage = (event) => {
      try {
        const receivedMessage: Message = JSON.parse(event.data);
        setMessages((prev) => [...prev, receivedMessage]);
      } catch (error) {
        console.error("Failed to parse message:", event.data);
      }
    };
    socket.current.onclose = (event) => {
      setIsConnected(false);
      if (event.reason) alert(`Connection closed: ${event.reason}`);
    };
    socket.current.onerror = () => {
      setIsConnected(false);
      alert("WebSocket error.");
    };
  };

  const handleDisconnect = () => {
    if (socket.current) socket.current.close();
  };
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket.current && isConnected) {
      socket.current.send(newMessage);
      setNewMessage("");
    }
  };
  return (
    <div>
      <h1>Chat Micro-Frontend</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste JWT Token Here"
          disabled={isConnected}
          style={{ width: "300px", padding: "8px" }}
        />
        <button onClick={handleConnect} disabled={isConnected}>
          Connect
        </button>
        <button onClick={handleDisconnect} disabled={!isConnected}>
          Disconnect
        </button>
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>
            {" "}
            <strong>{msg.sender}:</strong> {msg.message}{" "}
            <em style={{ fontSize: "0.8em", color: "gray" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </em>{" "}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={!isConnected}
          style={{ width: "300px", padding: "8px" }}
        />
        <button type="submit" disabled={!isConnected}>
          Send
        </button>
      </form>
    </div>
  );
};
export default ChatClient;
