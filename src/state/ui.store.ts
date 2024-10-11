import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIState = {
  editMode: boolean;
  toggleEditMode: () => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      editMode: false,
      toggleEditMode: () => set((state) => ({ editMode: !state.editMode })),
    }),
    {
      name: "ui-storage", // name of the item in the storage (must be unique)
    },
  ),
);
