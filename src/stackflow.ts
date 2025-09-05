import LandingPage from "@/pages/LandingPage";
import ProfileCheckPage from "@/pages/ProfileCheckPage";
import ProfilePage from "@/pages/ProfilePage";
import RandomRoulettePage from "@/pages/RandomRoulettePage";
import ProfileViewPage from "@/pages/ProfileViewPage";
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
    ProfileCheckPage,
    ProfileViewPage,
    CreateRoomPage: lazy(() => import("./pages/CreateRoomPage")),
    MenuSelectPage,
    WaitingRoomPage,
    RandomRoulettePage,
  },

  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      theme: "cupertino",
    }),
  ],
});
