import logo from "@/assets/logo.png";
import { Button } from "@/components/common";
import { PageLayout } from "@/layouts/PageLayout";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate("/profile?purpose=create-room");
  };

  const handleProfileSetup = () => {
    navigate("/profile");
  };

  const handleQRJoin = () => {
    // TODO: 배포 후 URL로 접근할 수 있도록 구현 예정
  };

  return (
    <PageLayout>
      <main className="bg-gradient-primary flex min-h-screen flex-col items-center px-4 pt-20 pb-8">
        <header className="flex flex-col items-center">
          <img src={logo} alt="아이스브레이킹 앱 로고" width={313} height={313} fetchPriority="high" />
          <h1 className="text-half pb-10 text-center text-xl font-semibold">
            처음 만나는 사람들과 <br />
            어색함을 빠르게 풀어보세요
          </h1>
        </header>

        <nav className="space-y-2">
          <Button onClick={handleCreateRoom}>방 만들기</Button>
          <Button onClick={handleProfileSetup}>프로필 설정</Button>
          <Button variant="border" onClick={handleQRJoin} disabled>
            QR로 참여하기
          </Button>
        </nav>
      </main>
    </PageLayout>
  );
};

export default LandingPage;
