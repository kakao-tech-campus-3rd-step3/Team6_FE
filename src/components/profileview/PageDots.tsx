import type { PageDotsProps } from "@/components/profileview";

export const PageDots = ({ totalCount, currentIndex }: PageDotsProps) => {
  return (
    <div className="mb-5 flex space-x-2">
      {Array.from({ length: totalCount }, (_, index) => (
        <div
          key={index}
          className={`h-2 w-2 rounded-full transition-colors duration-300 ${
            index === currentIndex ? "bg-primary" : "bg-opacity-30 bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
};
