# BurgerLab — Generation Log

Record of every Higgsfield MCP generation: job IDs, models, and result URLs. Job IDs can be passed as `medias[].value` in later generations (this is how the exploded image referenced the hero without a local file).

## Session 2026-07-17 — Phase 2 (stills)

**Model note:** GPT Image 2 is gated ("Requires basic plan or higher") on the account's free plan. With user approval the stills switched to **Nano Banana 2** (`nano_banana_2`, served as `nano_banana_flash`) at 2k resolution, 16:9. Scope reduced with user approval to hero + exploded only (2 credits each) to fit the 10-credit balance.

### 1. Hero burger — `assets/images/hero-burger.png`

- Job ID: `fce2602f-823a-4e7d-845b-e51b94eee580`
- Status: completed · 2752×1536 · 16:9 · 2k
- Result: https://d8j0ntlcm91z4.cloudfront.net/user_3GdMpDQKnvNT4cwozQAEb1LsUI2/hf_20260717_145938_fce2602f-823a-4e7d-845b-e51b94eee580.png
- Prompt: `copy/image-prompts.md` §1
- Local file: ❌ blocked — see "Download blocker" below

### 2. Exploded burger reference — `assets/images/exploded-burger-reference.png`

- Job ID: `6cf8e744-1af2-4c77-958f-7724a6960ea4`
- Status: completed · 2752×1536 · 16:9 · 2k
- Reference input: hero job `fce2602f-823a-4e7d-845b-e51b94eee580` (for product consistency)
- Result: https://d8j0ntlcm91z4.cloudfront.net/user_3GdMpDQKnvNT4cwozQAEb1LsUI2/hf_20260717_150133_6cf8e744-1af2-4c77-958f-7724a6960ea4.png
- Prompt: `copy/image-prompts.md` §2, adapted for image-reference input
- Local file: ❌ blocked — see "Download blocker" below

### Not yet generated (pending credits/plan decision)

- `ingredients-detail.png`, `catalog-classic-stack.png`, `catalog-smoky-bacon.png`, `catalog-spicy-lab.png`, `catalog-truffle-melt.png`

### Credits

- Start: 10 (free plan) · Spent: 4 (2 × 2k image) · Remaining: see latest `balance` call

## Session 2026-07-17 — Phase 3 (video) — waiting on top-up

Video generation approved (hero-only reference, 16:9, 720p, 8–12s, silent; full prompt in `video-prompt.md` v2) but blocked by credits. Preflighted costs, none spent:

| Option | Duration | Credits |
|---|---|---|
| `seedance_2_0` std | 12s | 54 |
| `seedance_2_0` std | 8s | 36 |
| `seedance_2_0` fast | 8s | 28 |
| `seedance_2_0_mini` | 8s | 20 |

Balance: 6. User initially chose to top up for full spec, then pivoted to an in-budget option (below).

### Generated: background video (option A, user-approved)

- Model: **Seedance 1.5 Pro** (`seedance1_5`) — in-budget substitute for Seedance 2.0 (whose 4s Mini floor is 10cr)
- Job ID: `6e105e92-10ed-4d46-8744-4ed212bff823`
- Status: completed · 1280×720 · 16:9 · 4s · silent · seed 114347
- Start frame: hero job `fce2602f-823a-4e7d-845b-e51b94eee580`
- End frame: exploded job `6cf8e744-1af2-4c77-958f-7724a6960ea4`
- Cost: 2.4 credits actual (preflight estimated 4.8; balance went 6 → 3.6)
- Result: https://d8j0ntlcm91z4.cloudfront.net/user_3GdMpDQKnvNT4cwozQAEb1LsUI2/hf_20260717_151958_6e105e92-10ed-4d46-8744-4ed212bff823.mp4
- Target local path: `assets/videos/burgerlab-scroll-background-raw.mp4` — ❌ blocked by the same CDN egress denial; download manually or fix network policy, then re-encode with `scripts/swap-bg-video.sh`
- Declined server preset suggestion "IN THE DARK" (single-image preset would break the start/end-frame design)

Note: an Envato Elements MCP connector was evaluated — it is catalog search only (no generation, no download); usable later for licensed supporting b-roll.

## Download blocker

This session's egress network policy denies `d8j0ntlcm91z4.cloudfront.net` (Higgsfield's media CDN), so generated files cannot be saved into `assets/images/` from this environment. Options:

1. Allow `d8j0ntlcm91z4.cloudfront.net` in the Claude Code environment's network policy, then re-download using the URLs above.
2. Download the two URLs manually and commit them to `assets/images/` with the exact filenames.

The Seedance video generation itself is **not** blocked — it can reference the two job IDs directly inside Higgsfield.
