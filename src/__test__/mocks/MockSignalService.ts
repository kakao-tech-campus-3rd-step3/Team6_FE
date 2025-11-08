import type { SignalService, Unsubscribe } from "@/services/stomp/types";

export interface SignalEventLog {
  timestamp: number;
  destination: string;
  data: unknown;
}

type MockSignalListener = () => void;

export class MockSignalService implements SignalService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscribers = new Map<string, Set<(data: any) => void>>();
  private eventLog: SignalEventLog[] = [];
  private listeners = new Set<MockSignalListener>();

  // eslint-disable-next-line no-magic-numbers
  private static readonly MAX_LOG_SIZE = 100;

  public subscribe<T = unknown>(destination: string, callback: (data: T) => void): Unsubscribe {
    if (!this.subscribers.has(destination)) {
      this.subscribers.set(destination, new Set());
    }

    this.subscribers.get(destination)!.add(callback);
    this.notifyListeners();

    return () => {
      this.subscribers.get(destination)?.delete(callback);
      if (this.subscribers.get(destination)?.size === 0) {
        this.subscribers.delete(destination);
      }
      this.notifyListeners();
    };
  }

  public simulateEvent(destination: string, data: unknown) {
    this.eventLog.push({ timestamp: Date.now(), destination, data });
    if (this.eventLog.length > MockSignalService.MAX_LOG_SIZE) {
      this.eventLog = this.eventLog.slice(-MockSignalService.MAX_LOG_SIZE);
    }

    const callbacks = this.subscribers.get(destination);

    if (callbacks && callbacks.size > 0) {
      console.log(`[Mock Signal] 🚀 이벤트 발송 (${callbacks.size}개 구독자):`, destination, data);
      callbacks.forEach((cb) => cb(data));
    } else {
      console.warn(`[Mock Signal] ⚠️ 구독자 없음 (이벤트 버려짐):`, destination, data);
    }

    this.notifyListeners();
  }

  public getSubscriptions(): { destination: string; count: number }[] {
    return Array.from(this.subscribers.entries()).map(([destination, cbs]) => ({
      destination,
      count: cbs.size,
    }));
  }

  public getEventLog(): SignalEventLog[] {
    return [...this.eventLog];
  }

  public clearEventLog() {
    this.eventLog = [];
    this.notifyListeners();
  }

  public onChange(listener: MockSignalListener): Unsubscribe {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }
}
