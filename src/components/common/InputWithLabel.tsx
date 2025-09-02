import { cn } from "@/utils/cn";

interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const InputWithLabel = ({ label, className, id, ...props }: InputWithLabelProps) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="pb-2 text-lg font-semibold text-black">
        {label}
      </label>
      <input
        id={id}
        className={cn("h-12 rounded-xl border-none bg-white px-4 text-lg shadow-md", className)}
        {...props}
      />
    </div>
  );
};
