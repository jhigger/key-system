import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type User } from "~/types/user";

type UserStore = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
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
