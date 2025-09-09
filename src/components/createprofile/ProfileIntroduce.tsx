const MAX_LENGTH = 100;
const MAX_ROW = 3;

interface ProfileIntroduceProps {
  introduction: string;
  onIntroductionChange: (introduction: string) => void;
}

export const ProfileIntroduce = ({ introduction, onIntroductionChange }: ProfileIntroduceProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onIntroductionChange(e.target.value);
  };

  return (
    <section className="space-y-4">
      <h3 id="profile-introduce-label" className="text-lg font-semibold">
        한줄 소개
      </h3>
      <div>
        <textarea
          id="profile-introduce"
          placeholder="자신을 간단히 소개해주세요"
          className="w-full rounded-xl bg-white p-2 shadow-sm"
          value={introduction}
          onChange={handleChange}
          maxLength={MAX_LENGTH}
          aria-describedby="character-count"
          aria-labelledby="profile-introduce-label"
          rows={MAX_ROW}
        />
        <div id="character-count" className="mt-1 text-right text-sm text-gray-500" aria-live="polite">
          {introduction.length}/{MAX_LENGTH}
        </div>
      </div>
    </section>
  );
};
