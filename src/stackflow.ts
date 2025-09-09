import LandingPage from "@/pages/LandingPage";
import ProfileCheckPage from "@/pages/ProfileCheckPage";
import ProfilePage from "@/pages/ProfilePage";
import RandomRoulettePage from "@/pages/RandomRoulettePage";
import ProfileViewPage from "@/pages/ProfileViewPage";
import WaitingRoomPage from "@/pages/WaitingRoomPage";
import MenuSelectPage from "./pages/MenuSelectPage";
import TopicRecommendPage from "./pages/TopicRecommendPage";
import { config } from "@/stackflow.config";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { lazy, stackflow } from "@stackflow/react/future";

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
    TopicRecommendPage,
  },

  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      theme: "cupertino",
    }),
  ],
});
