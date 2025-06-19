import {
  Outlet
} from "react-router";
import AppLayout from "./Layout";
import "./index.css";

export default function Root() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
