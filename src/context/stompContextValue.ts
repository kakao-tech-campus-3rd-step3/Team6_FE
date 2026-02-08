import { StompService } from "@/services/stomp/StompService";
import { createContext } from "react";

interface StompContextValue {
  stompService: StompService;
}

export const StompContext = createContext<StompContextValue | null>(null);
