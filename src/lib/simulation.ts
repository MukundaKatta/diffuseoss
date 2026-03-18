import type {
  DenoisingStep,
  GenerationParams,
  ControlNetConfig,
  ModelComparison,
  TrainingDataEntry,
} from '@/types/diffusion';
import {
  generateGaussianNoise,
  simulateDenoising,
  noiseToImageData,
  generateEmbedding,
  computeNoiseSchedule,
} from './utils';

export function simulateDenoisingProcess(
  params: GenerationParams
): DenoisingStep[] {
  const noise = generateGaussianNoise(64, 64, params.seed);
  const steps: DenoisingStep[] = [];

  for (let i = 0; i <= params.steps; i++) {
    const denoised = simulateDenoising(noise, i, params.steps, params.seed);
    const noiseLevel = 1 - i / params.steps;
    steps.push({
      step: i,
      totalSteps: params.steps,
      noiseLevel,
      imageData: latentToDataUrl(denoised, i, params.steps),
      latentPreview: denoised,
      signalToNoise: noiseLevel === 0 ? Infinity : (1 - noiseLevel) / noiseLevel,
      timestamp: Date.now(),
    });
  }

  return steps;
}

function latentToDataUrl(
  latent: number[][],
  step: number,
  totalSteps: number
): string {
  const size = 256;
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) return '';

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const progress = step / totalSteps;
  const h = latent.length;
  const w = latent[0].length;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const ly = Math.floor((y / size) * h);
      const lx = Math.floor((x / size) * w);
      const val = latent[ly][lx];
      const normalized = Math.min(255, Math.max(0, ((val + 3) / 6) * 255));

      const r = Math.floor(normalized * (0.4 + 0.6 * progress));
      const g = Math.floor(normalized * (0.5 + 0.5 * progress));
      const b = Math.floor(normalized * (0.7 + 0.3 * (1 - progress)));

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  return canvas.toDataURL('image/png');
}

export function simulateGeneration(params: GenerationParams): Promise<string> {
  return new Promise((resolve) => {
    const noise = generateGaussianNoise(64, 64, params.seed);
    const final = simulateDenoising(noise, params.steps, params.steps, params.seed);
    const url = latentToDataUrl(final, params.steps, params.steps);
    setTimeout(() => resolve(url), 500 + Math.random() * 1000);
  });
}

export function simulateControlNet(
  config: ControlNetConfig,
  params: GenerationParams
): Promise<{ processed: string; result: string }> {
  return new Promise((resolve) => {
    const noise = generateGaussianNoise(64, 64, params.seed);
    const final = simulateDenoising(noise, params.steps, params.steps, params.seed + 42);
    const processed = latentToDataUrl(final, params.steps * 0.7, params.steps);
    const result = latentToDataUrl(final, params.steps, params.steps);
    setTimeout(() => resolve({ processed, result }), 800);
  });
}

export function simulateModelComparison(
  params: GenerationParams
): Promise<ModelComparison[]> {
  const models: Array<{ model: GenerationParams['model']; timeMul: number; quality: number }> = [
    { model: 'SD1.5', timeMul: 1.0, quality: 72 },
    { model: 'SD2.1', timeMul: 1.2, quality: 78 },
    { model: 'SDXL', timeMul: 2.5, quality: 88 },
    { model: 'SD3.5', timeMul: 3.0, quality: 93 },
  ];

  return Promise.all(
    models.map(async (m) => {
      const noise = generateGaussianNoise(64, 64, params.seed + m.model.charCodeAt(2));
      const final = simulateDenoising(
        noise,
        params.steps,
        params.steps,
        params.seed + m.model.charCodeAt(2)
      );
      const imageData = latentToDataUrl(final, params.steps, params.steps);
      const baseTime = params.steps * 50 * m.timeMul;

      return {
        model: m.model,
        generationTime: baseTime + Math.random() * 200,
        imageData,
        quality: m.quality + Math.random() * 5,
        fid: 30 - m.quality / 5 + Math.random() * 5,
        clipScore: 0.2 + m.quality / 150 + Math.random() * 0.05,
        params: { ...params, model: m.model },
      };
    })
  );
}

export function generateSampleTrainingData(): TrainingDataEntry[] {
  const categories = [
    { source: 'LAION-5B', tags: ['photograph', 'high-quality'] },
    { source: 'COYO-700M', tags: ['web-scraped', 'diverse'] },
    { source: 'DataComp', tags: ['curated', 'filtered'] },
    { source: 'CC12M', tags: ['creative-commons', 'web'] },
    { source: 'JourneyDB', tags: ['ai-generated', 'artistic'] },
  ];

  const subjects = [
    'sunset over mountains',
    'portrait of a woman',
    'city skyline at night',
    'abstract geometric art',
    'tropical beach scene',
    'forest pathway in autumn',
    'underwater coral reef',
    'vintage car on highway',
    'medieval castle ruins',
    'space nebula photography',
    'cat sleeping on sofa',
    'modern architecture building',
    'field of wildflowers',
    'snowy mountain peak',
    'cyberpunk street scene',
    'watercolor landscape painting',
    'close-up of butterfly',
    'japanese garden temple',
    'northern lights aurora',
    'steampunk mechanical device',
  ];

  const resolutions = ['512x512', '768x768', '1024x1024', '640x480', '1920x1080'];

  return subjects.map((subject, i) => {
    const cat = categories[i % categories.length];
    return {
      id: `td-${i}`,
      imageUrl: '',
      caption: `A beautiful ${subject}, high quality, detailed`,
      source: cat.source,
      resolution: resolutions[i % resolutions.length],
      tags: [...cat.tags, ...subject.split(' ').slice(0, 2)],
      aestheticScore: 5.0 + Math.random() * 4.5,
      clipScore: 0.2 + Math.random() * 0.15,
    };
  });
}

export function generateSampleEmbeddings(): {
  texts: string[];
  embeddings: number[][];
} {
  const texts = [
    'a photo of a cat',
    'a painting of a dog',
    'a sketch of a bird',
    'a photo of a dog',
    'sunset over the ocean',
    'sunrise over mountains',
    'moonlight on the lake',
    'abstract colorful shapes',
    'geometric patterns',
    'fractal art design',
    'portrait of a woman smiling',
    'portrait of a man thinking',
    'cyberpunk city lights',
    'medieval fantasy castle',
    'futuristic spaceship',
    'watercolor flowers',
    'oil painting landscape',
    'digital art forest',
    'a red sports car',
    'a blue vintage truck',
  ];

  const embeddings = texts.map((t) => generateEmbedding(t, 768));
  return { texts, embeddings };
}
