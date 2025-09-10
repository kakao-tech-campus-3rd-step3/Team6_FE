import { AppScreen } from "@stackflow/plugin-basic-ui";
import type { ActivityComponentType } from "@stackflow/react/future";

const ManittoPage: ActivityComponentType<"ManittoPage"> = () => {
  return (
    <AppScreen appBar={{ title: "마니또" }}>
      <main className="bg-gradient-primary min-h-screen p-4">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl">마니또 페이지</h1>
        </div>
      </main>
    </AppScreen>
  );
};

export default ManittoPage;
