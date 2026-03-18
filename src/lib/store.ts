import { create } from 'zustand';
import type {
  GenerationParams,
  DenoisingStep,
  SchedulerType,
  SamplerType,
  ModelType,
  ControlNetConfig,
  SchedulerConfig,
} from '@/types/diffusion';
import { randomSeed } from './utils';

interface AppState {
  // Generation
  generationParams: GenerationParams;
  setGenerationParams: (params: Partial<GenerationParams>) => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
  generatedImages: string[];
  addGeneratedImage: (img: string) => void;
  clearGeneratedImages: () => void;

  // Denoising
  denoisingSteps: DenoisingStep[];
  setDenoisingSteps: (steps: DenoisingStep[]) => void;
  currentDenoisingStep: number;
  setCurrentDenoisingStep: (step: number) => void;
  isDenoisingPlaying: boolean;
  setIsDenoisingPlaying: (v: boolean) => void;

  // ControlNet
  controlNetConfig: ControlNetConfig;
  setControlNetConfig: (config: Partial<ControlNetConfig>) => void;

  // Scheduler
  schedulerConfig: SchedulerConfig;
  setSchedulerConfig: (config: Partial<SchedulerConfig>) => void;

  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  educationalMode: boolean;
  setEducationalMode: (v: boolean) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Generation
  generationParams: {
    prompt: '',
    negativePrompt: '',
    steps: 30,
    cfgScale: 7.5,
    scheduler: 'Euler' as SchedulerType,
    sampler: 'k_euler' as SamplerType,
    seed: randomSeed(),
    width: 512,
    height: 512,
    model: 'SD1.5' as ModelType,
    batchSize: 1,
  },
  setGenerationParams: (params) =>
    set((state) => ({
      generationParams: { ...state.generationParams, ...params },
    })),
  isGenerating: false,
  setIsGenerating: (v) => set({ isGenerating: v }),
  generatedImages: [],
  addGeneratedImage: (img) =>
    set((state) => ({ generatedImages: [...state.generatedImages, img] })),
  clearGeneratedImages: () => set({ generatedImages: [] }),

  // Denoising
  denoisingSteps: [],
  setDenoisingSteps: (steps) => set({ denoisingSteps: steps }),
  currentDenoisingStep: 0,
  setCurrentDenoisingStep: (step) => set({ currentDenoisingStep: step }),
  isDenoisingPlaying: false,
  setIsDenoisingPlaying: (v) => set({ isDenoisingPlaying: v }),

  // ControlNet
  controlNetConfig: {
    type: 'canny',
    strength: 1.0,
    startStep: 0,
    endStep: 1,
    inputImage: null,
    preprocessedImage: null,
  },
  setControlNetConfig: (config) =>
    set((state) => ({
      controlNetConfig: { ...state.controlNetConfig, ...config },
    })),

  // Scheduler
  schedulerConfig: {
    type: 'DDPM' as SchedulerType,
    betaStart: 0.00085,
    betaEnd: 0.012,
    betaSchedule: 'scaled_linear',
    numTrainTimesteps: 1000,
    predictionType: 'epsilon',
    clipSample: true,
    clipSampleRange: 1.0,
    steps: 50,
  },
  setSchedulerConfig: (config) =>
    set((state) => ({
      schedulerConfig: { ...state.schedulerConfig, ...config },
    })),

  // UI
  sidebarOpen: true,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  educationalMode: false,
  setEducationalMode: (v) => set({ educationalMode: v }),
  darkMode: true,
  setDarkMode: (v) => set({ darkMode: v }),
}));
