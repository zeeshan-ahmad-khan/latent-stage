import React, {
  useEffect,
  useRef,
  createContext,
  useContext,
  useState,
} from "react";
import PerformerDisplay from "./components/PerformerDisplay";
import EmojiBar from "./components/EmojiBar";
import AudioTrack from "./components/AudioTrack";
import { useRoomStore } from "./stores/roomStore";
import type { UserRole, Performer } from "./types";
import { nanoid } from "nanoid";
import { motion, AnimatePresence, type MotionStyle } from "framer-motion";

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

export interface AudioPanelProps {
  token: string;
  userRole: UserRole;
  performer: Performer; // Add performer to the props
  roomName: string;
  startTime: string;
  slotDuration: number;
  performanceDuration: number;
}

export interface AudioPanelContextProps extends AudioPanelProps {
  triggerEmojiAnimation: (
    emoji: string,
    clientX: number,
    clientY: number
  ) => void;
}

const AudioPanelContext = createContext<AudioPanelContextProps | undefined>(
  undefined
);

export const useAudioPanelProps = () => {
  const context = useContext(AudioPanelContext);
  if (context === undefined) {
    throw new Error(
      "useAudioPanelProps must be used within an AudioPanelProvider"
    );
  }
  return context;
};

const AudioPanel: React.FC<AudioPanelProps> = (props) => {
  const {
    connect,
    disconnect,
    startAudio,
    participants,
    error,
    canPlayAudio,
    resumeAudio,
  } = useRoomStore();

  const { token, userRole, roomName } = props;
  const hasConnected = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null); // Ref for the main panel
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

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

  const triggerEmojiAnimation = (
    emoji: string,
    clientX: number,
    clientY: number
  ) => {
    if (!panelRef.current) return;

    const panelRect = panelRef.current.getBoundingClientRect();
    // Calculate starting position relative to the panel
    const x = clientX - panelRect.left;
    const y = clientY - panelRect.top;

    setFloatingEmojis((prev) => [...prev, { id: nanoid(), emoji, x, y }]);
  };

  const handleAnimationComplete = (id: string) => {
    setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AudioPanelContext.Provider value={{ ...props, triggerEmojiAnimation }}>
      <div
        ref={panelRef}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
        }}
      >
        <AnimatePresence>
          {floatingEmojis.map((item) => (
            <motion.span
              key={item.id}
              initial={{ x: item.x - 15, y: item.y, opacity: 1, scale: 0.5 }}
              animate={{ x: item.x - 15, y: 0, opacity: 0, scale: 2.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              onAnimationComplete={() => handleAnimationComplete(item.id)}
              style={styles.floatingEmoji as MotionStyle}
            >
              {item.emoji}
            </motion.span>
          ))}
        </AnimatePresence>
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
      </div>
    </AudioPanelContext.Provider>
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
  floatingEmoji: {
    position: "absolute",
    fontSize: "2rem",
    pointerEvents: "none",
    zIndex: 1000,
  },
};

export default AudioPanel;
