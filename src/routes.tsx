import React from "react";
import {
  createBrowserRouter,
} from "react-router";

// 导入页面组件
import Root from "./root";
import Home from "./pages/Home";
import SchulteGrid from "./pages/SchulteGrid";
import NotFound from "./pages/NotFound";

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
]); 
