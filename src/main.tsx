import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
} from "react-router";
import "./index.css";

// 导入路由配置
import { router } from "./routes";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
); 
