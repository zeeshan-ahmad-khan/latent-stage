import AudioPanel from "./AudioPanel";

function App() {
  const token = "mock-token-for-development";
  const userRole = "Audience"; // 'Performer' or 'Audience'
  return <AudioPanel token={token} userRole={userRole} />;
}

export default App;
