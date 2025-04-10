'use client'
import { persistReducer } from 'redux-persist';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import rootReducer from './rootReducer';

const createNoopStorage= () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    }
  }
}

const storage = typeof window !== "undefined" ? createWebStorage("session") : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage, // Use storage only on client,
  whitelist: ['auth', 'devise']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;