import logo from "@/assets/logo.png";
import { Button } from "@/components/common";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react";
import { useFlow } from "@stackflow/react/future";

const LandingPage: ActivityComponentType = () => {
  const { push } = useFlow();

  const handleCreateRoom = () => {
    push("CreateRoomPage", { title: "방 만들기" });
  };

  const handleProfileSetup = () => {
    push("ProfilePage", { title: "프로필 설정" });
  };

  const handleQRJoin = () => {
    // TODO: QR 참여 기능 구현
    console.log("QR로 참여하기 - 미구현");
  };

  return (
    <AppScreen>
      <main className="bg-gradient-primary flex flex-col items-center px-4 pt-20 pb-8">
        <header className="flex flex-col items-center">
          <img src={logo} alt="아이스브레이킹 앱 로고" width={400} height={400} fetchPriority="high" />
          <h1 className="text-half pb-10 text-center text-xl font-semibold">
            처음 만나는 사람들과 <br />
            어색함을 빠르게 풀어보세요
          </h1>
        </header>

        <nav className="space-y-2">
          <Button onClick={handleCreateRoom}>방 만들기</Button>
          <Button onClick={handleProfileSetup}>프로필 설정</Button>
          <Button variant="outline" onClick={handleQRJoin} disabled>
            QR로 참여하기
          </Button>
        </nav>
      </main>
    </AppScreen>
  );
};

export default LandingPage;
