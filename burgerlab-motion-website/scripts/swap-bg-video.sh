#!/usr/bin/env bash
set -euo pipefail

INPUT="$1"
OUTPUT="website/public/bg.mp4"
OUTPUT_WEBM="website/public/bg.webm"

mkdir -p website/public

ffmpeg -y -i "$INPUT" -an -c:v libx264 -preset slow -crf 18 \
  -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p \
  -movflags +faststart "$OUTPUT"

# VP9 fallback for browsers without H.264 (also all-keyframe for scrubbing)
ffmpeg -y -i "$INPUT" -an -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -g 1 -keyint_min 1 -pix_fmt yuv420p "$OUTPUT_WEBM"

echo "Encoded all-keyframe background video to $OUTPUT and $OUTPUT_WEBM"
