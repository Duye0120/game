import {
  type RouteConfig,
  index,
  route
} from "@react-router/dev/routes";

export default [
  index("pages/Home.tsx"),
  route("game/schulte-grid", "pages/SchulteGrid.tsx"),
  route("*", "pages/NotFound.tsx"),
] satisfies RouteConfig;
