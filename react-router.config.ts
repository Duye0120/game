import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: false,
  // 确保客户端路由正常工作
  basename: "/",
} satisfies Config;
