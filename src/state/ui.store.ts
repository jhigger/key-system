import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIState = {
  editMode: boolean;
  toggleEditMode: () => void;
  pageSize: number;
  setPageSize: (size: number) => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      editMode: false,
      toggleEditMode: () => set((state) => ({ editMode: !state.editMode })),
      pageSize: 10,
      setPageSize: (size: number) => set({ pageSize: size }),
    }),
    {
      name: "ui-storage", // name of the item in the storage (must be unique)
    },
  ),
);
