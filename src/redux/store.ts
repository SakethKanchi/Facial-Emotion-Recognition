import { configureStore } from '@reduxjs/toolkit';
import webcamReducer from './webcamSlice';

export const store = configureStore({
    reducer: {
        webcam: webcamReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
