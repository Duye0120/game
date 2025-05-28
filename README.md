# 游戏世界 - React Router v7 框架模式

这是一个基于React Router v7框架模式的游戏平台项目，提供了多种小游戏体验。

## 🎯 项目特点

- **React Router v7 框架模式**: 使用最新的React Router v7客户端框架模式
- **TypeScript**: 全程类型安全开发
- **Tailwind CSS**: 现代化UI设计
- **Radix UI**: 高质量组件库
- **响应式设计**: 支持桌面端和移动端

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # 通用组件
│   ├── ui/             # UI组件库
│   └── GameButton.tsx  # 游戏启动按钮
├── Layout/             # 布局组件
│   └── index.tsx       # 主布局
├── pages/              # 页面组件
│   ├── Home.tsx        # 首页
│   ├── SchulteGrid.tsx # 舒尔特方格游戏
│   └── NotFound.tsx    # 404页面
├── lib/                # 工具函数
├── main.tsx           # 应用入口
├── root.tsx           # 根组件
└── index.css          # 全局样式
```

## 🎮 游戏列表

### 舒尔特方格
- **路径**: `/game/schulte-grid`
- **描述**: 经典的注意力训练游戏
- **功能**: 
  - 多种网格大小 (3×3, 5×5, 9×9)
  - 三种难度级别
  - 游戏记录保存
  - 实时统计

## 🔄 项目重构说明

本项目已从React Router v7的SSR模式重构为客户端框架模式：

### 重构内容

1. **移除SSR相关文件**:
   - 删除 `src/entry.client.tsx`
   - 删除 `src/routes.ts`
   - 移除 `@react-router/dev` 相关配置

2. **更新配置文件**:
   - 更新 `vite.config.ts` 使用标准React插件
   - 更新 `index.html` 添加正确的根元素和脚本引用

3. **重构路由系统**:
   - 创建新的 `src/main.tsx` 作为应用入口
   - 使用 `createBrowserRouter` 和 `RouterProvider`
   - 统一路由导入路径为 `react-router`

4. **优化组件**:
   - 移除SSR特定的hooks
   - 清理未使用的导入
   - 确保类型安全

### 框架模式优势

- **更简单的配置**: 无需复杂的SSR设置
- **更快的开发体验**: 客户端路由，页面切换更流畅
- **更容易部署**: 静态文件部署即可
- **更好的开发工具支持**: 完整的Vite+React开发体验

## 🛠 技术栈

- **前端框架**: React 19
- **路由**: React Router v7 (框架模式)
- **类型检查**: TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS v4
- **UI组件**: Radix UI + Lucide React
- **代码规范**: ESLint + TypeScript ESLint

## 📦 依赖说明

### 核心依赖
- `react` & `react-dom`: React核心库
- `react-router`: React Router v7路由库
- `tailwindcss`: CSS框架
- `@radix-ui/*`: UI组件库

### 开发依赖
- `vite`: 构建工具
- `typescript`: 类型检查
- `eslint`: 代码检查
- `@vitejs/plugin-react-swc`: React插件

## 🔧 开发指南

### 添加新游戏

1. 在 `src/pages/` 下创建新的游戏组件
2. 在 `src/main.tsx` 中添加路由配置
3. 在 `src/pages/Home.tsx` 中添加游戏卡片
4. 更新 `src/components/GameButton.tsx` 的路由映射

### 样式开发

项目使用Tailwind CSS v4，支持：
- 响应式设计
- 暗色模式
- 自定义动画
- 组件变体

## 📝 更新日志

### v0.0.1 (2024-01-16)
- 重构为React Router v7框架模式
- 优化项目结构
- 改进开发体验
- 添加完整的TypeScript支持

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
