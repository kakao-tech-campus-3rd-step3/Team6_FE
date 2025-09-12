export const INTERESTS = [
  "음악",
  "영화",
  "스포츠",
  "여행",
  "음식",
  "기술",
  "게임",
  "도서",
  "예술",
  "사진",
  "패션",
  "피트니스",
  "건강",
  "야외활동",
  "등산",
  "자전거",
  "달리기",
  "수영",
  "요리",
  "반려동물",
] as const;

export type InterestType = (typeof INTERESTS)[number];
