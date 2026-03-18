export type SchedulerType =
  | 'DDPM'
  | 'DDIM'
  | 'PNDM'
  | 'Euler'
  | 'EulerAncestral'
  | 'DPMSolver'
  | 'DPMSolverMultistep'
  | 'LMSDiscrete'
  | 'HeunDiscrete'
  | 'UniPC';

export type SamplerType =
  | 'k_euler'
  | 'k_euler_ancestral'
  | 'k_dpm_2'
  | 'k_dpm_2_ancestral'
  | 'k_lms'
  | 'k_heun'
  | 'ddim'
  | 'plms';

export type ModelType = 'SD1.5' | 'SD2.1' | 'SDXL' | 'SD3.5';

export interface GenerationParams {
  prompt: string;
  negativePrompt: string;
  steps: number;
  cfgScale: number;
  scheduler: SchedulerType;
  sampler: SamplerType;
  seed: number;
  width: number;
  height: number;
  model: ModelType;
  batchSize: number;
}

export interface DenoisingStep {
  step: number;
  totalSteps: number;
  noiseLevel: number;
  imageData: string;
  latentPreview: number[][];
  signalToNoise: number;
  timestamp: number;
}

export interface LatentPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  cluster: number;
  imagePreview: string;
  prompt: string;
  embedding: number[];
}

export interface TokenInfo {
  token: string;
  tokenId: number;
  weight: number;
  attention: number;
  position: number;
  isSpecial: boolean;
  clipLayer: number;
}

export interface ControlNetConfig {
  type: 'canny' | 'depth' | 'pose' | 'normal' | 'segmentation' | 'lineart' | 'scribble';
  strength: number;
  startStep: number;
  endStep: number;
  inputImage: string | null;
  preprocessedImage: string | null;
}

export interface ModelComparison {
  model: ModelType;
  generationTime: number;
  imageData: string;
  quality: number;
  fid: number;
  clipScore: number;
  params: GenerationParams;
}

export interface TrainingDataEntry {
  id: string;
  imageUrl: string;
  caption: string;
  source: string;
  resolution: string;
  tags: string[];
  aestheticScore: number;
  clipScore: number;
}

export interface EmbeddingPoint {
  id: string;
  x: number;
  y: number;
  text: string;
  category: string;
  similarity: number;
  vector: number[];
}

export interface SchedulerConfig {
  type: SchedulerType;
  betaStart: number;
  betaEnd: number;
  betaSchedule: 'linear' | 'scaled_linear' | 'squaredcos_cap_v2';
  numTrainTimesteps: number;
  predictionType: 'epsilon' | 'v_prediction' | 'sample';
  clipSample: boolean;
  clipSampleRange: number;
  steps: number;
}

export interface NoiseSchedulePoint {
  timestep: number;
  alpha: number;
  sigma: number;
  snr: number;
  beta: number;
}

export interface EducationalContent {
  id: string;
  title: string;
  category: 'fundamentals' | 'architecture' | 'training' | 'sampling' | 'advanced';
  content: string;
  interactiveType: 'diagram' | 'slider' | 'animation' | 'quiz';
  order: number;
}
