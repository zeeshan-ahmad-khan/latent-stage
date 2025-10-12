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
}

export interface AudioPanelProps {
  token: string;
  userRole: UserRole;
  performer: Performer;
  roomName: string;
  performanceState: PerformanceState;
  timeLeft: number;
}

export interface AudioPanelContextProps extends AudioPanelProps {
  triggerEmojiAnimation: (
    emoji: string,
    clientX: number,
    clientY: number
  ) => void;
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
  const { connect, disconnect, startAudio, participants } = useRoomStore();
  const { token, userRole, roomName, performanceState } = props;
  const hasConnected = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  useEffect(() => {
    if (token && roomName && !hasConnected.current) {
      hasConnected.current = true;
      connect(roomName, token).then(() => {
        if (userRole === "Performer") {
          startAudio();
        }
      });
    }
  }, [token, userRole, roomName, connect, startAudio]);

  // Disconnect from the room when the performance is over
  useEffect(() => {
    if (performanceState === "ended" || performanceState === "grace") {
      disconnect();
    }
  }, [performanceState, disconnect]);

  const triggerEmojiAnimation = useCallback(
    (emoji: string, clientX: number, clientY: number) => {
      if (!panelRef.current) return;
      const panelRect = panelRef.current.getBoundingClientRect();
      const x = clientX - panelRect.left;
      const y = clientY - panelRect.top;
      setFloatingEmojis((prev) => [...prev, { id: nanoid(), emoji, x, y }]);
    },
    []
  );

  const handleAnimationComplete = (id: string) => {
    setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <AudioPanelContext.Provider value={{ ...props, triggerEmojiAnimation }}>
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
              style={styles.floatingEmoji}
            >
              {item.emoji}
            </motion.span>
          ))}
        </AnimatePresence>
        {participants.map((p) => (
          <AudioTrack key={p.sid} participant={p} />
        ))}
        <PerformerDisplay userRole={userRole} />
        <EmojiBar disabled={performanceState !== "live"} />
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
  floatingEmoji: {
    position: "absolute",
    fontSize: "2rem",
    pointerEvents: "none",
    zIndex: 1000,
  } as MotionStyle,
};

export default AudioPanel;
