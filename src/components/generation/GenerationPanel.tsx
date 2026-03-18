'use client';

import { useAppStore } from '@/lib/store';
import { useGeneration } from '@/hooks/useGeneration';
import { randomSeed } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import EducationalTooltip from '@/components/EducationalTooltip';
import type { SchedulerType, SamplerType, ModelType } from '@/types/diffusion';

const schedulerOptions: { value: SchedulerType; label: string }[] = [
  { value: 'DDPM', label: 'DDPM' },
  { value: 'DDIM', label: 'DDIM' },
  { value: 'PNDM', label: 'PNDM' },
  { value: 'Euler', label: 'Euler' },
  { value: 'EulerAncestral', label: 'Euler Ancestral' },
  { value: 'DPMSolver', label: 'DPM Solver' },
  { value: 'DPMSolverMultistep', label: 'DPM Solver++' },
  { value: 'LMSDiscrete', label: 'LMS Discrete' },
  { value: 'HeunDiscrete', label: 'Heun Discrete' },
  { value: 'UniPC', label: 'UniPC' },
];

const samplerOptions: { value: SamplerType; label: string }[] = [
  { value: 'k_euler', label: 'Euler' },
  { value: 'k_euler_ancestral', label: 'Euler Ancestral' },
  { value: 'k_dpm_2', label: 'DPM2' },
  { value: 'k_dpm_2_ancestral', label: 'DPM2 Ancestral' },
  { value: 'k_lms', label: 'LMS' },
  { value: 'k_heun', label: 'Heun' },
  { value: 'ddim', label: 'DDIM' },
  { value: 'plms', label: 'PLMS' },
];

const modelOptions: { value: ModelType; label: string }[] = [
  { value: 'SD1.5', label: 'Stable Diffusion 1.5' },
  { value: 'SD2.1', label: 'Stable Diffusion 2.1' },
  { value: 'SDXL', label: 'Stable Diffusion XL' },
  { value: 'SD3.5', label: 'Stable Diffusion 3.5' },
];

const resolutionOptions = [
  { value: '512x512', label: '512 x 512' },
  { value: '768x768', label: '768 x 768' },
  { value: '1024x1024', label: '1024 x 1024' },
  { value: '512x768', label: '512 x 768 (Portrait)' },
  { value: '768x512', label: '768 x 512 (Landscape)' },
];

export default function GenerationPanel() {
  const { generationParams, setGenerationParams } = useAppStore();
  const { generate, progress, error, isGenerating } = useGeneration();

  const handleResolutionChange = (value: string) => {
    const [w, h] = value.split('x').map(Number);
    setGenerationParams({ width: w, height: h });
  };

  return (
    <div className="space-y-4">
      {/* Prompt */}
      <Card title="Prompt">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Prompt
            </label>
            <textarea
              value={generationParams.prompt}
              onChange={(e) => setGenerationParams({ prompt: e.target.value })}
              placeholder="A majestic castle on a floating island, digital art, highly detailed, fantasy..."
              className="w-full h-24 px-3 py-2 text-sm bg-dark-3 border border-dark-5 rounded-lg
                text-gray-200 placeholder-gray-600 resize-none
                focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Negative Prompt
            </label>
            <textarea
              value={generationParams.negativePrompt}
              onChange={(e) => setGenerationParams({ negativePrompt: e.target.value })}
              placeholder="blurry, low quality, deformed, ugly, bad anatomy..."
              className="w-full h-16 px-3 py-2 text-sm bg-dark-3 border border-dark-5 rounded-lg
                text-gray-200 placeholder-gray-600 resize-none
                focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
            />
          </div>
        </div>
      </Card>

      {/* Model */}
      <Card title="Model & Resolution">
        <div className="space-y-3">
          <Select
            label="Model"
            value={generationParams.model}
            onChange={(v) => setGenerationParams({ model: v as ModelType })}
            options={modelOptions}
            description="Select the Stable Diffusion model version"
          />
          <Select
            label="Resolution"
            value={`${generationParams.width}x${generationParams.height}`}
            onChange={handleResolutionChange}
            options={resolutionOptions}
          />
        </div>
      </Card>

      {/* Parameters */}
      <Card title="Diffusion Parameters">
        <div className="space-y-4">
          <EducationalTooltip
            title="Inference Steps"
            explanation="The number of denoising steps. More steps generally produce higher quality images but take longer. Most schedulers produce good results with 20-50 steps."
            formula="x_t = sqrt(alpha_t) * x_0 + sqrt(1 - alpha_t) * epsilon"
          >
            <Slider
              label="Steps"
              value={generationParams.steps}
              onChange={(v) => setGenerationParams({ steps: v })}
              min={1}
              max={150}
              step={1}
              description="Number of denoising iterations"
            />
          </EducationalTooltip>

          <EducationalTooltip
            title="Classifier-Free Guidance Scale"
            explanation="CFG scale controls how strongly the generation follows your prompt. Higher values make the image more closely match the prompt but may reduce quality. Values between 7-12 are typical."
            formula="output = uncond + cfg_scale * (cond - uncond)"
          >
            <Slider
              label="CFG Scale"
              value={generationParams.cfgScale}
              onChange={(v) => setGenerationParams({ cfgScale: v })}
              min={1}
              max={30}
              step={0.5}
              description="Classifier-Free Guidance strength"
            />
          </EducationalTooltip>

          <EducationalTooltip
            title="Scheduler"
            explanation="The scheduler determines how noise is removed at each step. Different schedulers use different mathematical approaches: DDPM is the original, DDIM allows fewer steps, Euler and DPM Solver++ are fast and high quality."
          >
            <Select
              label="Scheduler"
              value={generationParams.scheduler}
              onChange={(v) => setGenerationParams({ scheduler: v as SchedulerType })}
              options={schedulerOptions}
            />
          </EducationalTooltip>

          <EducationalTooltip
            title="Sampler"
            explanation="The sampler algorithm determines the strategy for traversing the latent space during denoising. Ancestral samplers add noise at each step for more variation, while non-ancestral ones are deterministic."
          >
            <Select
              label="Sampler"
              value={generationParams.sampler}
              onChange={(v) => setGenerationParams({ sampler: v as SamplerType })}
              options={samplerOptions}
            />
          </EducationalTooltip>

          {/* Seed */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Seed
              </label>
              <input
                type="number"
                value={generationParams.seed}
                onChange={(e) =>
                  setGenerationParams({ seed: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 text-sm bg-dark-3 border border-dark-5 rounded-lg
                  text-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setGenerationParams({ seed: randomSeed() })}
            >
              Random
            </Button>
          </div>

          <Slider
            label="Batch Size"
            value={generationParams.batchSize}
            onChange={(v) => setGenerationParams({ batchSize: v })}
            min={1}
            max={4}
            step={1}
          />
        </div>
      </Card>

      {/* Generate button */}
      <div className="space-y-3">
        {isGenerating && (
          <ProgressBar value={progress} variant="gradient" label="Generating..." />
        )}
        {error && (
          <div className="px-3 py-2 text-sm text-red-400 bg-red-900/20 border border-red-800/50 rounded-lg">
            {error}
          </div>
        )}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          loading={isGenerating}
          onClick={generate}
        >
          Generate Image
        </Button>
      </div>
    </div>
  );
}
