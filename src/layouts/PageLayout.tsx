import { ChevronLeft } from "lucide-react";
import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface PageLayoutProps {
  children: ReactNode;
  appBar?: {
    title: string;
    showBackButton?: boolean;
    backButton?: {
      onClick?: () => void;
      render?: () => ReactNode;
    };
  };
}

export const PageLayout = ({ children, appBar }: PageLayoutProps) => {
  const navigate = useNavigate();

  const shouldShowBackButton = appBar?.showBackButton !== false;
  const defaultBackButtonClick = () => navigate(-1);

  return (
    <div className="page-layout">
      {appBar && (
        <header className="sticky top-0 z-50 flex h-14 items-center justify-center border-b border-gray-200 bg-white px-4 text-center">
          {shouldShowBackButton && (
            <div className="absolute left-4">
              {appBar.backButton?.render ? (
                appBar.backButton.render()
              ) : (
                <button
                  onClick={appBar.backButton?.onClick || defaultBackButtonClick}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
                  aria-label="뒤로 가기"
                >
                  <ChevronLeft size={30} />
                </button>
              )}
            </div>
          )}
          <h1 className="text-lg font-semibold">{appBar.title}</h1>
        </header>
      )}
      {children}
    </div>
  );
};
