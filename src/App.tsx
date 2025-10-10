import AudioPanel from "./AudioPanel";

function App() {
  const token = "mock-token-for-development";
  const userRole = "Audience"; // 'Performer' or 'Audience'
  const roomName = "main-stage";
  const startTime = new Date().toISOString(); // Example start time
  const slotDuration = 20; // Example slot duration in minutes
  const performanceDuration = 15; // Example performance duration in minutes
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
  return (
    <AudioPanel
      token={token}
      userRole={userRole}
      performer={performer}
      roomName={roomName}
      startTime={startTime}
      slotDuration={slotDuration}
      performanceDuration={performanceDuration}
    />
  );
}

export default App;
