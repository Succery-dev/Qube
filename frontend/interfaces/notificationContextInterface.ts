interface NotificationConfigurationInterface {
  modalColor: string;
  title: string;
  message: string;
  icon: HTMLImageElement;
}

interface NotificationContextInterface {
  showNotification: boolean;
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
  notificationConfiguration: NotificationConfigurationInterface;
  setNotificationConfiguration: React.Dispatch<
    React.SetStateAction<NotificationConfigurationInterface>
  >;
}

export type {
  NotificationContextInterface,
  NotificationConfigurationInterface,
};
