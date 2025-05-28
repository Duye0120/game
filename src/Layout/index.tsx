import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Menu, Home, Gamepad2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 检查当前是否在贪吃蛇游戏页面
  const isSnakeGamePage = location.pathname === '/game/snake-3d';

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

    // 只在首页监听滚动事件，且不在贪吃蛇游戏页面
    if (location.pathname === '/' && !isSnakeGamePage) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      // 非首页始终显示导航栏（除了贪吃蛇游戏页面）
      setIsNavVisible(!isSnakeGamePage);
    }
  }, [lastScrollY, location.pathname, isSnakeGamePage]);

  const handleGamesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // 关闭移动端菜单
    
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

  const handleHomeClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navigation = [
    { name: '首页', href: '/', icon: Home, onClick: handleHomeClick },
    { name: '游戏', href: '/games', icon: Gamepad2, onClick: handleGamesClick },
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
      {/* 导航栏 - 在贪吃蛇游戏页面时隐藏 */}
      {!isSnakeGamePage && (
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

              {/* 桌面端导航链接 */}
              <div className="hidden md:flex space-x-2">
                {navigation.map((item) => (
                  <Button
                    key={item.name}
                    variant={isActive(item.href) ? "default" : "ghost"}
                    onClick={item.onClick}
                    className="flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                ))}
              </div>

              {/* 移动端菜单按钮 */}
              <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">打开菜单</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <span className="text-2xl">🎯</span>
                        游戏世界
                      </SheetTitle>
                    </SheetHeader>
                    <Separator className="my-4" />
                    <div className="flex flex-col space-y-3">
                      {navigation.map((item) => (
                        <Button
                          key={item.name}
                          variant={isActive(item.href) ? "default" : "ghost"}
                          onClick={item.onClick}
                          className="justify-start gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* 主要内容区域 */}
      <main className={isSnakeGamePage ? "h-screen" : "flex-1"}>
        {children}
      </main>

      {/* 页脚 - 在贪吃蛇游戏页面时隐藏 */}
      {!isSnakeGamePage && (
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
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297L3.323 17.495c-.49.49-1.297.49-1.787 0s-.49-1.297 0-1.787l1.804-1.803c-.807-.875-1.297-2.026-1.297-3.323 0-2.652 2.155-4.807 4.807-4.807s4.807 2.155 4.807 4.807-2.155 4.807-4.807 4.807zm0-7.806c-1.658 0-3 1.342-3 3s1.342 3 3 3 3-1.342 3-3-1.342-3-3-3z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">快速链接</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">关于我们</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">游戏规则</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">帮助中心</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">联系客服</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">游戏分类</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">冒险游戏</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">策略游戏</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">竞速游戏</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">动作游戏</a></li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-8 bg-gray-600" />
            
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300 text-sm">
                © 2024 游戏世界. 保留所有权利.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">隐私政策</a>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">服务条款</a>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Cookie 政策</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
