'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { simulateGeneration, simulateDenoisingProcess } from '@/lib/simulation';

export function useGeneration() {
  const {
    generationParams,
    setIsGenerating,
    isGenerating,
    addGeneratedImage,
    setDenoisingSteps,
  } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (isGenerating) return;
    if (!generationParams.prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setProgress(0);

    try {
      const steps = simulateDenoisingProcess(generationParams);
      setDenoisingSteps(steps);

      for (let i = 0; i < generationParams.batchSize; i++) {
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 2, 95));
        }, 50);

        const result = await simulateGeneration({
          ...generationParams,
          seed: generationParams.seed + i,
        });

        clearInterval(progressInterval);
        addGeneratedImage(result);
        setProgress(100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, [
    generationParams,
    isGenerating,
    setIsGenerating,
    addGeneratedImage,
    setDenoisingSteps,
  ]);

  return { generate, progress, error, isGenerating };
}
