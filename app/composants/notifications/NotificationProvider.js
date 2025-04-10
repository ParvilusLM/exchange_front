// app/providers/NotificationProvider.js
'use client';

import React from 'react';
import useNotification from '@/app/composants/notifications/useNotification';
import { NotificationContext } from '@/app/composants/notifications/NotificationContext';

const NotificationProvider = ({ children, defaultName }) => {
  const { contextHolder, contextValue } = useNotification(defaultName);

  return (
    <NotificationContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;