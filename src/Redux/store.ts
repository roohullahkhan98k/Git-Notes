import { configureStore } from '@reduxjs/toolkit';
import gistReducer from './gistSlice';

const store = configureStore({
  reducer: {
    gist: gistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
