AMBIENT AUDIO BED — one-file drop-in
====================================

The hero plays a continuous, looping ambient bed (soft fire crackle + evening
cookout room tone) UNDER the whole scroll. It is muted by default; the little
"Sound" toggle in the corner unlocks and swells it with one tap. The toggle only
appears once a playable file exists here — so until you add the file, nothing
looks broken.

CURRENTLY WIRED FILE
--------------------
The hero is wired to this file (a licensed Envato Elements loop):
    public/audio/28102 Countryside evening campfire ambience loop-full.mp3
Reference lives in src/hero/CinematicHero.jsx (AMBIENT_SRC), URL-encoded because
the filename contains spaces. To swap in a different loop, either overwrite this
file or drop a new one and update AMBIENT_SRC to match.

TO SWAP IN A DIFFERENT LOOP
---------------------------
1. Use a licensed, seamless loop (your Envato Elements license covers web use).
   Any warm fire-crackle / outdoor-ambience loop works — 30–90s is plenty.

2. Save the MP3 in this folder and point AMBIENT_SRC at it (URL-encode spaces).

3. Redeploy. The "Sound" toggle appears automatically once the file is playable.

Notes
-----
- Keep it subtle and low — it is atmosphere, not a soundtrack. Default playback
  volume is set to 0.5 in CinematicHero.jsx (AMBIENT_VOLUME) if you want to tune.
- This is NOT Mr. Tendernism's voice — it is ambience only. A real recorded
  voiceover, if ever added, would be a separate, optional element.
- Licensing: use a track you are licensed to use (your Envato Elements license
  covers web use). Do not ship an unlicensed or watermarked preview.
