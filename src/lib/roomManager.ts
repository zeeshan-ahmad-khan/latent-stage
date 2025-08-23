import { AugmentedWebSocket } from "../types";

const rooms = new Map<string, Set<AugmentedWebSocket>>();

export const joinRoom = (ws: AugmentedWebSocket, roomName: string) => {
  if (!rooms.has(roomName)) {
    rooms.set(roomName, new Set());
  }
  rooms.get(roomName)!.add(ws);
  console.log(`User '${ws.user.username}' joined room: '${roomName}'`);
};

export const leaveRoom = (ws: AugmentedWebSocket, roomName: string) => {
  const roomClients = rooms.get(roomName);
  if (roomClients) {
    roomClients.delete(ws);
    if (roomClients.size === 0) {
      rooms.delete(roomName);
      console.log(`Room '${roomName}' is now empty and has been closed.`);
    }
  }
};

export const broadcastMessage = (
  ws: AugmentedWebSocket,
  roomName: string,
  message: string
) => {
  const roomClients = rooms.get(roomName);
  if (!roomClients) return;

  const payload = {
    sender: ws.user.username,
    message: message,
    timestamp: new Date().toISOString(),
  };
  const payloadString = JSON.stringify(payload);

  roomClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payloadString);
    }
  });
};
