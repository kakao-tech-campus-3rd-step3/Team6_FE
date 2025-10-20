import { CreateRoomAction, PurposeSelection, RoomInfoSection } from "@/components/createroom";
import { useCreateRoomForm } from "@/hooks/createroom";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react";
import { FormProvider } from "react-hook-form";

const CreateRoomPage: ActivityComponentType = () => {
  const { methods, isFormValid } = useCreateRoomForm();

  return (
    <AppScreen appBar={{ title: "방 만들기" }}>
      <FormProvider {...methods}>
        <main className="bg-gradient-primary min-h-screen space-y-4 p-4 pb-8">
          <RoomInfoSection />
          <PurposeSelection />
          <CreateRoomAction isFormValid={isFormValid} />
        </main>
      </FormProvider>
    </AppScreen>
  );
};

export default CreateRoomPage;
