import type { SectionProps } from "@/components/dev/types";

export const Section = ({ title, children }: SectionProps) => {
  return (
    <div className="mb-4">
      <div className="mb-2 text-[11px] font-bold tracking-wide text-gray-400 uppercase">{title}</div>
      {children}
    </div>
  );
};
