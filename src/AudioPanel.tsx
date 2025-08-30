import React, { useEffect, useRef } from "react";
import PerformerDisplay from "./components/PerformerDisplay";
import EmojiBar from "./components/EmojiBar";
import AudioTrack from "./components/AudioTrack";
import { useRoomStore } from "./stores/roomStore";
import type { UserRole } from "./types";

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
  const hasConnected = useRef(false);

  useEffect(() => {
    if (token && !hasConnected.current) {
      hasConnected.current = true;
      connect(roomName, token).then(() => {
        if (userRole === "Performer") {
          startAudio();
        }
      });
    }

    return () => {
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
      {participants.map((p) => (
        <AudioTrack key={p.sid} participant={p} />
      ))}

      <div
        onClick={!canPlayAudio ? resumeAudio : undefined}
        style={{
          position: "relative",
          cursor: !canPlayAudio ? "pointer" : "default",
          flex: 1,
          display: "flex",
        }}
      >
        <PerformerDisplay userRole={userRole} />

        {!canPlayAudio && (
          <div style={styles.playOverlay}>
            <span style={styles.playIcon}>▶</span>
            Click to Listen
          </div>
        )}
      </div>

      <EmojiBar />

      {/* The Controls component is no longer needed here */}
    </div>
  );
};

const styles = {
  playOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    zIndex: 10,
  },
  playIcon: {
    fontSize: "3rem",
    marginBottom: "0.5rem",
  },
};

export default AudioPanel;
