import { Loader2 } from 'lucide-react';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = '加载中...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="pt-8 pb-6">
          <div className="flex flex-col items-center space-y-4">
            {/* 加载图标 */}
            <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />

            {/* 加载文本 */}
            <p className={`${textSizeClasses[size]} text-muted-foreground font-medium`}>
              {message}
            </p>

            {/* 游戏图标装饰 */}
            <div className="text-2xl opacity-50">🎮</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingSpinner;
