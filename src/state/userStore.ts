import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type UserType } from "~/types/user";

type UserStore = {
  user: UserType | null;
  isLoading: boolean;
  setUser: (user: UserType) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setIsLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),
    }),
    {
      name: "user-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' isLoading: boolean; used
    },
  ),
);
