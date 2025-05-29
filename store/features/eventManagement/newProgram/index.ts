import { TransformResponse } from "@/store/utils";
import { apiSlice } from "../../apiSlice";

export const newProgramApiSlice = apiSlice
  .enhanceEndpoints({ addTagTypes: ["ProgramList"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getNewProgram: builder.query<any, void>({
        query: (params?: any) => {
          return {
            url: "/auth/program-list",
            params,
          };
        },
        transformResponse: (response) => TransformResponse(response),
        providesTags: ["ProgramList"],
      }),

      createProgram: builder.mutation({
        query: (data) => ({
          url: "/auth/program-store",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["ProgramList"],
      }),

      getAllFinancialYear: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-financial-year-list",
        }),
        providesTags: ["ProgramList"],
      }),
      updateProgram: builder.mutation({
        query: (data) => ({
          url: `/auth/program-update/${data.id}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["ProgramList"],
      }),
      getAllProgramList: builder.query<any, void>({
        query: () => ({
          url: "/auth/get-all-program-list",
        }),
        providesTags: ["ProgramList"],
      }),

      showSpecificsProgram: builder.query<any, any>({
        query: (id) => {
          return {
            url: `/auth/program-show/${id}`,
          };
        },
        transformResponse: (response) => {
          return response;
        },
        providesTags: ["ProgramList"],
      }),
      
      //   showSpecificsProgram: builder.query<any, string | typeof skipToken>({
      //     query: (id) => {
      //         if (id === skipToken) {
      //             return undefined;  // Skip the query if id is not provided
      //         }
      //         return {
      //             url: `/auth/program-show/${id}`,
      //         };
      //     },
      //     providesTags: ["ProgramList"],
      // }),

      //   showSpecificsProgram: builder.query<any, string | typeof skipToken>({
      //     query: (id) => {
      //         if (id === skipToken) {
      //             return undefined;  // Skip the query if id is not provided
      //         }
      //         return {
      //             url: `/auth/program-show/${id}`,
      //         };
      //     },
      //     providesTags: ["ProgramList"],
      // }),
    }),
    overrideExisting: true,
  });

export const {
  useGetNewProgramQuery,
  useCreateProgramMutation,
  useGetAllFinancialYearQuery,
  useGetAllProgramListQuery,
  useShowSpecificsProgramQuery,
  useUpdateProgramMutation,
} = newProgramApiSlice;
