import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const gamesSection = document.getElementById('games-section');
      
      if (gamesSection) {
        const gamesSectionTop = gamesSection.offsetTop - 100; // 提前100px开始检测
        const gamesSectionBottom = gamesSection.offsetTop + gamesSection.offsetHeight;
        const isInGamesSection = currentScrollY >= gamesSectionTop && currentScrollY <= gamesSectionBottom;
        
        if (isInGamesSection) {
          // 在游戏区域内，根据滚动方向决定是否显示导航栏
          if (currentScrollY > lastScrollY) {
            // 向下滚动，隐藏导航栏
            setIsNavVisible(false);
          } else {
            // 向上滚动，显示导航栏
            setIsNavVisible(true);
          }
        } else {
          // 不在游戏区域，始终显示导航栏
          setIsNavVisible(true);
        }
      } else {
        // 如果不在首页或找不到游戏区域，始终显示导航栏
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // 只在首页监听滚动事件
    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      // 非首页始终显示导航栏
      setIsNavVisible(true);
    }
  }, [lastScrollY, location.pathname]);

  const handleGamesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (location.pathname === '/') {
      // 如果在首页，直接滚动到游戏区域
      const gamesSection = document.getElementById('games-section');
      if (gamesSection) {
        gamesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // 如果不在首页，先跳转到首页然后滚动到游戏区域
      navigate('/');
      setTimeout(() => {
        const gamesSection = document.getElementById('games-section');
        if (gamesSection) {
          gamesSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const navigation = [
    { name: '首页', href: '/', icon: '🏠' },
    { name: '游戏', href: '/games', icon: '🎮', onClick: handleGamesClick },
  ];

  const isActive = (path: string) => {
    if (path === '/games') {
      // 游戏链接在首页时也显示为激活状态
      return location.pathname === '/' || location.pathname === '/games';
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 导航栏 */}
      <nav className={`bg-white shadow-lg sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <span className="text-xl font-bold text-gray-800">游戏世界</span>
            </Link>

            {/* 导航链接 */}
            <div className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                item.onClick ? (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )
              ))}
            </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900 p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* 移动端导航菜单 */}
          <div className="md:hidden border-t border-gray-200">
            <div className="py-2 space-y-1">
              {navigation.map((item) => (
                item.onClick ? (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className={`flex items-center space-x-2 px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 w-full text-left ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="flex-1">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🎯</span>
                <span className="text-xl font-bold">游戏世界</span>
              </div>
              <p className="text-gray-300 mb-4">
                为您提供最优质的游戏体验，连接全球玩家，创造无限乐趣。
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-300 hover:text-white text-2xl transition-colors">
                  📧
                </button>
                <button className="text-gray-300 hover:text-white text-2xl transition-colors">
                  🐦
                </button>
                <button className="text-gray-300 hover:text-white text-2xl transition-colors">
                  📘
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">快速链接</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">首页</Link></li>
                <li><button onClick={handleGamesClick} className="text-gray-300 hover:text-white transition-colors">游戏</button></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">关于我们</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">联系我们</h3>
              <ul className="space-y-2 text-gray-300">
                <li>📧 contact@gameworld.com</li>
                <li>📱 +86 123 4567 8900</li>
                <li>📍 北京市朝阳区游戏大厦</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 游戏世界. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
