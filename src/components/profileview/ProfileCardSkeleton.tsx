export const ProfileCardSkeleton = () => {
  return (
    <article
      className="mb-6 h-[470px] w-[300px] max-w-sm rounded-2xl bg-white px-6 py-5 shadow-md"
      aria-label="프로필 로딩 중"
    >
      <header className="mb-4 flex justify-center">
        <div className="h-25 w-25 animate-pulse rounded-full bg-gray-200 shadow-md" />
      </header>

      <div className="mb-4 flex justify-center">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
      </div>

      <section className="mb-4 flex justify-center space-x-4" aria-label="기본 정보 로딩 중">
        <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
      </section>

      <section className="mb-6" aria-label="관심사 로딩 중">
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-7 w-16 animate-pulse rounded-full bg-gray-200" />
          ))}
        </div>
      </section>

      <section aria-label="한줄 소개 로딩 중">
        <div className="mb-2 h-4 w-20 animate-pulse rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
        </div>
      </section>
    </article>
  );
};
