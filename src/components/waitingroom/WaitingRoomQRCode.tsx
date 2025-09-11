import type { WaitingRoomCodeProps } from "@/components/waitingroom/types";
import QRCode from "react-qr-code";

export const WaitingRoomQRCode = ({ roomId }: WaitingRoomCodeProps) => {
  // 방 참여를 위한 URL 생성
  const shareUrl = roomId ? `${window.location.origin}?roomId=${roomId}` : window.location.href;
  // TODO: 구현 예정 기능들
  // 1. 앱 초기 로딩 시 URL의 roomId parameter 체크
  // 2. QR 스캔 참여자 플로우 결정:
  //    - 옵션1: 프로필 설정 페이지 → 대기실
  //    - 옵션2: 대기실 → 프로필 설정 → 다음 단계
  // 2-1. QR URL은 배포 url 기준 roomId까지 하고 isHost=false로 보내기
  // 2-2. QR URL은 링크를 복사해서 URL에 직접 입력해서 들어올 수 있도록
  // 3. roomId가 있으면 해당 플로우의 첫 번째 activity로 이동
  // 4. 웹소켓 연결하여 해당 방에 참여
  // 5. 방장/참여자 구분 및 상태 관리
  // 6. stackflow에서 activity 간 roomId 데이터 전달 처리

  return (
    <section className="flex flex-col items-center gap-4 rounded-xl bg-white p-8" aria-labelledby="qr-title">
      <h2 id="qr-title" className="sr-only">
        참여용 QR코드
      </h2>
      <div
        role="img"
        aria-label={`QR코드: ${shareUrl}로 연결됩니다. 스캔하여 방에 참여하세요`}
        className="focus:ring-primary rounded focus:ring-2 focus:outline-none"
        tabIndex={0}
      >
        <QRCode size={200} value={shareUrl} viewBox="0 0 256 256" />
      </div>
      {/* TODO: 개발 환경에서 QR코드 대신 링크 복사 기능 추가 고려 */}
    </section>
  );
};
