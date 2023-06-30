import React, { ReactNode, createContext, useContext, useState } from "react";

// Interface Imports
import {
  NotificationContextInterface,
  NotificationConfigurationInterface,
} from "../interfaces";

// Create the context
const NotificationContext = createContext<NotificationContextInterface>({
  showNotification: false,
  setShowNotification: () => {},
  notificationConfiguration: {} as NotificationConfigurationInterface,
  setNotificationConfiguration: () => {},
});

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  // State to store the notification values
  const [showNotification, setShowNotification] = useState(false);
  const [notificationConfiguration, setNotificationConfiguration] = useState(
    {} as NotificationConfigurationInterface
  );

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        setShowNotification,
        notificationConfiguration,
        setNotificationConfiguration,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Use the context
function useNotificationContext() {
  return useContext(NotificationContext);
}

export { NotificationProvider, useNotificationContext }