import { create } from "zustand";
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  Track,
  ParticipantEvent,
  Participant,
  TrackPublication,
  DataPacket_Kind, // ✅ ADDITION: Import DataPacket_Kind
  LocalParticipant,
} from "livekit-client";
import { fetchLiveKitToken } from "../services/livekitService";

const LIVEKIT_HOST = import.meta.env.VITE_LIVEKIT_URL;

interface EmojiPayload {
  type: "emoji_reaction";
  emoji: string;
  senderUsername: string;
  x: number; // Relative X coordinate within the sender's panel
  y: number; // Relative Y coordinate within the sender's panel
}

interface RoomState {
  room: Room | null;
  participants: RemoteParticipant[];
  error: string | null;
  canPlayAudio: boolean;
  isMuted: boolean;
  speakingParticipants: Participant[];
  localParticipant: Participant | null;
  connect: (
    roomName: string,
    authToken: string,
    onEmojiReceived: (
      emoji: string,
      senderUsername: string,
      x: number,
      y: number
    ) => void
  ) => Promise<void>;
  disconnect: () => void;
  startAudio: () => Promise<void>;
  resumeAudio: () => Promise<void>;
  toggleMute: () => Promise<void>;
  sendEmojiReaction: (emoji: string, x: number, y: number) => void; // ✅ ADDITION: Add send function type
}

export const useRoomStore = create<RoomState>((set, get) => ({
  room: null,
  participants: [],
  error: null,
  canPlayAudio: true,
  isMuted: true,
  speakingParticipants: [],
  localParticipant: null,
  connect: async (roomName, authToken, onEmojiReceived) => {
    try {
      const livekitToken = await fetchLiveKitToken(roomName, authToken);
      const room = new Room({
        audioCaptureDefaults: {
          autoGainControl: true,
          noiseSuppression: true,
        },
      });

      room.on(
        RoomEvent.DataReceived,
        (
          payload: Uint8Array,
          _participant?: RemoteParticipant,
          kind?: DataPacket_Kind
        ) => {
          if (kind === DataPacket_Kind.RELIABLE) {
            try {
              const decoder = new TextDecoder();
              const jsonString = decoder.decode(payload);
              const data: EmojiPayload = JSON.parse(jsonString);

              // ✅ MODIFICATION: Check for senderUsername and pass it to the callback
              if (
                data &&
                data.type === "emoji_reaction" &&
                data.emoji &&
                data.senderUsername
              ) {
                onEmojiReceived(
                  data.emoji,
                  data.senderUsername,
                  data.x,
                  data.y
                );
              }
            } catch (error) {
              console.error("Failed to parse emoji data:", error);
            }
          }
        }
      );

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
      if (room.localParticipant) {
        const tracks = Array.from(
          room.localParticipant.trackPublications.values()
        )
          .map((pub) => pub.track)
          .filter((track) => track !== undefined);

        tracks.forEach((track) => track?.stop());
        room.localParticipant.unpublishTracks(tracks);
      }
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
        if (micPub) {
          await micPub.mute();
        }
        set({ isMuted: true });
      } catch (error) {
        console.error("Could not get microphone permissions:", error);
        set({
          error:
            "Microphone permission was denied. Please enable it in your browser settings.",
        });
      }
    }
  },

  sendEmojiReaction: (emoji: string, x: number, y: number) => {
    const room = get().room;
    const localP = get().localParticipant as LocalParticipant | null; // Cast for methods

    if (room && localP && localP.identity) {
      // Ensure identity exists
      // ✅ ADDITION: Include senderUsername in the payload
      const payload: EmojiPayload = {
        type: "emoji_reaction",
        emoji,
        senderUsername: localP.identity, // LiveKit uses identity as username here
        x,
        y,
      };
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(payload));
      try {
        localP.publishData(data, { reliable: true });
      } catch (error) {
        console.error(
          `[RoomStore] Failed to publish emoji data: ${emoji}`,
          error
        );
      }
    } else {
      console.warn(
        `[RoomStore] Cannot send emoji, room, localParticipant, or identity not available.`
      );
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
