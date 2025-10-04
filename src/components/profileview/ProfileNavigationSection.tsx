import type { ProfileNavigationSectionProps } from "@/components/profileview";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProfileCard } from "./ProfileCard";

export const ProfileNavigationSection = ({
  currentProfile,
  currentIndex,
  totalCount,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: ProfileNavigationSectionProps) => {
  return (
    <section
      className="relative flex w-full max-w-md flex-1 items-center"
      aria-label={`프로필 ${currentIndex + 1} / ${totalCount}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="sr-only">
        {currentProfile.name}님의 프로필을 보고 있습니다. 전체 {totalCount}명 중 {currentIndex + 1}번째 프로필입니다.
      </span>
      <nav
        className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-between md:flex"
        aria-label="프로필 탐색"
      >
        {canGoPrev && (
          <button
            onClick={onPrev}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/30"
            aria-label="이전 프로필 보기"
          >
            <ChevronLeft />
          </button>
        )}
        <div className="flex-1" />
        {canGoNext && (
          <button
            onClick={onNext}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/30"
            aria-label="다음 프로필 보기"
          >
            <ChevronRight />
          </button>
        )}
      </nav>

      <div className="flex flex-1 items-center justify-center">
        <ProfileCard profile={currentProfile} />
      </div>
    </section>
  );
};
