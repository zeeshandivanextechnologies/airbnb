import React, { createContext, useContext, useState, useCallback } from 'react';
import Loader from '../components/Loader';

const LoadingContext = createContext({
  showLoading: () => {},
  hideLoading: () => {},
  isLoading: false,
});

export const LoadingProvider = ({ children }) => {
  const [loadingState, setLoadingState] = useState({
    isOpen: false,
    text: '',
    variant: 'airbnb',
    blur: true,
  });

  const showLoading = useCallback((options = {}) => {
    if (typeof options === 'string') {
      setLoadingState({ isOpen: true, text: options, variant: 'airbnb', blur: true });
    } else {
      setLoadingState({
        isOpen: true,
        text: options.text || '',
        variant: options.variant || 'airbnb',
        blur: options.blur !== undefined ? options.blur : true,
      });
    }
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading: loadingState.isOpen }}>
      {children}
      {loadingState.isOpen && (
        <Loader
          fullScreen
          variant={loadingState.variant}
          text={loadingState.text}
          blur={loadingState.blur}
        />
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
export default LoadingContext;
