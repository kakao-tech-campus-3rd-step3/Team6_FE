import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

const buttonVariants = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  outline: "border-primary text-primary border-2 bg-transparent",
} as const;

const Button = ({ className, variant = "primary", ...props }: ButtonProps) => {
  return (
    <button
      className={cn("h-15 w-full rounded-lg text-xl transition-colors", buttonVariants[variant], className)}
      {...props}
    />
  );
};

export { Button };
export type { ButtonProps };
