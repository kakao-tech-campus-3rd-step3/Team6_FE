import { type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      <div className="max-w-xl mx-auto px-4 md:max-w-md lg:max-w-lg bg-gradient-primary">
        {children}
      </div>
    </div>
  );
};
