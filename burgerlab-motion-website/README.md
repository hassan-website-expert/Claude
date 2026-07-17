# BurgerLab Motion Website

A single-page, scroll-driven cinematic landing page for **BurgerLab**, a fictional dark luxury burger brand — built with Claude Code as an AI production workflow.

> A premium burger reveal where the scroll controls the product film.

The main visual experience is an AI-generated burger film used as a full-screen background video. As the visitor scrolls, the video is scrubbed frame-by-frame with GSAP ScrollTrigger and Lenis: the flagship **Lab Burger** starts fully assembled and slowly separates vertically into its ingredients.

## Stack

| Layer | Tool |
|---|---|
| Build / framework | Vite + React (JavaScript) |
| Scroll motion | GSAP + ScrollTrigger, Lenis smooth scroll |
| Still images | GPT Image 2 via Higgsfield MCP |
| Background video | Seedance 2.0 via Higgsfield MCP |
| Video encoding | ffmpeg → all-keyframe H.264 for smooth scrubbing |

## Project structure

```txt
burgerlab-motion-website/
├─ assets/
│  ├─ images/        # GPT Image 2 outputs (hero, exploded ref, detail, 4 catalog)
│  ├─ references/    # UI and visual reference images
│  └─ videos/        # Raw + re-encoded Seedance 2.0 background film
├─ copy/
│  ├─ brand-kit.md       # Brand identity, palette, typography — source of truth
│  ├─ asset-plan.md      # Every required asset, path, model, and approval gate
│  ├─ image-prompts.md   # Final GPT Image 2 prompts (7 images)
│  ├─ video-prompt.md    # Final Seedance 2.0 prompt + acceptance criteria
│  └─ website-brief.md   # Sections, layers, motion spec, build workflow
├─ scripts/
│  └─ swap-bg-video.sh   # Re-encode raw video → website/public/bg.mp4
└─ website/              # Vite + React app (created in the build phase)
```

## Workflow status

| Phase | Status |
|---|---|
| 1. Project structure + planning files | ✅ done |
| 2. Generate still images | ✅ hero + exploded generated (Nano Banana 2); 5 supporting stills pending credits |
| 3. Generate background video | ✅ generated (Seedance 1.5, hero→exploded start/end frames) |
| 4. Re-encode video + build website | ✅ done — site live in `website/` |
| 5. Verify + production build | ✅ dev + prod verified in browser; `npm run build -- --base=./` passes |

**Media note:** the CDN for generated media is blocked by this environment's network policy, so the committed images/video are locally generated brand-styled placeholders with the exact final file names. Swap instructions live in `copy/generation-log.md`; the real generated assets' URLs and job IDs are logged there.

Each phase requires explicit user approval before any Higgsfield credits are spent. The prompts that trigger each phase live in the project skill (`.claude/skills/burgerlab-motion-website/`).

## Running the site (once built)

```bash
cd website
npm install
npm run dev                    # local dev server
npm run build -- --base=./     # portable static build
npx serve dist                 # preview production build over HTTP
```

## Ground rules

- All copy lives in HTML/CSS — never baked into images or video.
- No real restaurant logos or food brand names in any media.
- Raw AI outputs stay in `assets/`; production files go to `website/public/`.
- All prompts are versioned in `copy/` so the workflow is reproducible.
