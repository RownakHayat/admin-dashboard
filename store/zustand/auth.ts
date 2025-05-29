import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = {
    id: string;
    name: string;
    email: string;
    token?: string;
    // Add other fields as necessary
  };
  
  type AuthState = {
    user: User | null;
    setUser: (data: User) => void;
    logout: () => void;
  };
  const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
          user: null,
          setUser: (data) => set({ user: data }),
          logout: () => {
            set({ user: null });
            sessionStorage.removeItem("auth"); // or localStorage if you're using it
          },
        }),
        {
          name: "auth",
          storage: createJSONStorage(() => sessionStorage), // or localStorage
        }
      )
    );
  
  export default useAuthStore;

// const useAuthStore = create(
//     persist(
//         (set, get: any) => ({
//             user: {},
//             setUser: (data: any) => set({ user: data }),
//         }),
//         {
//             name: "auth",
//             storage: createJSONStorage(() => sessionStorage),
//         }
//     )
// );

// export default useAuthStore;