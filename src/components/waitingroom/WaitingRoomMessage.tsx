export const WaitingMessage = () => {
  return (
    <section className="text-center" aria-labelledby="waiting-title" aria-live="polite">
      <h1 id="waiting-title" className="mb-2 animate-pulse text-2xl font-bold">
        참가자를 기다리고 있어요
      </h1>
      <p className="text-sm text-gray-600" role="note">
        아래 QR코드를 스캔해서 참여해주세요
      </p>
    </section>
  );
};
