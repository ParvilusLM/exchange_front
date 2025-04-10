'use client'
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice'
import deviseSlice from './slices/deviseSlice'


const rootReducer = combineReducers({
    auth: authSlice,
    devise: deviseSlice,
});

export default rootReducer;