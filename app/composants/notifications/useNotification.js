// app/hooks/useNotification.js
'use client';

import { useState, useMemo, useContext } from 'react';
import { notification } from 'antd';
import { NotificationContext } from '@/app/composants/notifications/NotificationContext';

const useNotification = (defaultName = 'Mon Application') => {
  const [api, contextHolder] = notification.useNotification();

  const showNotification = (type, message, description, placement = 'topRight') => {
    api[type]({
      message,
      description,
      placement,
    });
  };

  const contextValue = useMemo(() => ({ name: defaultName, showNotification }), [defaultName, showNotification]);

  return { contextHolder, contextValue };
};

export default useNotification;