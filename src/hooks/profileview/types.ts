export interface Participant {
  id: number;
  name: string;
  age: number;
  mbtiType: string;
  interests: string[];
  introduction?: string;
}

export interface UseProfileNavigationOptions {
  totalCount: number;
  onComplete?: () => void;
}

export interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}
