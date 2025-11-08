import { AnimatedRoutes } from "@/components/routing/AnimatedRoutes";
import CreateRoomPage from "@/pages/CreateRoomPage";
import EndingPage from "@/pages/EndingPage";
import LandingPage from "@/pages/LandingPage";
import ManittoPage from "@/pages/ManittoPage";
import MenuSelectPage from "@/pages/MenuSelectPage";
import ProfileCheckPage from "@/pages/ProfileCheckPage";
import ProfilePage from "@/pages/ProfilePage";
import ProfileViewPage from "@/pages/ProfileViewPage";
import RandomRoulettePage from "@/pages/RandomRoulettePage";
import TopicRecommendPage from "@/pages/TopicRecommendPage";
import WaitingRoomPage from "@/pages/WaitingRoomPage";
import { authLoader } from "@/utils/authLoader";
import { type RouteObject, createBrowserRouter } from "react-router-dom";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AnimatedRoutes />,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: "profile",
        Component: ProfilePage,
      },
      {
        path: "create-room",
        Component: CreateRoomPage,
      },
      {
        path: "waiting-room/:roomId",
        Component: WaitingRoomPage,
        loader: authLoader,
      },
      {
        path: "profile-check",
        Component: ProfileCheckPage,
      },
      {
        path: "profile-view",
        Component: ProfileViewPage,
      },

      {
        path: "menu",
        Component: MenuSelectPage,
      },
      {
        path: "random-roulette",
        Component: RandomRoulettePage,
      },
      {
        path: "manitto",
        Component: ManittoPage,
      },
      {
        path: "topic-recommend",
        Component: TopicRecommendPage,
      },
      {
        path: "ending",
        Component: EndingPage,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
