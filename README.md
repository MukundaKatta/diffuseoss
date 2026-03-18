# DiffuseOSS

> Open-Source Diffusion Model Playground with Educational Tools

DiffuseOSS is an interactive platform for learning about and experimenting with diffusion models. Generate images, visualize the denoising process, explore latent spaces, and understand how ControlNet, tokenizers, and schedulers work.

## Features

- **Image Generation** -- Text-to-image generation with customizable parameters
- **Denoising Visualizer** -- Step-by-step visualization of the diffusion denoising process
- **Latent Space Explorer** -- Navigate and understand high-dimensional latent representations
- **Tokenizer Inspector** -- Examine how text prompts are tokenized for diffusion models
- **ControlNet Studio** -- Experiment with edge, depth, and pose-guided generation
- **Model Comparison** -- Side-by-side output comparison across diffusion models
- **Training Data Explorer** -- Browse and analyze training datasets
- **Embedding Viewer** -- Visualize text and image embeddings in 2D/3D
- **Scheduler Analysis** -- Compare noise schedules and sampling strategies
- **Educational Mode** -- Inline tooltips and explanations for learning

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, CVA, tailwind-merge
- **UI Components:** Radix UI (Dialog, Dropdown, Select, Slider, Switch, Tabs, Tooltip)
- **Visualization:** D3.js, Recharts
- **Database:** Supabase (PostgreSQL)
- **State Management:** Zustand
- **Animation:** Framer Motion
- **Icons:** Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your SUPABASE_URL and SUPABASE_ANON_KEY

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  components/
    Navigation.tsx              # Sidebar with 10 feature sections
    generation/                 # Image generation panel and gallery
    ui/                         # Reusable UI primitives (Button, Slider, etc.)
    EducationalTooltip.tsx      # Contextual learning tooltips
  lib/
    store.ts                    # Zustand state management
    utils.ts                    # Utility functions
```

