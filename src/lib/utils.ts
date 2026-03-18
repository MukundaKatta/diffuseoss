import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2147483647);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

export function generateGaussianNoise(width: number, height: number, seed: number): number[][] {
  const rng = mulberry32(seed);
  const noise: number[][] = [];
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      const u1 = rng();
      const u2 = rng();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      row.push(z);
    }
    noise.push(row);
  }
  return noise;
}

function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function noiseToImageData(
  noise: number[][],
  colorMap: 'grayscale' | 'viridis' | 'plasma' = 'grayscale'
): ImageData {
  const height = noise.length;
  const width = noise[0].length;
  const data = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const val = clamp((noise[y][x] + 3) / 6, 0, 1);
      const [r, g, b] = applyColorMap(val, colorMap);
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  return new ImageData(data, width, height);
}

function applyColorMap(
  value: number,
  map: 'grayscale' | 'viridis' | 'plasma'
): [number, number, number] {
  if (map === 'grayscale') {
    const v = Math.floor(value * 255);
    return [v, v, v];
  }
  if (map === 'viridis') {
    const r = Math.floor(clamp(value < 0.5 ? value * 2 * 68 : 68 + (value - 0.5) * 2 * 187, 0, 255));
    const g = Math.floor(clamp(value * 230 + 10, 0, 255));
    const b = Math.floor(clamp(value < 0.5 ? 84 + value * 2 * 120 : 204 - (value - 0.5) * 2 * 170, 0, 255));
    return [r, g, b];
  }
  // plasma
  const r = Math.floor(clamp(13 + value * 242, 0, 255));
  const g = Math.floor(clamp(value < 0.5 ? value * 2 * 140 : 140 + (value - 0.5) * 2 * 115, 0, 255));
  const b = Math.floor(clamp(value < 0.5 ? 135 + value * 2 * 120 : 255 - (value - 0.5) * 2 * 220, 0, 255));
  return [r, g, b];
}

export function computeNoiseSchedule(
  betaStart: number,
  betaEnd: number,
  steps: number,
  schedule: 'linear' | 'scaled_linear' | 'squaredcos_cap_v2'
): { alphas: number[]; sigmas: number[]; betas: number[]; snrs: number[] } {
  const betas: number[] = [];

  if (schedule === 'linear') {
    for (let i = 0; i < steps; i++) {
      betas.push(betaStart + (betaEnd - betaStart) * (i / (steps - 1)));
    }
  } else if (schedule === 'scaled_linear') {
    const sqrtStart = Math.sqrt(betaStart);
    const sqrtEnd = Math.sqrt(betaEnd);
    for (let i = 0; i < steps; i++) {
      const val = sqrtStart + (sqrtEnd - sqrtStart) * (i / (steps - 1));
      betas.push(val * val);
    }
  } else {
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const alphaBar = Math.cos(((t + 0.008) / 1.008) * (Math.PI / 2)) ** 2;
      const alphaBarPrev =
        i === 0
          ? 1
          : Math.cos((((i - 1) / (steps - 1) + 0.008) / 1.008) * (Math.PI / 2)) ** 2;
      betas.push(clamp(1 - alphaBar / alphaBarPrev, 0, 0.999));
    }
  }

  const alphas: number[] = [];
  const sigmas: number[] = [];
  const snrs: number[] = [];
  let alphaCumprod = 1;

  for (let i = 0; i < steps; i++) {
    alphaCumprod *= 1 - betas[i];
    alphas.push(alphaCumprod);
    const sigma = Math.sqrt((1 - alphaCumprod) / alphaCumprod);
    sigmas.push(sigma);
    snrs.push(alphaCumprod / (1 - alphaCumprod));
  }

  return { alphas, sigmas, betas, snrs };
}

export function simulateDenoising(
  noise: number[][],
  step: number,
  totalSteps: number,
  seed: number
): number[][] {
  const rng = mulberry32(seed + step * 1000);
  const progress = step / totalSteps;
  const height = noise.length;
  const width = noise[0].length;
  const result: number[][] = [];

  const targetFreqX = 2 + Math.floor(rng() * 4);
  const targetFreqY = 2 + Math.floor(rng() * 4);
  const phase = rng() * Math.PI * 2;

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      const target =
        Math.sin((x / width) * targetFreqX * Math.PI + phase) *
        Math.cos((y / height) * targetFreqY * Math.PI + phase) *
        0.8;
      const noiseVal = noise[y][x] * (1 - progress);
      const signalVal = target * progress;
      row.push(noiseVal + signalVal);
    }
    result.push(row);
  }

  return result;
}

