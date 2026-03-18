'use client';

import { useAppStore } from '@/lib/store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function ImageGallery() {
  const { generatedImages, clearGeneratedImages, generationParams } = useAppStore();

  if (generatedImages.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 py-12">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-dark-3 border border-dark-5
            flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">No images generated yet</p>
            <p className="text-gray-600 text-xs mt-1">Configure parameters and click Generate</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={`Generated Images (${generatedImages.length})`}
      headerAction={
        <Button variant="ghost" size="sm" onClick={clearGeneratedImages}>
          Clear All
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Current params display */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{generationParams.model}</Badge>
          <Badge>{generationParams.steps} steps</Badge>
          <Badge>CFG {generationParams.cfgScale}</Badge>
          <Badge>{generationParams.scheduler}</Badge>
          <Badge variant="default">Seed: {generationParams.seed}</Badge>
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {generatedImages.map((img, i) => (
            <div
              key={i}
              className="relative group rounded-lg overflow-hidden bg-dark-3 border border-dark-5
                aspect-square"
            >
              {img ? (
                <img
                  src={img}
                  alt={`Generated ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-600/20
                    flex items-center justify-center animate-pulse-soft">
                    <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs text-white/80 font-mono">
                    Seed: {generationParams.seed + i}
                  </span>
                  <span className="text-xs text-white/80">
                    {generationParams.width}x{generationParams.height}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
