import { Button } from "@/components/common";
import { INTERESTS, type InterestType } from "@/constants";
import { useMultiSelection } from "@/hooks";

interface ProfileInterestsProps {
  interests: InterestType[];
  onInterestsChange: (interests: InterestType[]) => void;
}

export const ProfileInterests = ({ interests, onInterestsChange }: ProfileInterestsProps) => {
  const { toggleSelection, isSelected } = useMultiSelection<InterestType>(interests, onInterestsChange);

  return (
    <section className="space-y-4">
      <fieldset>
        <legend className="pb-2 text-lg font-semibold">관심사</legend>
        <div className="grid grid-cols-4 gap-2">
          {INTERESTS.map((interest) => (
            <Button
              key={interest}
              variant={isSelected(interest) ? "main" : "text"}
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
