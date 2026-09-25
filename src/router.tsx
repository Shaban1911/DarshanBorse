import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},
    // TanStack treats the very first render as a navigation and scrolls to the
    // top on hydration — which yanks a visitor who started scrolling before
    // React arrived (hydration trails first paint on slow connections). The
    // function form is consulted before any scrolling, so returning false for
    // that first render alone skips it; later navigations restore/reset as usual.
    scrollRestoration: (() => {
      let firstRender = true;
      return () => {
        if (firstRender) {
          firstRender = false;
          return false;
        }
        return true;
      };
    })(),
    defaultPreloadStaleTime: 0,
  });

  return router;
};
