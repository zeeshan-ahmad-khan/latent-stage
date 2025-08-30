import React, { useEffect, useRef, useState } from "react";
import {
  Participant,
  Track,
  TrackPublication,
  ParticipantEvent,
} from "livekit-client";

interface AudioTrackProps {
  participant: Participant;
}

const AudioTrack: React.FC<AudioTrackProps> = ({ participant }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [publication, setPublication] = useState<TrackPublication | undefined>(
    undefined
  );

  useEffect(() => {
    // This effect's job is to find the microphone publication from the participant
    const updatePublication = () => {
      const pub = participant.getTrackPublication(Track.Source.Microphone);
      setPublication(pub);
    };

    // Listen for when the performer publishes or unpublishes their track
    participant.on(ParticipantEvent.TrackPublished, updatePublication);
    participant.on(ParticipantEvent.TrackUnpublished, updatePublication);

    updatePublication(); // Run once to get the initial state

    return () => {
      participant.off(ParticipantEvent.TrackPublished, updatePublication);
      participant.off(ParticipantEvent.TrackUnpublished, updatePublication);
    };
  }, [participant]);

  useEffect(() => {
    // This effect's job is to attach the audio track when it's available and subscribed
    const handleSubscribed = (track: Track) => {
      if (track.kind === Track.Kind.Audio && audioRef.current) {
        track.attach(audioRef.current);
      }
    };

    const handleUnsubscribed = (track: Track) => {
      track.detach();
    };

    if (publication) {
      // If the track is already subscribed, attach it.
      if (publication.track && publication.isSubscribed) {
        handleSubscribed(publication.track);
      }

      // ✅ FIX: Use the correct string-based event names on the publication object
      publication.on("subscribed", handleSubscribed);
      publication.on("unsubscribed", handleUnsubscribed);

      return () => {
        publication.off("subscribed", handleSubscribed);
        publication.off("unsubscribed", handleUnsubscribed);
        // Detach any existing track on cleanup
        publication.track?.detach();
      };
    }
  }, [publication]);

  return <audio ref={audioRef} autoPlay />;
};

export default AudioTrack;
