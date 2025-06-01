


// services/api/apiSlice.ts
// import { siteConfig } from "@/config/site";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

type AppEnv = "development" | "staging" | "production";
const appEnv = process.env.NEXT_PUBLIC_APP_ENV || "development";
const baseUrl = `{siteConfig.envConfig.apiServer[appEnv]}`;

// Only throw if you're explicitly requiring the API
const requireApi = process.env.NEXT_PUBLIC_REQUIRE_API === "true";

if (requireApi && !baseUrl) {
  throw new Error(
    `Missing API base URL for environment "${appEnv}". Please check your .env and siteConfig.ts setup.`
  );
}


const HttpApiQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }: any) => {
    const token = Cookies.get("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "admin_dashbord",
  baseQuery: HttpApiQuery,
  tagTypes: [],
  endpoints: () => ({}),
});
