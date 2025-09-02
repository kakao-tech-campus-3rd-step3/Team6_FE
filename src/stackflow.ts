import LandingPage from "@/pages/LandingPage";
import ProfilePage from "@/pages/ProfilePage";
import { config } from "@/stackflow.config";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { lazy, stackflow } from "@stackflow/react/future";

export const { Stack } = stackflow({
  config,
  components: {
    LandingPage,
    ProfilePage,
    CreateRoomPage: lazy(() => import("./pages/CreateRoomPage")),
  },

  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      theme: "cupertino",
    }),
  ],
});
