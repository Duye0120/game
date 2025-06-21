import {
  createBrowserRouter,
} from 'react-router';

// 导入页面组件
import Folder from './pages/Folder';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import SchulteGrid from './pages/SchulteGrid';
import Snake3D from './pages/Snake3d';
import Root from './root';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'game/schulte-grid',
        element: <SchulteGrid />,
      },
      {
        path: 'game/snake-3d',
        element: <Snake3D />,
      },
      {
        path: 'game/folder',
        element: <Folder />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
