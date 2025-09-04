import QRCode from "react-qr-code";

// interface WaitingRoomQRCodeProps {
//   roomId: string; // TODO: 방 생성 시 받아올 roomId
// }

export const WaitingRoomQRCode = () => {
  // TODO: 실제 배포 환경에서의 도메인으로 변경 필요
  //   const shareUrl = `${window.location.origin}?roomId=${roomId}`;
  const url = window.location.href;
  // TODO: 구현 예정 기능들
  // 1. 앱 초기 로딩 시 URL의 roomId parameter 체크
  // 2. QR 스캔 참여자 플로우 결정:
  //    - 옵션1: 프로필 설정 페이지 → 대기실
  //    - 옵션2: 대기실 → 프로필 설정 → 다음 단계
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
        aria-label={`QR코드: ${url}로 연결됩니다. 스캔하여 방에 참여하세요`}
        className="focus:ring-primary rounded focus:ring-2 focus:outline-none"
        tabIndex={0}
      >
        <QRCode size={200} value={url} viewBox="0 0 256 256" />
      </div>
      {/* TODO: 개발 환경에서 QR코드 대신 링크 복사 기능 추가 고려 */}
    </section>
  );
};
