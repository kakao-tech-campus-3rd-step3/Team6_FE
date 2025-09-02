import { Button } from "@/components/common";
import { useMultiSelection } from "@/hooks";

const interests = [
  "#스포츠",
  "#음악",
  "#영화",
  "#독서",
  "#여행",
  "#요리",
  "#게임",
  "#사진",
  "#운동",
  "#카페",
  "#쇼핑",
  "#반려동물",
] as const;

export const ProfileInterests = () => {
  const { toggleSelection, isSelected } = useMultiSelection<string>();

  return (
    <section className="space-y-4">
      <fieldset>
        <legend className="text-lg font-semibold">관심사</legend>
        <div className="grid grid-cols-4 gap-2">
          {interests.map((interest) => (
            <Button
              key={interest}
              variant={isSelected(interest) ? "primary" : "outline"}
              onClick={() => toggleSelection(interest)}
              className="h-10 text-base"
              aria-pressed={isSelected(interest)}
            >
              {interest}
            </Button>
          ))}
        </div>
      </fieldset>
    </section>
  );
};
