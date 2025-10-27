import { ConditionalStompProvider } from "@/context/ConditionalStompProvider";
import { AnimatePresence, motion } from "motion/react";
import { useLayoutEffect } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";

const pageVariants = {
  initial: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? "100%" : "-30%",
    zIndex: direction === "forward" ? 1 : 0,
  }),
  animate: (direction: "forward" | "backward") => ({
    x: 0,
    zIndex: direction === "forward" ? 1 : 0,
  }),
  exit: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? "-30%" : "100%",
    zIndex: direction === "forward" ? 0 : 1,
  }),
};

const pageTransition = {
  type: "tween" as const,
  ease: "easeOut" as const,
  duration: 0.25,
};

export const AnimatedRoutes = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  const direction = (location.state as { direction?: string })?.direction;
  const isBackward = direction === "back" || navigationType === "POP";
  const animationDirection = isBackward ? "backward" : "forward";

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ConditionalStompProvider>
      <div style={{ position: "relative", width: "100%", minHeight: "100vh", overflow: "hidden" }}>
        <AnimatePresence initial={false} mode="popLayout" custom={animationDirection}>
          <motion.div
            key={location.pathname}
            custom={animationDirection}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            style={{
              position: "absolute",
              width: "100%",
              height: "100vh",
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: "white",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <div
              style={{
                minHeight: "100%",
              }}
            >
              <Outlet />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </ConditionalStompProvider>
  );
};
