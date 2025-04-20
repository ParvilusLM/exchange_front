'use client';

import { useMemo} from 'react';
import { notification } from 'antd';

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