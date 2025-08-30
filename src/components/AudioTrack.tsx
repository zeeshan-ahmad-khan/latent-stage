import React, { useEffect, useRef } from "react";
import { Participant, Track, TrackPublication } from "livekit-client";

interface AudioTrackProps {
  participant: Participant;
}

const AudioTrack: React.FC<AudioTrackProps> = ({ participant }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // --- THIS IS THE FIX ---
    // The correct method is getTrackPublication, which returns the track's publication info.
    const trackPublication: TrackPublication | undefined =
      participant.getTrackPublication(Track.Source.Microphone);

    // We then check if the publication and its underlying track exist before attaching.
    if (
      trackPublication?.isSubscribed &&
      trackPublication.track &&
      audioRef.current
    ) {
      const audioTrack = trackPublication.track;
      audioTrack.attach(audioRef.current);

      // Return a cleanup function to detach the track when the component unmounts
      return () => {
        audioTrack.detach(audioRef.current as HTMLAudioElement);
      };
    }
  }, [participant]); // Rerun this effect if the participant object changes

  return <audio ref={audioRef} autoPlay />;
};

export default AudioTrack;
