import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type UserType } from "~/types/user";

type UserStore = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: "user-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' isLoading: boolean; used
    },
  ),
);
