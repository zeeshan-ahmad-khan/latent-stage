import React, { useEffect, useRef } from "react";
import PerformerDisplay from "./components/PerformerDisplay";
import EmojiBar from "./components/EmojiBar";
import AudioTrack from "./components/AudioTrack";
import { useRoomStore } from "./stores/roomStore";
import type { UserRole } from "./types"; // Assuming you have a types file

export interface AudioPanelProps {
  token: string;
  userRole: UserRole;
}

const AudioPanel: React.FC<AudioPanelProps> = ({ token, userRole }) => {
  const {
    connect,
    disconnect,
    startAudio,
    participants,
    error,
    canPlayAudio,
    resumeAudio,
  } = useRoomStore();
  const roomName = "main-stage";

  // --- FIX FOR DOUBLE MOUNT ---
  // We use a ref to track if the connection effect has already run.
  const hasConnected = useRef(false);

  useEffect(() => {
    // Only run the connection logic once.
    if (token && !hasConnected.current) {
      hasConnected.current = true; // Mark as run
      connect(roomName, token).then(() => {
        if (userRole === "Performer") {
          startAudio();
        }
      });
    }

    // This cleanup function will run only on the final unmount.
    return () => {
      // On cleanup, we should only disconnect if we successfully connected.
      if (hasConnected.current) {
        disconnect();
      }
    };
  }, [token, userRole, roomName, connect, disconnect, startAudio]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* --- FIX FOR UNIQUE KEY --- */}
      {/* We use the participant's unique 'sid' as the key */}
      {participants.map((p) => (
        <AudioTrack key={p.sid} participant={p} />
      ))}

      <PerformerDisplay />

      {!canPlayAudio && (
        <button onClick={resumeAudio} style={styles.resumeButton}>
          Click to Play Audio
        </button>
      )}

      <EmojiBar />
    </div>
  );
};

const styles = {
  resumeButton: {
    marginTop: "1rem",
    padding: "1rem",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "var(--accent)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default AudioPanel;
