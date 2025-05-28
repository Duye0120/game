import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router';
import { Home, RotateCcw } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="pt-12 pb-8 text-center">
          {/* 404 数字显示 */}
          <div className="text-8xl font-bold text-gray-300 mb-4">404</div>
          
          {/* 图标 */}
          <div className="text-6xl mb-6">🎮</div>
          
          {/* 标题 */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            页面走丢了
          </h1>
          
          {/* 描述 */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            抱歉，您访问的页面不存在。<br />
            可能是链接错误或页面已被移动。
          </p>
          
          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleGoHome} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              返回首页
            </Button>
            <Button onClick={handleGoBack} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              返回上页
            </Button>
          </div>
          
          {/* 底部提示 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              如果问题持续存在，请联系我们的技术支持
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound; 
