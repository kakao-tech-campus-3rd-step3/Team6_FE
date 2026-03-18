import type { Participant } from "@/hooks/profileview";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;
  clearParticipants: () => void;
  getParticipantByName: (name: string) => Participant | undefined;
  getParticipantCount: () => number;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      participants: [],
      setParticipants: (participants) => set({ participants }),
      clearParticipants: () => set({ participants: [] }),
      getParticipantByName: (name) => get().participants.find((p) => p.name === name),
      getParticipantCount: () => get().participants.length,
    }),
    {
      name: "icebreaking-users",
    },
  ),
);
