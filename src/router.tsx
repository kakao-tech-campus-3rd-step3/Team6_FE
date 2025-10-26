import { AnimatedRoutes } from "@/components/routing/AnimatedRoutes";
import CreateRoomPage from "@/pages/CreateRoomPage";
import LandingPage from "@/pages/LandingPage";
import MenuSelectPage from "@/pages/MenuSelectPage";
import ProfileCheckPage from "@/pages/ProfileCheckPage";
import ProfilePage from "@/pages/ProfilePage";
import ProfileViewPage from "@/pages/ProfileViewPage";
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
        lazy: async () => {
          const RandomRoulettePage = await import("@/pages/RandomRoulettePage");
          return {
            Component: RandomRoulettePage.default,
          };
        },
      },
      {
        path: "manitto",
        lazy: async () => {
          const ManittoPage = await import("@/pages/ManittoPage");
          return {
            Component: ManittoPage.default,
          };
        },
      },
      {
        path: "topic-recommend",
        lazy: async () => {
          const TopicRecommendPage = await import("@/pages/TopicRecommendPage");
          return {
            Component: TopicRecommendPage.default,
          };
        },
      },
      {
        path: "ending",
        lazy: async () => {
          const EndingPage = await import("@/pages/EndingPage");
          return {
            Component: EndingPage.default,
          };
        },
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
