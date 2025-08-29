import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { isOnline } from '../../utils/pwa';

const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!isOnline());

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="bg-red-600 text-white rounded-lg shadow-lg p-3 flex items-center space-x-3">
        <WifiOff className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">오프라인 모드</p>
          <p className="text-xs opacity-90">인터넷 연결을 확인해 주세요</p>
        </div>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
