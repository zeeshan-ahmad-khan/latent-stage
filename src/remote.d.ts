declare module "chatMfe/ChatPanel" {
  const ChatPanel: React.ComponentType<{
    token: string;
    roomId: string;
    disabled: boolean;
  }>;
  export default ChatPanel;
}

declare module "audioMfe/AudioPanel" {
  const AudioPanel: React.ComponentType<{
    token: string;
    userRole: "Performer" | "Audience";
    roomName: string;
    performer?: {
      _id: string;
      username: string;
      // Add the other performer fields we need
      profilePictureUrl?: string;
      bio?: string;
      socialLinks?: {
        youtube?: string;
        instagram?: string;
        facebook?: string;
      };
    };
    performanceState: PerformanceState;
    timeLeft: number;
    isTimerRunning: boolean;
  }>;
  export default AudioPanel;
}
