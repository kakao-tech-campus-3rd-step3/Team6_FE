import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "main" | "sub" | "border" | "text";
}

const buttonVariants = {
  main: "bg-primary text-white",
  sub: "bg-secondary text-primary",
  border: "border-primary text-primary border-2 bg-transparent",
  text: "border-none bg-white text-black",
} as const;

const Button = ({ className, variant = "main", type = "button", ...props }: ButtonProps) => {
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
