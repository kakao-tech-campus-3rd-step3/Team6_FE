export const ROOM_PURPOSE = [
  { id: "business", title: "공적인", description: "업무나 학업 관련 가벼운 대화" },
  { id: "personal", title: "사적인", description: "취미나 관심사에 대한 대화" },
  { id: "drinking", title: "술자리", description: "편안하고 재미있는 분위기" },
] as const;

export type PurposeId = (typeof ROOM_PURPOSE)[number]["id"];

export const MIN_PARTICIPANT = 2;
export const MAX_PARTICIPANT = 20;
