import { Info } from "lucide-react";

export const RandomRouletteTip = () => {
  return (
    <aside
      className="flex flex-row items-start gap-3 rounded-lg border border-blue-200 bg-white p-4"
      role="complementary"
      aria-labelledby="tip-title"
    >
      <div className="mt-1 flex-shrink-0" aria-hidden="true">
        <Info size={20} className="text-blue-600" />
      </div>
      <div className="flex-1">
        <h4 id="tip-title" className="mb-1 text-sm font-semibold text-blue-800">
          사용 방법
        </h4>
        <ul className="space-y-1 text-sm text-blue-700" role="list">
          <li>룰렛을 돌려서 선택된 사람이 질문에 답해주세요.</li>
          <li>자연스럽게 대화를 이어가보세요!</li>
        </ul>
      </div>
    </aside>
  );
};
