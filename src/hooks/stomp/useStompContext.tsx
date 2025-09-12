import { StompContext } from "@/context/StompContext";
import { useContext } from "react";

export const useStompContext = () => useContext(StompContext);
