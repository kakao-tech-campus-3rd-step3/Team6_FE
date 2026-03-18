import { useContext } from "react";

import { StompContext } from "./stompContextValue";

export const useStompContext = () => {
  const context = useContext(StompContext);
  if (!context) {
    throw new Error("useStompContext must be used within a StompProvider");
  }
  return context.stompService;
};