export function tokenize(text: string): {
  tokens: string[];
  ids: number[];
  weights: number[];
} {
  const vocab: Record<string, number> = {};
  let nextId = 49406;

  const cleanText = text.toLowerCase().replace(/[^\w\s(),.:;!?-]/g, '');
  const words = cleanText.split(/\s+/).filter(Boolean);

  const tokens: string[] = ['<|startoftext|>'];
  const ids: number[] = [49406];
  const weights: number[] = [1.0];

  let parenDepth = 0;

  for (const word of words) {
    if (word === '(') {
      parenDepth++;
      continue;
    }
    if (word === ')') {
      parenDepth = Math.max(0, parenDepth - 1);
      continue;
    }

    const subwords = splitIntoSubwords(word);
    for (const sub of subwords) {
      if (!vocab[sub]) {
        vocab[sub] = nextId++;
      }
      tokens.push(sub);
      ids.push(vocab[sub]);
      weights.push(Math.pow(1.1, parenDepth));
    }
  }

  tokens.push('<|endoftext|>');
  ids.push(49407);
  weights.push(1.0);

  return { tokens, ids, weights };
}

function splitIntoSubwords(word: string): string[] {
  if (word.length <= 4) return [word + '</w>'];
  const result: string[] = [];
  let i = 0;
  while (i < word.length) {
    const len = Math.min(4 + Math.floor(Math.random() * 3), word.length - i);
    const sub = word.substring(i, i + len);
    i += len;
    result.push(i >= word.length ? sub + '</w>' : sub);
  }
  return result;
}

export function generateEmbedding(text: string, dims: number = 768): number[] {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  const rng = mulberry32(hash);
  const embedding: number[] = [];
  for (let i = 0; i < dims; i++) {
    embedding.push(rng() * 2 - 1);
  }

  const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
  return embedding.map((v) => v / norm);
}

export function projectTo2D(
  embeddings: number[][],
  method: 'pca' | 'tsne' = 'pca'
): { x: number; y: number }[] {
  if (embeddings.length === 0) return [];

  if (method === 'pca') {
    const dims = embeddings[0].length;
    const mean = new Array(dims).fill(0);
    for (const emb of embeddings) {
      for (let i = 0; i < dims; i++) {
        mean[i] += emb[i] / embeddings.length;
      }
    }

    const centered = embeddings.map((emb) => emb.map((v, i) => v - mean[i]));

    const pc1 = new Array(dims).fill(0);
    const pc2 = new Array(dims).fill(0);
    for (let i = 0; i < dims; i++) {
      pc1[i] = centered.reduce((sum, row) => sum + row[i] * row[Math.min(i + 1, dims - 1)], 0);
      pc2[i] = centered.reduce(
        (sum, row) => sum + row[i] * row[Math.min(i + 2, dims - 1)],
        0
      );
    }

    const norm1 = Math.sqrt(pc1.reduce((s, v) => s + v * v, 0)) || 1;
    const norm2 = Math.sqrt(pc2.reduce((s, v) => s + v * v, 0)) || 1;

    return centered.map((emb) => ({
      x: emb.reduce((sum, v, i) => sum + v * (pc1[i] / norm1), 0),
      y: emb.reduce((sum, v, i) => sum + v * (pc2[i] / norm2), 0),
    }));
  }

  // Simple t-SNE approximation
  const n = embeddings.length;
  const points = embeddings.map(() => ({
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
  }));

  for (let iter = 0; iter < 100; iter++) {
    const lr = 0.1 * (1 - iter / 100);
    for (let i = 0; i < n; i++) {
      let dx = 0;
      let dy = 0;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const dist = Math.sqrt(
          embeddings[i].reduce((sum, v, k) => sum + (v - embeddings[j][k]) ** 2, 0)
        );
        const spatialDist =
          Math.sqrt((points[i].x - points[j].x) ** 2 + (points[i].y - points[j].y) ** 2) +
          0.001;
        const force = (dist - spatialDist) / spatialDist;
        dx += (points[j].x - points[i].x) * force * lr;
        dy += (points[j].y - points[i].y) * force * lr;
      }
      points[i].x += dx / n;
      points[i].y += dy / n;
    }
  }

  return points;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}
