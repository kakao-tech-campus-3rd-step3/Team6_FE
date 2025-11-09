import { MockSignalService, type SignalEventLog } from "@/__test__/mocks/MockSignalService";
import type { StompService } from "@/services/stomp/StompService";
import { SIGNAL_TARGETS, type SignalMode, type SignalTarget } from "@/services/stomp/signalTargets";
import type { StompState } from "@/services/stomp/types";
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
  stompService: StompService;
  currentMode: SignalMode;
  onModeChange: (mode: SignalMode) => void;
}

export const SignalDevTool = ({ mockService, stompService, currentMode, onModeChange }: SignalDevToolProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<{ destination: string; count: number }[]>([]);
  const [eventLog, setEventLog] = useState<SignalEventLog[]>([]);
  const [selectedStage, setSelectedStage] = useState<string>(STAGE_OPTIONS[0]);
  const [roomId, setRoomId] = useState("test-room-123");
  const [customDestination, setCustomDestination] = useState("");
  const [customPayload, setCustomPayload] = useState('{\n  "data": {\n    "stage": "GAME_LIST_STAGE"\n  }\n}');
  const [activeTab, setActiveTab] = useState<"mode" | "quick" | "custom" | "log">("mode");
  const [stompState, setStompState] = useState<StompState>(stompService.getState());

  const logEndRef = useRef<HTMLDivElement>(null);

  const isMock = currentMode === "mock";
  const activeTarget = SIGNAL_TARGETS.find((t: SignalTarget) => t.mode === currentMode)!;

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
    const unsub = stompService.subscribeToState((state) => {
      setStompState(state);
    });
    return unsub;
  }, [stompService]);

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
      alert("JSON 파싱 실패. 페이로드를 확인해주세요.");
    }
  };

  const modeBadgeLabel = currentMode.toUpperCase();
  const modeBadgeColor = isMock
    ? "rgba(99, 102, 241, 0.3)"
    : currentMode === "local"
      ? "rgba(251, 191, 36, 0.3)"
      : "rgba(34, 197, 94, 0.3)";
  const modeBadgeTextColor = isMock ? "#a5b4fc" : currentMode === "local" ? "#fbbf24" : "#4ade80";
  const buttonGradient = isMock
    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
    : currentMode === "local"
      ? "linear-gradient(135deg, #d97706, #f59e0b)"
      : "linear-gradient(135deg, #059669, #10b981)";
  const buttonShadow = isMock
    ? "0 4px 20px rgba(99, 102, 241, 0.4)"
    : currentMode === "local"
      ? "0 4px 20px rgba(245, 158, 11, 0.4)"
      : "0 4px 20px rgba(16, 185, 129, 0.4)";

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
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: buttonGradient,
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "10px 16px",
            cursor: "pointer",
            boxShadow: buttonShadow,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            fontWeight: 600,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Signal DevTool
          <span
            style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: "8px",
              padding: "2px 8px",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            {modeBadgeLabel}
          </span>
          {subscriptions.length > 0 && (
            <span
              style={{
                background: "rgba(255,255,255,0.15)",
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
              <span style={{ fontWeight: 700, fontSize: "14px", color: "#c7d2fe" }}>Signal DevTool</span>
              <span
                style={{
                  fontSize: "10px",
                  background: modeBadgeColor,
                  padding: "2px 8px",
                  borderRadius: "6px",
                  color: modeBadgeTextColor,
                  fontWeight: 700,
                  transition: "all 0.3s ease",
                }}
              >
                {modeBadgeLabel}
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

          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {(["mode", "quick", "custom", "log"] as const).map((tab) => (
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
                {tab === "mode" && "모드"}
                {tab === "quick" && "빠른 전송"}
                {tab === "custom" && "커스텀"}
                {tab === "log" && `로그 (${eventLog.length})`}
              </button>
            ))}
          </div>

          <div style={{ padding: "12px 16px", overflowY: "auto", flex: 1 }}>
            {activeTab === "mode" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "12px",
                    }}
                  >
                    SignalService 구현체 전환
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label
                      htmlFor="signal-mode-select"
                      style={{ fontSize: "10px", color: "#64748b", display: "block", marginBottom: "4px" }}
                    >
                      구현체 선택
                    </label>
                    <select
                      id="signal-mode-select"
                      value={currentMode}
                      onChange={(e) => onModeChange(e.target.value as SignalMode)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "rgba(0,0,0,0.4)",
                        color: "#e2e8f0",
                        fontSize: "12px",
                        fontWeight: 600,
                        outline: "none",
                        cursor: "pointer",
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M3 5l3 3 3-3'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                      }}
                    >
                      {SIGNAL_TARGETS.map((target: SignalTarget) => (
                        <option key={target.mode} value={target.mode}>
                          {target.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    style={{
                      background: `${modeBadgeColor.replace("0.3", "0.1")}`,
                      border: `1px solid ${modeBadgeColor.replace("0.3", "0.2")}`,
                      borderRadius: "10px",
                      padding: "12px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: modeBadgeTextColor,
                        marginBottom: "6px",
                      }}
                    >
                      {activeTarget.label}
                    </div>
                    <div style={{ fontSize: "10px", color: "#94a3b8", lineHeight: 1.6 }}>
                      {activeTarget.description}
                    </div>
                    {activeTarget.wsUrl && (
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#64748b",
                          marginTop: "6px",
                          wordBreak: "break-all",
                        }}
                      >
                        WS: {activeTarget.wsUrl}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "10px",
                    }}
                  >
                    연결 상태
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>Connected</span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: isMock || stompState.isConnected ? "#4ade80" : "#f87171",
                        }}
                      >
                        {isMock || stompState.isConnected ? "● Yes" : "○ No"}
                      </span>
                    </div>

                    {!isMock && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>Connecting</span>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            color: stompState.isConnecting ? "#fbbf24" : "#64748b",
                          }}
                        >
                          {stompState.isConnecting ? "Yes" : "No"}
                        </span>
                      </div>
                    )}

                    {!isMock && stompState.error && (
                      <div
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          borderRadius: "8px",
                          padding: "8px 10px",
                          marginTop: "4px",
                        }}
                      >
                        <div style={{ fontSize: "10px", color: "#f87171", fontWeight: 600, marginBottom: "2px" }}>
                          Error: {stompState.error.code}
                        </div>
                        <div style={{ fontSize: "10px", color: "#fca5a5" }}>{stompState.error.message}</div>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>Mode</span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          background: modeBadgeColor,
                          color: modeBadgeTextColor,
                          padding: "2px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        {modeBadgeLabel}
                      </span>
                    </div>

                    {!isMock && activeTarget.wsUrl && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>WS URL</span>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#64748b",
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={activeTarget.wsUrl}
                        >
                          {activeTarget.wsUrl}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(251, 191, 36, 0.08)",
                    border: "1px solid rgba(251, 191, 36, 0.15)",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    fontSize: "10px",
                    color: "#fbbf24",
                    lineHeight: 1.6,
                  }}
                >
                  모드 전환 시 기존 구독이 재설정될 수 있습니다.
                  <br />
                  Prod → Mock 전환 시 기존 STOMP 연결이 해제됩니다.
                </div>
              </div>
            )}

            {activeTab === "quick" && (
              <div>
                {!isMock && (
                  <div
                    style={{
                      background: "rgba(251, 191, 36, 0.1)",
                      border: "1px solid rgba(251, 191, 36, 0.2)",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      marginBottom: "10px",
                      fontSize: "10px",
                      color: "#fbbf24",
                    }}
                  >
                    Prod 모드에서는 빠른 전송이 Mock 채널로만 발송됩니다. 모드 탭에서 Mock으로 전환해 주세요.
                  </div>
                )}

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

            {activeTab === "custom" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {!isMock && (
                  <div
                    style={{
                      background: "rgba(251, 191, 36, 0.1)",
                      border: "1px solid rgba(251, 191, 36, 0.2)",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      fontSize: "10px",
                      color: "#fbbf24",
                    }}
                  >
                    Prod 모드에서는 커스텀 이벤트가 Mock 채널로만 발송됩니다.
                  </div>
                )}
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
                  이벤트 전송
                </button>
              </div>
            )}

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
                      초기화
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
