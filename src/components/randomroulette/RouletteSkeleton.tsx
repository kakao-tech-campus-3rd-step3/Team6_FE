export const RouletteSkeleton = () => {
  return (
    <section className="flex w-full flex-col items-center gap-6" aria-label="룰렛 로딩 중">
      <div className="relative">
        <div
          className="relative h-[300px] w-[300px] animate-pulse rounded-full border-4 border-gray-300 bg-gray-200 shadow-lg"
          role="img"
          aria-label="룰렛 로딩 중"
        />
      </div>

      <div className="h-12 w-[200px] animate-pulse rounded-xl bg-gray-200" />
    </section>
  );
};
