export type SignalMode = "mock" | "local" | "prod";

export interface SignalTarget {
  mode: SignalMode;
  label: string;
  description: string;
  wsUrl?: string;
}

export const SIGNAL_TARGETS: SignalTarget[] = [
  {
    mode: "mock",
    label: "MockSignalService",
    description: "실제 백엔드 없이 프론트엔드 STOMP 이벤트를 시뮬레이션합니다.",
  },
  {
    mode: "local",
    label: "Local (localhost)",
    description: "Vite Proxy를 통해 로컬 서버로 우회 접속합니다.",
    wsUrl: import.meta.env.DEV ? `ws://${window.location.host}/ws/local/ws-stomp` : "ws://localhost:8080/ws-stomp",
  },
  {
    mode: "prod",
    label: "Prod (배포 서버)",
    description: "Vite Proxy를 통해 운영 서버로 우회 접속합니다.",
    wsUrl: import.meta.env.DEV ? `ws://${window.location.host}/ws/prod/ws/websocket` : import.meta.env.VITE_BROKER_URL,
  },
];
