import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { apiSlice } from "../apiSlice";
interface AuthState {
  user: any;
  permissions: any[];
}
const initialState: AuthState = {
  user: {},
  permissions: [],
};

export const authApi = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["UserRolePermissionList"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      login: builder.mutation({
        query: (data) => ({
          url: "/auth/login",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["UserRolePermissionList"],
      }),
    }),
  });

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addAuthInformation: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload;
    },
    addUserPermissions: (state, action: PayloadAction<{ permissions: any }>) => {
      state.permissions = action.payload.permissions;
    },
  },
});
export default authSlice.reducer;
export const { addAuthInformation, addUserPermissions } = authSlice.actions;
export const { useLoginMutation } = authApi;
