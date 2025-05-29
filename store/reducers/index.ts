import { combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "../features/apiSlice";
import authSlice from "../features/auth";
export const rootReducers = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
});
