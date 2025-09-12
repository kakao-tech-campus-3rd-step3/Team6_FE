import LandingPage from "@/pages/LandingPage";
import ManittoPage from "@/pages/ManittoPage";
import ProfileCheckPage from "@/pages/ProfileCheckPage";
import ProfilePage from "@/pages/ProfilePage";
import ProfileViewPage from "@/pages/ProfileViewPage";
import RandomRoulettePage from "@/pages/RandomRoulettePage";
import WaitingRoomPage from "@/pages/WaitingRoomPage";
import { config } from "@/stackflow.config";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { lazy, stackflow } from "@stackflow/react/future";

import EndingPage from "./pages/EndingPage";
import MenuSelectPage from "./pages/MenuSelectPage";
import TopicRecommendPage from "./pages/TopicRecommendPage";

export const { Stack } = stackflow({
  config,
  components: {
    LandingPage,
    ProfilePage,
    ProfileCheckPage,
    ProfileViewPage,
    ManittoPage,
    CreateRoomPage: lazy(() => import("./pages/CreateRoomPage")),
    MenuSelectPage,
    WaitingRoomPage,
    RandomRoulettePage,
    EndingPage,
    TopicRecommendPage,
  },

  plugins: [
    basicRendererPlugin(),
    historySyncPlugin({
      config,
      fallbackActivity: () => "LandingPage",
    }),
    basicUIPlugin({
      theme: "cupertino",
    }),
  ],
});
