import LandingPage from "@/pages/LandingPage";
import ProfilePage from "@/pages/ProfilePage";
import WaitingRoomPage from "@/pages/WaitingRoomPage";
import { config } from "@/stackflow.config";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { lazy, stackflow } from "@stackflow/react/future";
import MenuSelectPage from "./pages/MenuSelectPage";

export const { Stack } = stackflow({
  config,
  components: {
    LandingPage,
    ProfilePage,
    CreateRoomPage: lazy(() => import("./pages/CreateRoomPage")),
    MenuSelectPage,
    WaitingRoomPage,
  },

  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      theme: "cupertino",
    }),
  ],
});
