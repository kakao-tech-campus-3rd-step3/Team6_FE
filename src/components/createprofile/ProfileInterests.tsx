import { Button } from "@/components/common";
import { INTERESTS } from "@/constants";
import { useMultiSelection } from "@/hooks";

export const ProfileInterests = () => {
  const { toggleSelection, isSelected } = useMultiSelection<string>();

  return (
    <section className="space-y-4">
      <fieldset>
        <legend className="text-lg font-semibold">관심사</legend>
        <div className="grid grid-cols-4 gap-2">
          {INTERESTS.map((interest) => (
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
