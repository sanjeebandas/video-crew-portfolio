import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { pwaManager } from '../../utils/pwa';

interface InstallPromptProps {
  onClose?: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onClose }) => {
  const [show, setShow] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if install prompt is available
    const checkInstallPrompt = () => {
      if (pwaManager.canInstall() && !pwaManager.isAppInstalled()) {
        setShow(true);
      }
    };

    // Check immediately
    checkInstallPrompt();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = () => {
      setTimeout(checkInstallPrompt, 1000); // Small delay to ensure state is updated
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await pwaManager.promptInstall();
      if (success) {
        setShow(false);
        onClose?.();
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                앱 설치하기
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                더 나은 경험을 위해 앱을 설치하세요
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Smartphone className="w-4 h-4" />
            <span>홈 화면에 추가되어 더 빠르게 접근할 수 있습니다</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
            >
              {isInstalling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>설치 중...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>설치하기</span>
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              나중에
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
