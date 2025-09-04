import { useState, useCallback } from 'react';

export interface ErrorState {
  hasError: boolean;
  error: string | null;
  errorType: 'network' | 'server' | 'validation' | 'unknown';
  retryCount: number;
}

export interface ErrorHandlerOptions {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: () => void;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const { maxRetries = 3, retryDelay = 1000, onRetry } = options;
  
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorType: 'unknown',
    retryCount: 0,
  });

  const getErrorMessage = (error: any): { message: string; type: ErrorState['errorType'] } => {
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

    if (error?.response?.status === 404) {
      return {
        message: '요청한 콘텐츠를 찾을 수 없습니다.',
        type: 'server'
      };
    }

    if (error?.response?.status === 403) {
      return {
        message: '접근 권한이 없습니다.',
        type: 'server'
      };
    }

    if (error?.response?.status === 401) {
      return {
        message: '인증이 필요합니다.',
        type: 'server'
      };
    }

    // Validation errors
    if (error?.response?.status === 400) {
      return {
        message: '잘못된 요청입니다. 입력값을 확인해주세요.',
        type: 'validation'
      };
    }

    // Generic error
    return {
      message: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
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

    console.error('Error handled:', error);
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
      // Exponential backoff delay
      const delay = retryDelay * Math.pow(2, errorState.retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      
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
