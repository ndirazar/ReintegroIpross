import React, { useState, useCallback } from 'react';

type MyAlert = {
  alert: {
    message: string;
    severity: 'error' | 'warning' | 'info' | 'success';
  };
  addAlert: (m: string, s: string) => void;
  removeAlert: () => void;
};
export const AlertContext = React.createContext<MyAlert>({
  alert: null,
  addAlert: () => {},
  removeAlert: () => {},
});

export default function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const addAlert = (message, severity) => setAlert({ message, severity });

  const removeAlert = () => setAlert(null);

  const contextValue = {
    alert,
    addAlert: useCallback((message, severity) => addAlert(message, severity), []),
    removeAlert: useCallback(() => removeAlert(), []),
  };

  return <AlertContext.Provider value={contextValue}>{children}</AlertContext.Provider>;
}
