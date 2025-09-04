import { type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return <div className="relative mx-auto min-h-dvh w-full lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">{children}</div>;
};
