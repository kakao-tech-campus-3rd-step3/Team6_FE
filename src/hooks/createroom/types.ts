import type { PurposeId } from "@/constants";

export interface CreateRoomFormData {
  roomName: string;
  capacity: number;
  purpose: PurposeId | "";
}

export interface CreateRoomActionReturn {
  isCreating: boolean;
  isReady: boolean;
  handleCreateRoom: () => Promise<void>;
}
