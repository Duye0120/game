import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import "./index.css";

// 导入页面组件
import Root from "./root";
import Home from "./pages/Home";
import SchulteGrid from "./pages/SchulteGrid";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
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

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
); 
