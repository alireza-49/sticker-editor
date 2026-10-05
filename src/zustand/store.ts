import { create } from "zustand";
import { ImportedFileType, StateType } from "./store.types";

export const useStore = create<StateType>()((set) => ({
  layers: {
    fabricStateL: "",
  },
  imports: [],
}));

export const resetStore = () => useStore.setState(useStore.getInitialState());

export const updateLayersStore = (newState: string) =>
  useStore.setState({ layers: { fabricState: newState } });

export const importFile = (file: ImportedFileType) =>
  useStore.setState((state) => ({ imports: [...state.imports, file] }));

export const removeFile = (id: string) =>
  useStore.setState((state) => ({
    imports: state.imports.filter((file) => file.id !== id),
  }));
