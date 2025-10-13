import AudioPanel from "./AudioPanel";

function App() {
  const token = "mock-token-for-development";
  const userRole = "Audience"; // 'Performer' or 'Audience'
  const roomName = "main-stage";
  const performer = {
    _id: "mock-id",
    username: "mock-username",
    // Add the other performer fields we need
    profilePictureUrl: "mock-url",
    bio: "mock-bio",
    socialLinks: {
      youtube: "mock-youtube",
      instagram: "mock-instagram",
      facebook: "mock-facebook",
    },
  };
  const performanceState = "live"; // Example performance state
  const timeLeft = 900; // Example time left in seconds
  const isTimerRunning = true; // Example timer state
  return (
    <AudioPanel
      token={token}
      userRole={userRole}
      performer={performer}
      roomName={roomName}
      performanceState={performanceState}
      timeLeft={timeLeft}
      isTimerRunning={isTimerRunning}
    />
  );
}

export default App;
