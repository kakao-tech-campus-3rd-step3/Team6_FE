import type { MBTI } from "@/types/mbti";
import { useEffect, useState } from "react";

const MAX_MBTI_LENGTH = 4;
type MbtiDimension = "EI" | "SN" | "TF" | "JP";

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

  const [selections, setSelections] = useState(getMbtiSelections(mbti));

  useEffect(() => {
    setSelections(getMbtiSelections(mbti));
  }, [mbti]);

  const handleSelection = (option: string, dimension: MbtiDimension) => {
    const newSelections = { ...selections, [dimension]: option };
    setSelections(newSelections);
    const newMbti = `${newSelections.EI}${newSelections.SN}${newSelections.TF}${newSelections.JP}` as MBTI;

    if (isValidMBTI(newMbti)) {
      onMbtiChange(newMbti);
    } else {
      onMbtiChange("");
    }
  };

  const isSelected = (option: string, dimension: MbtiDimension) => {
    return selections[dimension] === option;
  };

  return {
    handleSelection,
    isSelected,
  };
};
