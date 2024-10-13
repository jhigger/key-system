import { type OnChangeFn, type PaginationState } from "@tanstack/react-table";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIState = {
  editMode: boolean;
  toggleEditMode: () => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination: OnChangeFn<PaginationState>;
  resetPagination: () => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      editMode: false,
      toggleEditMode: () => set((state) => ({ editMode: !state.editMode })),
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      setPagination: (updater) =>
        set((state) => ({
          pagination:
            typeof updater === "function" ? updater(state.pagination) : updater,
        })),
      resetPagination: () =>
        set(() => ({
          pagination: { pageIndex: 0, pageSize: 10 },
        })),
    }),
    {
      name: "ui-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({
        editMode: state.editMode,
        pagination: {
          pageIndex: 0,
          pageSize: state.pagination.pageSize,
        },
      }),
    },
  ),
);
