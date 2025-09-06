export const range = (start: number, end: number): number[] => {
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    throw new TypeError("range - 시작과 끝은 유한한 숫자여야 합니다.");
  }

  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    throw new TypeError("range - 시작과 끝은 정수여야 합니다.");
  }

  if (end < start) return [];

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};
