import React from 'react';

interface MiniLoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const MiniLoading: React.FC<MiniLoadingProps> = ({ 
  size = 'medium', 
  text = '加载中...' 
}) => {
  const sizeClasses = {
    small: 'text-2xl w-6 h-6',
    medium: 'text-4xl w-8 h-8', 
    large: 'text-6xl w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className={`${sizeClasses[size].split(' ')[0]} mb-2 animate-bounce`}>
          🎮
        </div>
      </div>
      <span className="text-gray-600 text-sm">{text}</span>
    </div>
  );
};

export default MiniLoading; 
