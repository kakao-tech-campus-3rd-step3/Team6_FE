import type { MBTI } from "@/types/mbti";

const MAX_MBTI_LENGTH = 4;

export const useMbti = (mbti: MBTI | "", onMbtiChange: (mbti: MBTI | "") => void) => {
  const getMbtiSelections = (mbti: string) => {
    return {
      EI: mbti[0] || "",
      SN: mbti[1] || "",
      TF: mbti[2] || "",
      JP: mbti[3] || "",
    };
  };

  const isValidMBTI = (mbti: string): mbti is MBTI => {
    return mbti.length === MAX_MBTI_LENGTH && /^[EI][SN][TF][JP]$/.test(mbti);
  };

  const handleSelection = (option: string, dimension: string) => {
    const selections = getMbtiSelections(mbti);
    const newSelections = { ...selections, [dimension as keyof typeof selections]: option };
    const newMbti = `${newSelections.EI}${newSelections.SN}${newSelections.TF}${newSelections.JP}` as MBTI;

    if (isValidMBTI(newMbti)) {
      onMbtiChange(newMbti);
    } else {
      onMbtiChange("");
    }
  };

  const isSelected = (option: string, dimension: string) => {
    const selections = getMbtiSelections(mbti);
    return selections[dimension as keyof typeof selections] === option;
  };

  return {
    handleSelection,
    isSelected,
  };
};
