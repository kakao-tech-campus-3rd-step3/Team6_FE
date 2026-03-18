import { MockSignalService, type SignalEventLog } from "@/__test__/mocks/MockSignalService";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const STAGE_OPTIONS = [
  "PROFILE_VIEW_STAGE",
  "GAME_LIST_STAGE",
  "MANITTO_STAGE",
  "TOPIC_RECOMMEND_STAGE",
  "RANDOM_ROULETTE_STAGE",
  "ENDING_STAGE",
] as const;

/** 프로젝트에서 사용하는 STOMP 구독 destination 템플릿 */
const PRESET_DESTINATIONS = [
  { label: "Room Stage 변경", template: "/topic/room-stage/{roomId}" },
  { label: "대기실", template: "/topic/waiting-room/{roomId}" },
  { label: "참가자 목록", template: "/topic/room-participant/{roomId}" },
  { label: "게임 결과", template: "/topic/game-result/{roomId}" },
  { label: "게임 목록", template: "/topic/game-list/{roomId}" },
] as const;

const formatTime = (ts: number) => {
  const d = new Date(ts);
  // eslint-disable-next-line no-magic-numbers
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}.${d.getMilliseconds().toString().padStart(3, "0")}`;
};

interface SignalDevToolProps {
  mockService: MockSignalService;
}

export const SignalDevTool = ({ mockService }: SignalDevToolProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<{ destination: string; count: number }[]>([]);
  const [eventLog, setEventLog] = useState<SignalEventLog[]>([]);
  const [selectedStage, setSelectedStage] = useState<string>(STAGE_OPTIONS[0]);
  const [roomId, setRoomId] = useState("test-room-123");
  const [customDestination, setCustomDestination] = useState("");
  const [customPayload, setCustomPayload] = useState('{\n  "data": {\n    "stage": "GAME_LIST_STAGE"\n  }\n}');
  const [activeTab, setActiveTab] = useState<"quick" | "custom" | "log">("quick");
  const logEndRef = useRef<HTMLDivElement>(null);

  const refreshState = useCallback(() => {
    setSubscriptions(mockService.getSubscriptions());
    setEventLog(mockService.getEventLog());
  }, [mockService]);

  useEffect(() => {
    refreshState();
    const unsub = mockService.onChange(refreshState);
    return unsub;
  }, [mockService, refreshState]);

  useEffect(() => {
    if (activeTab === "log") {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [eventLog, activeTab]);

  const presetDestinations = PRESET_DESTINATIONS.map((p) => ({
    label: p.label,
    destination: p.template.replace("{roomId}", roomId),
  }));

  const allDestinations = [
    ...subscriptions.map((s) => s.destination),
    ...presetDestinations.map((p) => p.destination).filter((d) => !subscriptions.some((s) => s.destination === d)),
  ];

  const handleQuickSend = (stage: string) => {
    const roomStageDest = `/topic/room-stage/${roomId}`;
    const destination = allDestinations.find((d) => d.includes("room-stage")) || allDestinations[0] || roomStageDest;
    mockService.simulateEvent(destination, { data: { stage } });
  };

  const handleCustomSend = () => {
    if (!customDestination) return;
    try {
      const parsed = JSON.parse(customPayload);
      mockService.simulateEvent(customDestination, parsed);
    } catch {
      alert("❌ JSON 파싱 실패. 페이로드를 확인해주세요.");
    }
  };

  const portalContent = (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        left: "16px",
        zIndex: 99999,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
        fontSize: "12px",
      }}
    >
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "10px 16px",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            fontWeight: 600,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 24px rgba(99, 102, 241, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(99, 102, 241, 0.4)";
          }}
        >
          <span style={{ fontSize: "16px" }}>🧪</span>
          Signal DevTool
          {subscriptions.length > 0 && (
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "2px 8px",
                fontSize: "10px",
              }}
            >
              {subscriptions.length}개 구독
            </span>
          )}
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div
          style={{
            width: "420px",
            maxHeight: "85vh",
            borderRadius: "16px",
            background: "linear-gradient(180deg, #1e1b4b, #0f172a)",
            color: "#e2e8f0",
            boxShadow: "0 8px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(99, 102, 241, 0.2)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 16px",
              borderBottom: "1px solid rgba(99, 102, 241, 0.2)",
              background: "rgba(99, 102, 241, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>🧪</span>
              <span style={{ fontWeight: 700, fontSize: "14px", color: "#c7d2fe" }}>Signal DevTool</span>
              <span
                style={{
                  fontSize: "10px",
                  background: "rgba(99, 102, 241, 0.3)",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  color: "#a5b4fc",
                }}
              >
                MOCK
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                borderRadius: "8px",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            >
              ✕
            </button>
          </div>

          {/* Subscriptions Badge */}
          <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div
              style={{
                fontSize: "10px",
                color: "#64748b",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              활성 구독
            </div>
            {subscriptions.length === 0 ? (
              <div style={{ color: "#475569", fontStyle: "italic" }}>구독 없음</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {subscriptions.map((sub) => (
                  <div
                    key={sub.destination}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "rgba(34, 197, 94, 0.1)",
                      borderRadius: "8px",
                      padding: "6px 10px",
                      border: "1px solid rgba(34, 197, 94, 0.15)",
                    }}
                  >
                    <span
                      style={{
                        color: "#4ade80",
                        fontSize: "11px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "300px",
                      }}
                    >
                      ● {sub.destination}
                    </span>
                    <span style={{ color: "#64748b", fontSize: "10px", flexShrink: 0 }}>{sub.count}개</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {(["quick", "custom", "log"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: 600,
                  background: activeTab === tab ? "rgba(99, 102, 241, 0.15)" : "transparent",
                  color: activeTab === tab ? "#a5b4fc" : "#64748b",
                  borderBottom: activeTab === tab ? "2px solid #6366f1" : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {tab === "quick" && "⚡ 빠른 전송"}
                {tab === "custom" && "✏️ 커스텀"}
                {tab === "log" && `📋 로그 (${eventLog.length})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: "12px 16px", overflowY: "auto", flex: 1 }}>
            {/* Quick Send Tab */}
            {activeTab === "quick" && (
              <div>
                {/* Room ID 입력 */}
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ fontSize: "10px", color: "#64748b", display: "block", marginBottom: "4px" }}>
                    Room ID
                    <input
                      type="text"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      placeholder="room-id"
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(0,0,0,0.3)",
                        color: "#e2e8f0",
                        fontSize: "11px",
                        outline: "none",
                        boxSizing: "border-box",
                        marginTop: "4px",
                      }}
                    />
                  </label>
                </div>
                <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "8px" }}>
                  Stage 이벤트를 <span style={{ color: "#a5b4fc" }}>/topic/room-stage/{roomId}</span> 으로 전송합니다
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {STAGE_OPTIONS.map((stage) => (
                    <button
                      key={stage}
                      onClick={() => handleQuickSend(stage)}
                      disabled={false}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 14px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "10px",
                        cursor: "pointer",
                        background: selectedStage === stage ? "rgba(99, 102, 241, 0.15)" : "rgba(255,255,255,0.03)",
                        color: "#e2e8f0",
                        fontSize: "11px",
                        transition: "all 0.15s",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(99, 102, 241, 0.2)";
                        e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.3)";
                        setSelectedStage(stage);
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      }}
                    >
                      <span>{stage}</span>
                      <span style={{ color: "#6366f1", fontSize: "14px" }}>→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Tab */}
            {activeTab === "custom" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <label
                    htmlFor="custom-dest-select"
                    style={{ fontSize: "10px", color: "#64748b", display: "block", marginBottom: "4px" }}
                  >
                    Destination
                  </label>
                  <select
                    id="custom-dest-select"
                    value={customDestination}
                    onChange={(e) => setCustomDestination(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(0,0,0,0.3)",
                      color: "#e2e8f0",
                      fontSize: "11px",
                      outline: "none",
                    }}
                  >
                    <option value="">-- destination 선택 --</option>
                    {subscriptions.length > 0 && (
                      <optgroup label="🟢 활성 구독">
                        {subscriptions.map((sub) => (
                          <option key={sub.destination} value={sub.destination}>
                            {sub.destination}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="📌 프리셋 Destination">
                      {presetDestinations
                        .filter((p) => !subscriptions.some((s) => s.destination === p.destination))
                        .map((p) => (
                          <option key={p.destination} value={p.destination}>
                            {p.label} — {p.destination}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="custom-payload-textarea"
                    style={{ fontSize: "10px", color: "#64748b", display: "block", marginBottom: "4px" }}
                  >
                    JSON Payload
                  </label>
                  <textarea
                    id="custom-payload-textarea"
                    value={customPayload}
                    onChange={(e) => setCustomPayload(e.target.value)}
                    spellCheck={false}
                    style={{
                      width: "100%",
                      minHeight: "120px",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(0,0,0,0.3)",
                      color: "#a5b4fc",
                      fontSize: "11px",
                      fontFamily: "inherit",
                      resize: "vertical",
                      outline: "none",
                      lineHeight: 1.5,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  onClick={handleCustomSend}
                  disabled={!customDestination}
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: customDestination ? "pointer" : "not-allowed",
                    background: customDestination
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : "rgba(255,255,255,0.05)",
                    color: customDestination ? "#fff" : "#475569",
                    fontWeight: 600,
                    fontSize: "12px",
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (customDestination) e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  🚀 이벤트 전송
                </button>
              </div>
            )}

            {/* Log Tab */}
            {activeTab === "log" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>이벤트 히스토리</span>
                  {eventLog.length > 0 && (
                    <button
                      onClick={() => mockService.clearEventLog()}
                      style={{
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        color: "#f87171",
                        borderRadius: "6px",
                        padding: "2px 8px",
                        cursor: "pointer",
                        fontSize: "10px",
                      }}
                    >
                      🗑 초기화
                    </button>
                  )}
                </div>
                {eventLog.length === 0 ? (
                  <div style={{ color: "#475569", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
                    아직 이벤트가 없습니다
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    {eventLog.map((log, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "rgba(0,0,0,0.3)",
                          borderRadius: "8px",
                          padding: "8px 10px",
                          borderLeft: "3px solid #6366f1",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ color: "#a5b4fc", fontSize: "10px" }}>{log.destination}</span>
                          <span style={{ color: "#475569", fontSize: "9px" }}>{formatTime(log.timestamp)}</span>
                        </div>
                        <pre
                          style={{
                            margin: 0,
                            color: "#94a3b8",
                            fontSize: "10px",
                            lineHeight: 1.4,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                          }}
                        >
                          {/* eslint-disable-next-line no-magic-numbers */}
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(portalContent, document.body);
};
