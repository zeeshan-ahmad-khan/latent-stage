import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL; // Your main backend URL

// This function will fetch a LiveKit token from your backend
export const fetchLiveKitToken = async (
  roomName: string,
  authToken: string
) => {
  const response = await axios.post(
    `${API_BASE_URL}/livekit/token`,
    { roomName },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return response.data.token;
};
