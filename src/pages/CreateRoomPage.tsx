import { RoomInfoSection, PurposeSelection, CreateRoomAction } from "@/components/createroom";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react";

const CreateRoomPage: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "방 만들기" }}>
      <main className="bg-gradient-primary space-y-4 p-4 pb-8">
        <RoomInfoSection />
        <PurposeSelection />
        <CreateRoomAction />
      </main>
    </AppScreen>
  );
};

export default CreateRoomPage;
