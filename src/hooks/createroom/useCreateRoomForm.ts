import { MAX_PARTICIPANT, MIN_PARTICIPANT } from "@/constants";
import { useSingleSelection } from "@/hooks";
import type { CreateRoomFormData } from "@/hooks/createroom";
import { useMemo, useState } from "react";

const initialFormData: CreateRoomFormData = {
  roomName: "",
  capacity: 2,
  purpose: "",
};

export const useCreateRoomForm = () => {
  const [formData, setFormData] = useState<CreateRoomFormData>(initialFormData);
  const {
    selectItem: selectPurpose,
    isSelected: isPurposeSelected,
    selection: selectedPurpose,
  } = useSingleSelection<CreateRoomFormData["purpose"]>();

  const updateRoomName = (roomName: string) => {
    setFormData((prev) => ({ ...prev, roomName }));
  };

  const updateCapacity = (capacity: number) => {
    if (isNaN(capacity)) {
      setFormData((prev) => ({ ...prev, capacity: 2 }));
    } else {
      setFormData((prev) => ({ ...prev, capacity }));
    }
  };

  const updatePurpose = (purpose: CreateRoomFormData["purpose"]) => {
    selectPurpose(purpose);
  };

  const finalFormData = useMemo(
    () => ({
      ...formData,
      purpose: (selectedPurpose || "") as CreateRoomFormData["purpose"],
    }),
    [formData, selectedPurpose],
  );

  const isFormValid = useMemo(() => {
    return (
      finalFormData.roomName.trim() !== "" &&
      finalFormData.capacity >= MIN_PARTICIPANT &&
      finalFormData.capacity <= MAX_PARTICIPANT &&
      finalFormData.purpose !== ""
    );
  }, [finalFormData]);

  return {
    formData: finalFormData,
    updateRoomName,
    updateCapacity,
    updatePurpose,
    isPurposeSelected,
    isFormValid,
  };
};
