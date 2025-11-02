import React, {
  useEffect,
  useRef,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import PerformerDisplay from "./components/PerformerDisplay";
import EmojiBar from "./components/EmojiBar";
import AudioTrack from "./components/AudioTrack";
import { useRoomStore } from "./stores/roomStore";
import type { UserRole, Performer } from "./types";
import { nanoid } from "nanoid";
import { AnimatePresence, motion, type MotionStyle } from "framer-motion";

// The PerformanceState type will be passed down from the host
export type PerformanceState = "live" | "ended" | "grace";

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
  y: number;
  senderUsername?: string;
}

export interface AudioPanelProps {
  token: string;
  userRole: UserRole;
  performer: Performer;
  roomName: string;
  performanceState: PerformanceState;
  timeLeft: number;
  isTimerRunning: boolean;
}

export interface AudioPanelContextProps extends AudioPanelProps {
  triggerEmojiAnimation: (
    emoji: string,
    startX: number,
    startY: number
  ) => void;
  sendEmojiReaction: (emoji: string, x: number, y: number) => void;
}

export const AudioPanelContext = createContext<
  AudioPanelContextProps | undefined
>(undefined);

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
    canPlayAudio,
    resumeAudio,
    sendEmojiReaction,
  } = useRoomStore();
  const { token, userRole, roomName, performanceState } = props;
  const hasConnected = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  const triggerAnimation = useCallback(
    (
      emoji: string,
      clientX: number,
      clientY: number,
      senderUsername?: string
    ) => {
      if (!panelRef.current) return;
      const panelRect = panelRef.current.getBoundingClientRect();
      const x = clientX - panelRect.left;
      const y = clientY - panelRect.top;
      setFloatingEmojis((prev) => [
        ...prev,
        { id: nanoid(), emoji, x, y, senderUsername },
      ]);
    },
    []
  );

  useEffect(() => {
    if (token && roomName && !hasConnected.current) {
      hasConnected.current = true;
      connect(roomName, token, (emoji, sender, x, y) =>
        triggerAnimation(emoji, x, y, sender)
      ).then(() => {
        if (userRole === "Performer") {
          startAudio();
        }
      });
    }
  }, [token, userRole, roomName, connect, startAudio, triggerAnimation]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      disconnect();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // This is the cleanup function that will be called when the component unmounts.
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      disconnect(); // Also call disconnect here as a fallback.
    };
  }, [disconnect]);

  // Disconnect from the room when the performance is over
  useEffect(() => {
    if (performanceState === "ended" || performanceState === "grace") {
      disconnect();
    }
  }, [performanceState, disconnect]);

  const handleAnimationComplete = (id: string) => {
    setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <AudioPanelContext.Provider
      value={{
        ...props,
        triggerEmojiAnimation: triggerAnimation,
        sendEmojiReaction,
      }}
    >
      <div ref={panelRef} style={styles.panelContainer}>
        <AnimatePresence>
          {floatingEmojis.map((item) => (
            <motion.span
              key={item.id}
              initial={{ x: item.x - 15, y: item.y - 15, opacity: 1, scale: 1 }}
              animate={{ x: item.x - 15, y: 0, opacity: 0, scale: 2.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              onAnimationComplete={() => handleAnimationComplete(item.id)}
              style={styles.floatingEmojiWrapper}
            >
              <span style={styles.floatingEmojiItself}>{item.emoji}</span>
              {/* ✅ ADDITION: Conditionally render username */}
              {item.senderUsername && (
                <span style={styles.senderUsername}>{item.senderUsername}</span>
              )}
            </motion.span>
          ))}
        </AnimatePresence>
        {participants.map((p) => (
          <AudioTrack key={p.sid} participant={p} />
        ))}
        <div
          onClick={!canPlayAudio ? resumeAudio : undefined}
          style={styles.mainContent}
        >
          <PerformerDisplay userRole={userRole} />
          {!canPlayAudio && (
            <div style={styles.playOverlay}>
              <span style={styles.playIcon}>▶</span>
              Click to Listen
            </div>
          )}
        </div>
        {userRole === "Audience" && (
          <EmojiBar disabled={props.performanceState !== "live"} />
        )}
      </div>
    </AudioPanelContext.Provider>
  );
};

const styles = {
  panelContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
    overflow: "hidden",
  } as React.CSSProperties,
  floatingEmojiWrapper: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  } as MotionStyle,
  floatingEmojiItself: {
    fontSize: "2rem",
  },
  senderUsername: {
    marginTop: "2px",
    fontSize: "0.7rem",
    color: "rgba(255, 255, 255, 0.7)", // Lighter text for subtlety
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Slight dark background
    padding: "1px 4px",
    borderRadius: "3px",
    whiteSpace: "nowrap",
  },

  mainContent: {
    position: "relative",
    cursor: "pointer",
    flex: 1,
    display: "flex",
  } as React.CSSProperties,
  // ✅ ADDITION: Add styles for the play overlay
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    zIndex: 10,
  } as React.CSSProperties,
  playIcon: {
    fontSize: "3rem",
    marginBottom: "0.5rem",
  } as React.CSSProperties,
};

export default AudioPanel;
