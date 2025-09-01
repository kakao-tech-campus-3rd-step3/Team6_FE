import { LandingPage, ProfilePage } from "@/pages";
import { CreateRoomPage } from "@/pages/CreateRoomPage";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { stackflow } from "@stackflow/react";

export const { Stack, useFlow } = stackflow({
  transitionDuration: 300,
  activities: {
    LandingPage,
    ProfilePage,
    CreateRoomPage,
  },
  initialActivity: () => "LandingPage",
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      theme: "cupertino",
    }),
  ],
});
