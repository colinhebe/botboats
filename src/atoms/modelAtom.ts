import { atom } from "jotai";
import { Model } from "../types/model";
import { defaultModels } from "../data/models";

export const allModels = atom<Model[]>(defaultModels);

const selectedModel = atom<Model | null>(null);

export const modelAtom = atom(
  (get) => get(selectedModel) || get(allModels)[0] || null,
  (get, set, newModel: Model | null) => {
    set(selectedModel, newModel);
  }
);
