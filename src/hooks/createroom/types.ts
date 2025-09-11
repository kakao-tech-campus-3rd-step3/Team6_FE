export interface CreateRoomFormData {
  roomName: string;
  capacity: number;
  purpose: "business" | "personal" | "drinking" | "";
}

export interface CreateRoomActionReturn {
  isCreating: boolean;
  isReady: boolean;
  handleCreateRoom: () => Promise<void>;
}
