import { Row } from "@/components/dev/Row";
import { Section } from "@/components/dev/Section";
import type { DebugInfo, PerformanceWithMemory } from "@/components/dev/types";
import { stompService } from "@/services/stomp/StompService";
import { useEffect, useState } from "react";

const MEMORY_LEAK_THRESHOLD = {
  MESSAGE_HANDLERS: 10,
  STOMP_SUBSCRIPTIONS: 10,
  STATE_LISTENERS: 20,
} as const;

const REFRESH_INTERVAL_MS = 1000;
const MAX_HISTORY_POINTS = 30;

const formatBytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

const MemoryUsageGraph = ({
  history,
  limit,
  total,
  width = 400,
  height = 120,
}: {
  history: number[];
  limit: number;
  total: number;
  width?: number;
  height?: number;
}) => {
  if (history.length < 2) {
    return <div className="py-4 text-center text-gray-500 italic">메모리 데이터 수집 중...</div>;
  }

  const maxHistory = Math.max(...history);
  const maxVal = Math.max(total, maxHistory) * 1.2 || 1;

  const toY = (val: number) => height - (val / maxVal) * height;

  const points = history.map((val, i) => `${(i / (history.length - 1)) * width},${toY(val)}`).join(" ");

  const limitY = toY(limit);
  const totalY = toY(total);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full rounded-md bg-gray-900">
        <line x1="0" y1={limitY} x2={width} y2={limitY} stroke="#e53e3e" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1={totalY} x2={width} y2={totalY} stroke="#f6e05e" strokeWidth="0.5" />
        <polyline fill="none" stroke="#4299e1" strokeWidth="1.5" points={points} />
      </svg>
      <div className="bg-opacity-50 absolute top-0 right-0 rounded-bl-md bg-gray-900 p-1 text-[10px] text-gray-400">
        <div>
          <span className="text-[#e53e3e]">■</span> Limit: {formatBytes(limit)}
        </div>
        <div>
          <span className="text-[#f6e05e]">■</span> Total: {formatBytes(total)}
        </div>
        <div>
          <span className="text-[#4299e1]">■</span> Used: {formatBytes(history[history.length - 1])}
        </div>
      </div>
    </div>
  );
};

export const StompMonitor = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [memoryUsage, setMemoryUsage] = useState<{ used: number; total: number; limit: number } | null>(null);
  const [memoryHistory, setMemoryHistory] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const info = stompService.getDebugInfo();
      if (info) {
        setDebugInfo(info);
        setRefreshCount((prev) => prev + 1);
      }

      const performanceWithMemory = performance as PerformanceWithMemory;
      if (performanceWithMemory.memory) {
        const memory = performanceWithMemory.memory;
        setMemoryUsage({
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
        });
        setMemoryHistory((prev) => [...prev.slice(-MAX_HISTORY_POINTS + 1), memory.usedJSHeapSize]);
      }
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  if (!import.meta.env.DEV) return null;
  if (!debugInfo) return null;

  const hasMemoryLeak =
    debugInfo.messageHandlersSize > MEMORY_LEAK_THRESHOLD.MESSAGE_HANDLERS ||
    debugInfo.stompSubscriptionsSize > MEMORY_LEAK_THRESHOLD.STOMP_SUBSCRIPTIONS ||
    debugInfo.stateListenersSize > MEMORY_LEAK_THRESHOLD.STATE_LISTENERS;

  return (
    <div className="fixed right-4 bottom-4 z-[9999] font-mono text-xs">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`rounded-lg px-3 py-2 text-white shadow-lg transition-colors ${
            debugInfo.state.isConnected ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          STOMP {debugInfo.state.isConnected ? "연결됨" : "연결안됨"}
        </button>
      )}

      {isOpen && (
        <div className="max-h-[80vh] max-w-[500px] min-w-[400px] overflow-y-auto rounded-lg bg-gray-800 p-4 text-gray-100 shadow-2xl">
          <div className="mb-3 flex items-center justify-between border-b border-gray-700 pb-2">
            <h3 className="text-sm font-bold">STOMP Monitor</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>

          <div className="mb-3 text-[11px] text-gray-400">자동 갱신: {refreshCount}회</div>

          <Section title="연결 상태">
            <Row
              label="연결됨"
              value={debugInfo.state.isConnected ? "O" : "X"}
              status={debugInfo.state.isConnected ? "success" : "error"}
            />
            <Row
              label="연결 중"
              value={debugInfo.state.isConnecting ? "O" : "X"}
              status={debugInfo.state.isConnecting ? "warning" : "normal"}
            />
            {debugInfo.state.error && <Row label="에러" value={debugInfo.state.error.message} status="error" />}
          </Section>

          <Section title="STOMP 메모리 모니터링">
            <Row
              label="메시지 핸들러"
              value={`${debugInfo.messageHandlersSize}개`}
              status={debugInfo.messageHandlersSize > MEMORY_LEAK_THRESHOLD.MESSAGE_HANDLERS ? "warning" : "normal"}
            />
            <Row
              label="STOMP 구독"
              value={`${debugInfo.stompSubscriptionsSize}개`}
              status={
                debugInfo.stompSubscriptionsSize > MEMORY_LEAK_THRESHOLD.STOMP_SUBSCRIPTIONS ? "warning" : "normal"
              }
            />
            <Row
              label="상태 리스너"
              value={`${debugInfo.stateListenersSize}개`}
              status={debugInfo.stateListenersSize > MEMORY_LEAK_THRESHOLD.STATE_LISTENERS ? "warning" : "normal"}
            />
          </Section>

          {memoryUsage && (
            <Section title="브라우저 메모리 (Chrome Only)">
              <MemoryUsageGraph history={memoryHistory} limit={memoryUsage.limit} total={memoryUsage.total} />
            </Section>
          )}

          <Section title="활성 구독 목록">
            {debugInfo.messageHandlers.length === 0 ? (
              <div className="text-gray-500 italic">활성 구독 없음</div>
            ) : (
              <div className="max-h-[200px] overflow-y-auto">
                {debugInfo.messageHandlers.map((handler, idx) => (
                  <div key={idx} className="mb-1 rounded bg-gray-700 p-2 text-[11px]">
                    <div className="mb-0.5 text-blue-400">{handler.destination}</div>
                    <div className="text-gray-400">핸들러 {handler.handlerCount}개</div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {hasMemoryLeak && (
            <div className="mt-3 rounded-md bg-yellow-100 p-3 text-[11px] text-yellow-900">
              <strong>메모리 릭 경고:</strong> 구독 해제가 되었는지 확인해주세요.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
