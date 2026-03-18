'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export function useDenoising() {
  const {
    denoisingSteps,
    currentDenoisingStep,
    setCurrentDenoisingStep,
    isDenoisingPlaying,
    setIsDenoisingPlaying,
  } = useAppStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const play = useCallback(() => {
    if (denoisingSteps.length === 0) return;
    setIsDenoisingPlaying(true);
  }, [denoisingSteps.length, setIsDenoisingPlaying]);

  const pause = useCallback(() => {
    setIsDenoisingPlaying(false);
  }, [setIsDenoisingPlaying]);

  const reset = useCallback(() => {
    setIsDenoisingPlaying(false);
    setCurrentDenoisingStep(0);
  }, [setIsDenoisingPlaying, setCurrentDenoisingStep]);

  const stepForward = useCallback(() => {
    if (currentDenoisingStep < denoisingSteps.length - 1) {
      setCurrentDenoisingStep(currentDenoisingStep + 1);
    }
  }, [currentDenoisingStep, denoisingSteps.length, setCurrentDenoisingStep]);

  const stepBackward = useCallback(() => {
    if (currentDenoisingStep > 0) {
      setCurrentDenoisingStep(currentDenoisingStep - 1);
    }
  }, [currentDenoisingStep, setCurrentDenoisingStep]);

  useEffect(() => {
    if (isDenoisingPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentDenoisingStep(
          currentDenoisingStep >= denoisingSteps.length - 1
            ? 0
            : currentDenoisingStep + 1
        );
      }, 200);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isDenoisingPlaying,
    currentDenoisingStep,
    denoisingSteps.length,
    setCurrentDenoisingStep,
  ]);

  const currentStep = denoisingSteps[currentDenoisingStep] || null;

  return {
    steps: denoisingSteps,
    currentStep,
    currentIndex: currentDenoisingStep,
    isPlaying: isDenoisingPlaying,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setStep: setCurrentDenoisingStep,
    totalSteps: denoisingSteps.length,
  };
}
