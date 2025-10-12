import ChatPanel from "./ChatPanel";

function App() {
  const token = "mock-token-for-development";
  const roomId = "main-stage"; // Example room name
  const disabled = false; // Example disabled state
  return <ChatPanel token={token} roomId={roomId} disabled={disabled} />;
}

export default App;
