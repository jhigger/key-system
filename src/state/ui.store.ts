import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIState = {
  editMode: boolean;
  toggleEditMode: () => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      editMode: false,
      toggleEditMode: () => set((state) => ({ editMode: !state.editMode })),
      rowsPerPage: 10,
      setRowsPerPage: (rows: number) => set({ rowsPerPage: rows }),
    }),
    {
      name: "ui-storage", // name of the item in the storage (must be unique)
    },
  ),
);
