import type { WaitingRoomCodeProps } from "@/components/waitingroom/types";
import { showToast } from "@/utils/toast";
import { Copy } from "lucide-react";
import QRCode from "react-qr-code";

export const WaitingRoomQRCode = ({ roomId }: WaitingRoomCodeProps) => {
  const shareUrl =
    typeof window !== "undefined"
      ? roomId
        ? `${window.location.origin}/waiting-room/${encodeURIComponent(roomId)}`
        : window.location.href
      : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast.success("링크가 클립보드에 복사되었습니다.");
    } catch {
      showToast.error("링크 복사에 실패했습니다.");
    }
  };

  return (
    <section className="flex flex-col items-center gap-4 rounded-xl bg-white p-8" aria-labelledby="qr-title">
      <h2 id="qr-title" className="sr-only">
        참여용 QR코드
      </h2>
      <div role="img" aria-label={`QR코드: ${shareUrl}로 연결됩니다. 스캔하여 방에 참여하세요`} className="rounded">
        <QRCode size={200} value={shareUrl} viewBox="0 0 256 256" />
      </div>
      <button
        type="button"
        onClick={handleCopyLink}
        aria-label="참여 링크를 클립보드에 복사"
        className="focus:ring-primary flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
      >
        <Copy size={16} aria-hidden="true" />
        <span>링크 복사</span>
      </button>
    </section>
  );
};
