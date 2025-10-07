import { Check } from "lucide-react";

const ProfileCheckComplete = () => {
  return (
    <section className="mt-0 flex flex-col items-center space-y-4">
      <div className="bg-primary flex h-20 w-20 items-center justify-center rounded-full" aria-hidden="true">
        <Check className="h-8 w-8 text-white" />
      </div>
      <header className="text-center">
        <h1 className="mb-2 text-2xl font-bold text-black">모든 프로필 확인 완료!</h1>
        <p className="text-sm text-gray-600">이제 함께 아이스브레이킹을 시작해보세요</p>
      </header>
    </section>
  );
};

export default ProfileCheckComplete;
