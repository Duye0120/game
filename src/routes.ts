import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  index("pages/Home.tsx"),
  route("games", "pages/Games.tsx"),
  route("about", "pages/About.tsx"),
  route("*", "pages/NotFound.tsx"),
] satisfies RouteConfig;
