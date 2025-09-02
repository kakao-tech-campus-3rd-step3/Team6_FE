import { useRef } from "react";

const MAX_LENGTH = 100;

export const ProfileIntroduce = () => {
  const counterRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (counterRef.current) {
      counterRef.current.textContent = `${e.target.value.length}/${MAX_LENGTH}`;
    }
  };

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold">한줄 소개</h3>
      <div>
        <textarea
          id="profile-introduce"
          placeholder="자신을 간단히 소개해주세요"
          className="w-full rounded-xl bg-white p-2 shadow-sm"
          onChange={handleChange}
          maxLength={MAX_LENGTH}
          aria-describedby="character-count"
          rows={3}
        />
        <div id="character-count" ref={counterRef} className="mt-1 text-right text-sm text-gray-500" aria-live="polite">
          0/{MAX_LENGTH}
        </div>
      </div>
    </section>
  );
};
