import { create } from "zustand";

export type GenerationItem = {
  id: string;
  status: string;
  prompt: string;
  imageUrls: string[];
};

export type VideoItem = {
  id: string;
  status: string;
  prompt: string;
  videoUrls: string[];
};

type StudioState = {
  projectId?: string;
  imageGenerations: GenerationItem[];
  selectedImageGenerationId?: string;
  videoGeneration?: VideoItem;
  setProjectId: (id: string) => void;
  upsertImageGeneration: (generation: GenerationItem) => void;
  setSelectedImageGenerationId: (id: string) => void;
  setVideoGeneration: (video: VideoItem) => void;
};

export const useStudioStore = create<StudioState>((set) => ({
  imageGenerations: [],
  setProjectId: (id) => set({ projectId: id }),
  upsertImageGeneration: (generation) =>
    set((state) => ({
      imageGenerations: state.imageGenerations.some((g) => g.id === generation.id)
        ? state.imageGenerations.map((g) => (g.id === generation.id ? generation : g))
        : [generation, ...state.imageGenerations]
    })),
  setSelectedImageGenerationId: (id) => set({ selectedImageGenerationId: id }),
  setVideoGeneration: (video) => set({ videoGeneration: video })
}));
