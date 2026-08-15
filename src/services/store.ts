import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredientsSlice';
import authReducer from './slices/authSlice';
import feedsReducer from './slices/feedSlice';
import ordersReducer from './slices/orderSlice';
import constructorReducer from './slices/constructorSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer,
  feeds: feedsReducer,
  orders: ordersReducer,
  constructorBurger: constructorReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
