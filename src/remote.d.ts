declare module "chatMfe/ChatPanel" {
  const ChatPanel: React.ComponentType<{ token: string }>;
  export default ChatPanel;
}

declare module "audioMfe/AudioPanel" {
  const AudioPanel: React.ComponentType<{
    token: string;
    userRole: "Performer" | "Audience";
  }>;
  export default AudioPanel;
}
