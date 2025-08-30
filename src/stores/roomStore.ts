import { create } from "zustand";
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  LocalTrackPublication,
  Track,
  ParticipantEvent,
} from "livekit-client";
import { fetchLiveKitToken } from "../services/livekitService";

const LIVEKIT_HOST = import.meta.env.VITE_LIVEKIT_URL;

interface RoomState {
  room: Room | null;
  participants: RemoteParticipant[];
  error: string | null;
  canPlayAudio: boolean;
  connect: (roomName: string, authToken: string) => Promise<void>;
  disconnect: () => void;
  startAudio: () => Promise<void>;
  resumeAudio: () => Promise<void>;
  isMuted: boolean;
  toggleMute: () => Promise<void>;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  room: null,
  participants: [],
  error: null,
  canPlayAudio: true,
  isMuted: false,
  connect: async (roomName, authToken) => {
    try {
      const livekitToken = await fetchLiveKitToken(roomName, authToken);
      const room = new Room({
        audioCaptureDefaults: {
          autoGainControl: true,
          noiseSuppression: true,
        },
      });

      set({ room });

      const onLocalTrackChanged = (pub: LocalTrackPublication) => {
        if (pub.kind === Track.Kind.Audio) {
          set({ isMuted: pub.isMuted });
        }
      };
      room.localParticipant.on(
        ParticipantEvent.LocalTrackPublished,
        onLocalTrackChanged
      );
      room.localParticipant.on(
        ParticipantEvent.LocalTrackUnpublished,
        onLocalTrackChanged
      );

      // This event handles both initial suspension and suspension after a reconnect
      room.on(RoomEvent.AudioPlaybackStatusChanged, () => {
        set({ canPlayAudio: room.canPlaybackAudio });
      });

      const onParticipantsChanged = () => {
        set({ participants: Array.from(room.remoteParticipants.values()) });
      };

      room
        .on(RoomEvent.ParticipantConnected, onParticipantsChanged)
        .on(RoomEvent.ParticipantDisconnected, onParticipantsChanged);

      await room.connect(LIVEKIT_HOST, livekitToken);

      // Set the initial list of participants and audio status after connecting
      set({
        participants: Array.from(room.remoteParticipants.values()),
        canPlayAudio: room.canPlaybackAudio,
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to connect to room" });
    }
  },

  disconnect: () => {
    const room = get().room;
    if (room) {
      room.removeAllListeners(); // Clean up all event listeners
      room.disconnect();
    }
    set({ room: null, participants: [] });
  },

  startAudio: async () => {
    const room = get().room;
    if (room) {
      try {
        await room.localParticipant.setMicrophoneEnabled(true);
      } catch (error) {
        console.error("Could not get microphone permissions:", error);
        set({
          error:
            "Microphone permission was denied. Please enable it in your browser settings.",
        });
      }
    }
  },
  toggleMute: async () => {
    const room = get().room;
    if (room) {
      const isMuted = get().isMuted;
      await room.localParticipant.setMicrophoneEnabled(!isMuted);
      set({ isMuted: !isMuted });
    }
  },
  resumeAudio: async () => {
    const room = get().room;
    if (room) {
      await room.startAudio();
      set({ canPlayAudio: true });
    }
  },
}));
