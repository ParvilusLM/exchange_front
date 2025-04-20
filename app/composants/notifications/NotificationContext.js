import { createContext, useContext } from 'react';

export const NotificationContext = createContext({
  name: 'Default',
  showNotification: () => {}, // Fonction vide par défaut
});

export const useNotificationContext = () => useContext(NotificationContext);