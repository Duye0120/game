import {
  createBrowserRouter,
} from "react-router";

// 导入页面组件
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SchulteGrid from "./pages/SchulteGrid";
import ChristmasTree from "./pages/ChristmasTree";
import Root from "./root";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "game/schulte-grid",
        element: <SchulteGrid />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  // 圣诞树页面独立，不使用 Layout
  {
    path: "game/christmas-tree",
    element: <ChristmasTree />,
  },
]); 
