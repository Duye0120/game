import {
  Outlet,
  useNavigation
} from "react-router";
import AppLayout from "./Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import "./index.css";

export default function Root() {
  const navigation = useNavigation();
  
  // 检查是否正在导航（页面跳转）
  const isNavigating = navigation.state === "loading";

  return (
    <AppLayout>
      {isNavigating ? (
        <LoadingSpinner />
      ) : (
        <Outlet />
      )}
    </AppLayout>
  );
}
