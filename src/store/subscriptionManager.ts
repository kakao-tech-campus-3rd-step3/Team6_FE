import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SubscriptionState {
  activeTopics: Set<string>;
  addTopic: (topic: string) => void;
  removeTopic: (topic: string) => void;
  isSubscribed: (topic: string) => boolean;
  clearAllTopics: () => void;
  getActiveTopics: () => string[];
}

export const useSubscriptionStore = create<SubscriptionState>()(
  devtools(
    (set, get) => ({
      activeTopics: new Set<string>(),

      addTopic: (topic) =>
        set(
          (state) => ({
            activeTopics: new Set(state.activeTopics).add(topic),
          }),
          false,
          `addTopic: ${topic}`,
        ),

      removeTopic: (topic) =>
        set(
          (state) => {
            const newTopics = new Set(state.activeTopics);
            newTopics.delete(topic);
            return { activeTopics: newTopics };
          },
          false,
          `removeTopic: ${topic}`,
        ),

      isSubscribed: (topic) => get().activeTopics.has(topic),

      clearAllTopics: () => set({ activeTopics: new Set<string>() }, false, "clearAllTopics"),

      getActiveTopics: () => Array.from(get().activeTopics),
    }),
    { name: "subscription-store" },
  ),
);
