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

// You can get this from your LiveKit Cloud project or self-hosted instance
const LIVEKIT_HOST = import.meta.env.VITE_LIVEKIT_URL;

interface RoomState {
  room: Room | null;
  // The state will hold an array of participants
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
  isMuted: true,
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

      // Set the initial list of participants after connecting
      set({ participants: Array.from(room.remoteParticipants.values()) });
    } catch (err: any) {
      set({ error: err.message || "Failed to connect to room" });
    }
  },

  disconnect: () => {
    get().room?.disconnect();
    set({ room: null, participants: [] });
  },

  startAudio: async () => {
    const room = get().room;
    if (room) {
      // This is the function that triggers the browser's microphone permission prompt.
      await room.localParticipant.setMicrophoneEnabled(true);
    }
  },
  toggleMute: async () => {
    const room = get().room;
    if (room) {
      const isMuted = get().isMuted;
      // This function both enables/disables the mic and publishes/unpublishes the track
      await room.localParticipant.setMicrophoneEnabled(!isMuted);
      set({ isMuted: !isMuted });
    }
  },
  resumeAudio: async () => {
    const room = get().room;
    if (room) {
      // This tells LiveKit to resume the audio context
      await room.startAudio();
      set({ canPlayAudio: true });
    }
  },
}));
