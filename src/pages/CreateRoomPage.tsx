import { CreateRoomAction, PurposeSelection, RoomInfoSection } from "@/components/createroom";
import { useCreateRoomForm } from "@/hooks/createroom";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react";

const CreateRoomPage: ActivityComponentType = () => {
  const { formData, updateRoomName, updateCapacity, updatePurpose, isFormValid } = useCreateRoomForm();

  return (
    <AppScreen appBar={{ title: "방 만들기" }}>
      <main className="bg-gradient-primary space-y-4 p-4 pb-8">
        <RoomInfoSection
          roomName={formData.roomName}
          capacity={formData.capacity}
          onRoomNameChange={updateRoomName}
          onCapacityChange={updateCapacity}
        />
        <PurposeSelection selectedPurpose={formData.purpose || ""} onPurposeChange={updatePurpose} />
        <CreateRoomAction formData={formData} isFormValid={isFormValid} />
      </main>
    </AppScreen>
  );
};

export default CreateRoomPage;
