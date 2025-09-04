import { useState, useCallback } from 'react';

export interface ContactErrorState {
  hasError: boolean;
  error: string | null;
  errorType: 'network' | 'server' | 'validation' | 'unknown';
  retryCount: number;
}

export interface ContactErrorHandlerOptions {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: () => void;
}

export const useContactErrorHandler = (options: ContactErrorHandlerOptions = {}) => {
  const { maxRetries = 2, retryDelay = 1000, onRetry } = options;
  
  const [errorState, setErrorState] = useState<ContactErrorState>({
    hasError: false,
    error: null,
    errorType: 'unknown',
    retryCount: 0,
  });

  const getErrorMessage = (error: any): { message: string; type: ContactErrorState['errorType'] } => {
    // Network errors
    if (!navigator.onLine) {
      return {
        message: '인터넷 연결을 확인해주세요.',
        type: 'network'
      };
    }

    if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
      return {
        message: '네트워크 연결에 문제가 있습니다. 다시 시도해주세요.',
        type: 'network'
      };
    }

    // Server errors
    if (error?.response?.status === 500) {
      return {
        message: '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        type: 'server'
      };
    }

    if (error?.response?.status === 429) {
      return {
        message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
        type: 'server'
      };
    }

    if (error?.response?.status === 400) {
      return {
        message: '입력 정보를 확인해주세요.',
        type: 'validation'
      };
    }

    // Generic error
    return {
      message: '문의 제출에 실패했습니다. 다시 시도해주세요.',
      type: 'unknown'
    };
  };

  const handleError = useCallback((error: any) => {
    const { message, type } = getErrorMessage(error);
    
    setErrorState({
      hasError: true,
      error: message,
      errorType: type,
      retryCount: errorState.retryCount + 1,
    });

    console.error('Contact form error:', error);
  }, [errorState.retryCount]);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorType: 'unknown',
      retryCount: 0,
    });
  }, []);

  const retry = useCallback(async (retryFn: () => Promise<any>) => {
    if (errorState.retryCount >= maxRetries) {
      return;
    }

    clearError();
    
    if (onRetry) {
      onRetry();
    }

    try {
      // Simple delay for retry
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      await retryFn();
    } catch (error) {
      handleError(error);
    }
  }, [errorState.retryCount, maxRetries, retryDelay, onRetry, clearError, handleError]);

  const canRetry = errorState.retryCount < maxRetries;

  return {
    errorState,
    handleError,
    clearError,
    retry,
    canRetry,
  };
};
