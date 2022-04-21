import React, { useState, useCallback } from 'react';

export const LoadingContext = React.createContext({
  loading: false,
  isLoading: () => {},
  unsetLoading: () => {},
});

export default function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const unsetLoading = () => setLoading(false);

  const isLoading = () => setLoading(true);

  const contextValue = {
    loading,
    isLoading: useCallback(() => isLoading(), []),
    unsetLoading: useCallback(() => unsetLoading(), []),
  };

  return <LoadingContext.Provider value={contextValue}>{children}</LoadingContext.Provider>;
}
