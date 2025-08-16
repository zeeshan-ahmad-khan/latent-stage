import { create } from "zustand";

// Define the types for our data
interface Performer {
  username: string;
  talent: string;
  profilePictureUrl: string;
}

interface ScheduleSlot {
  time: string;
  performer?: Performer;
  status: "live" | "booked" | "available";
}

// Define the shape of our store's state
interface ScheduleState {
  livePerformer: Performer | null;
  schedule: ScheduleSlot[];
}

// Create the Zustand store
export const useScheduleStore = create<ScheduleState>((set) => ({
  // --- STATE ---
  livePerformer: {
    username: "@LiveSinger",
    talent: "Singer / Songwriter",
    profilePictureUrl: "https://placehold.co/100x100/1e222a/ffffff?text=LS",
  },
  // --- EXPANDED SCHEDULE DATA ---
  schedule: [
    {
      time: "8:10 PM",
      performer: {
        username: "@JokerJester",
        talent: "Stand-up Comedy",
        profilePictureUrl: "",
      },
      status: "booked",
    },
    { time: "8:30 PM", status: "available" },
    {
      time: "8:50 PM",
      performer: {
        username: "@PoetryPro",
        talent: "Spoken Word",
        profilePictureUrl: "",
      },
      status: "booked",
    },
    {
      time: "9:10 PM",
      performer: {
        username: "@MagicMan",
        talent: "Magic Tricks",
        profilePictureUrl: "",
      },
      status: "booked",
    },
    { time: "9:30 PM", status: "available" },
    { time: "9:50 PM", status: "available" },
    {
      time: "10:10 PM",
      performer: {
        username: "@BeatBoxer",
        talent: "Beatboxing",
        profilePictureUrl: "",
      },
      status: "booked",
    },
    {
      time: "10:30 PM",
      performer: {
        username: "@StoryTeller",
        talent: "Storytelling",
        profilePictureUrl: "",
      },
      status: "booked",
    },
    { time: "10:50 PM", status: "available" },
    {
      time: "11:10 PM",
      performer: {
        username: "@GuitarHero",
        talent: "Guitar Solo",
        profilePictureUrl: "",
      },
      status: "booked",
    },
    { time: "11:30 PM", status: "available" },
    {
      time: "11:50 PM",
      performer: {
        username: "@LateNightVibes",
        talent: "Lo-fi Beats",
        profilePictureUrl: "",
      },
      status: "booked",
    },
    { time: "12:10 AM", status: "available" },
    { time: "12:30 AM", status: "available" },
    {
      time: "12:50 AM",
      performer: {
        username: "@FinalAct",
        talent: "Acoustic Covers",
        profilePictureUrl: "",
      },
      status: "booked",
    },
  ],

  // --- ACTIONS (we will add these later) ---
}));
