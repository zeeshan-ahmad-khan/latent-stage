import { create } from "zustand";
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  Track,
  ParticipantEvent,
  Participant,
  TrackPublication,
} from "livekit-client";
import { fetchLiveKitToken } from "../services/livekitService";

const LIVEKIT_HOST = import.meta.env.VITE_LIVEKIT_URL;

interface RoomState {
  room: Room | null;
  participants: RemoteParticipant[];
  error: string | null;
  canPlayAudio: boolean;
  isMuted: boolean;
  speakingParticipants: Participant[];
  localParticipant: Participant | null;
  connect: (roomName: string, authToken: string) => Promise<void>;
  disconnect: () => void;
  startAudio: () => Promise<void>;
  resumeAudio: () => Promise<void>;
  toggleMute: () => Promise<void>;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  room: null,
  participants: [],
  error: null,
  canPlayAudio: true,
  isMuted: true,
  speakingParticipants: [],
  localParticipant: null,
  connect: async (roomName, authToken) => {
    try {
      const livekitToken = await fetchLiveKitToken(roomName, authToken);
      const room = new Room({
        audioCaptureDefaults: {
          autoGainControl: true,
          noiseSuppression: true,
        },
      });

      set({ room, localParticipant: room.localParticipant });

      // ✅ --- THIS IS THE CHANGE ---
      // These are the correct listeners for mute/unmute state changes.
      const handleMuteChange = (publication: TrackPublication) => {
        if (publication.kind === Track.Kind.Audio) {
          set({ isMuted: publication.isMuted });
        }
      };

      // We listen specifically for when a track is muted or unmuted.
      room.localParticipant.on(ParticipantEvent.TrackMuted, handleMuteChange);
      room.localParticipant.on(ParticipantEvent.TrackUnmuted, handleMuteChange);

      // --- The incorrect listeners have been removed. ---

      room.on(RoomEvent.AudioPlaybackStatusChanged, () => {
        set({ canPlayAudio: room.canPlaybackAudio });
      });

      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        set({ speakingParticipants: speakers });
      });

      const onParticipantsChanged = () => {
        set({ participants: Array.from(room.remoteParticipants.values()) });
      };

      room
        .on(RoomEvent.ParticipantConnected, onParticipantsChanged)
        .on(RoomEvent.ParticipantDisconnected, onParticipantsChanged);

      await room.connect(LIVEKIT_HOST, livekitToken);

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
      room.removeAllListeners();
      room.disconnect();
    }
    set({
      room: null,
      participants: [],
      localParticipant: null,
      speakingParticipants: [],
    });
  },

  startAudio: async () => {
    const room = get().room;
    if (room) {
      try {
        await room.localParticipant.setMicrophoneEnabled(true);
        const micPub = room.localParticipant.getTrackPublication(
          Track.Source.Microphone
        );
        set({ isMuted: micPub?.isMuted ?? true });
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
    const micPub = room?.localParticipant.getTrackPublication(
      Track.Source.Microphone
    );
    if (micPub) {
      if (micPub.isMuted) {
        await micPub.unmute();
      } else {
        await micPub.mute();
      }
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
