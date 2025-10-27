import { CreateRoomAction, PurposeSelection, RoomInfoSection } from "@/components/createroom";
import { useCreateRoomForm } from "@/hooks/createroom";
import { PageLayout } from "@/layouts/PageLayout";
import { FormProvider } from "react-hook-form";

const CreateRoomPage = () => {
  const { methods, isFormValid } = useCreateRoomForm();

  return (
    <PageLayout
      appBar={{
        title: "방 만들기",
      }}
    >
      <FormProvider {...methods}>
        <main className="bg-gradient-primary min-h-screen space-y-4 p-4 pb-8">
          <RoomInfoSection />
          <PurposeSelection />
          <CreateRoomAction isFormValid={isFormValid} />
        </main>
      </FormProvider>
    </PageLayout>
  );
};

export default CreateRoomPage;
