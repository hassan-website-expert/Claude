# 💧 Sip — a water reminder that watches you drink

An on-screen alarm that reminds you to drink water on a timer. The twist: you can't
dismiss it by clicking a button. When it fires, your **camera turns on locally** and
the app only clears the alarm once it actually **sees you bring a glass to your mouth
and drink** for a few seconds.

Everything runs in your browser. No servers, no accounts, no video ever leaves your
machine.

## How it works

- A countdown timer fires the alarm every *N* minutes.
- The screen is taken over by a full-screen overlay + a repeating chime.
- The camera opens and two Google **MediaPipe** models run **on your device**:
  - a **face landmarker** locates your mouth,
  - a **hand landmarker** tracks your hands.
- When your hand (holding a cup) comes up near your mouth and **stays there** for the
  hold time you set, a progress ring fills. At 100% the alarm verifies the sip and
  clears itself.
- Snooze (5 min) and Skip are there too — Skip breaks your streak, so drinking is the
  path of least resistance.

## Running it

The camera and the AI models require a **secure origin**, so opening the file directly
(`file://…`) will *not* work in Chrome. Serve it from `localhost` instead — one command:

```bash
cd water-reminder
python3 -m http.server 8000
```

Then open **http://localhost:8000** in Chrome or Edge and:

1. Set your interval (e.g. every 45 min) and hold time (e.g. 3 s).
2. Click **Start reminders**, or **Test the alarm now** to try it immediately.
3. Allow camera access when prompted.
4. When the alarm fires, hold your glass up to your mouth and drink until the ring fills.

> No Python? Any static server works, e.g. `npx serve` or the VS Code "Live Server"
> extension. It also works if you host it over HTTPS.

## Notes & tuning

- **Privacy:** the camera stream is processed frame-by-frame in memory and never
  recorded or uploaded. The models download once from a CDN, then run locally.
- **Detection is a gesture proxy.** It confirms *"hand/cup held at the mouth for N
  seconds,"* which is what drinking looks like — it can't chemically verify it's water.
  That's the honest ceiling for a browser app, and in practice it's enough to make
  faking it more effort than just drinking.
- **Tune sensitivity** in `index.html`: the `threshold = faceW * 0.85` line controls how
  close your hand must get to your mouth; the hold time is set in the UI.
- Daily stats (sips, skips, streak) are stored in `localStorage` and reset each day.

## Ideas for later

- Detect an actual bottle/cup with an object-detection model for stronger proof.
- Desktop notifications so it nags you even when the tab is in the background.
- Package it as a small Electron/Tauri desktop app so it launches on login.
- Sync a daily hydration goal (e.g. 8 sips) and log history over time.
