import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

const buttonVariants = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  outline: "border-primary text-primary border-2 bg-transparent",
} as const;

const Button = ({ className, variant = "primary", type = "button", ...props }: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn("h-15 w-full rounded-lg text-xl transition-colors", buttonVariants[variant], className)}
      {...props}
    />
  );
};

export { Button };
export type { ButtonProps };
