import ChatPanel from "./ChatPanel";

function App() {
  const token = "mock-token-for-development";
  const roomId = "main-stage"; // Example room name

  return <ChatPanel token={token} roomId={roomId} />;
}

export default App;
