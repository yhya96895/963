# shahd-forever

A local, Arabic (RTL) proposal website. Plain HTML/CSS/JS, no build step.

## Run

```bash
cd shahd-forever
npx serve .          # or: python3 -m http.server 8080
```

Open the printed URL on the computer or iPad (same Wi-Fi: use the computer's IP address).
Do not open `index.html` by double-click if you want the song to start at a chosen second; use a server.

## Where to put your content

Everything is in `js/config.js`:

- `stage1.message`, `stage2.message`: the two big messages
- `stage1.buttons`, `stage2.buttons`: button labels (including options 3 and 4)
- `noSweetMessage`: shown when she presses "No" on page 2
- `pistachioPhrase`: the phrase in the middle of the pistachio animation
- `pistachioImages`: list of pistachio SVGs in `assets/`; each pistachio in the animation picks one at random
- `finalMessage`: shown after the photo hearts finish
- `photos`: list of image paths (put files in `assets/images/`)
- `song`: file in `assets/audio/`, `startAt` in seconds, `volume`, `loop`
- `timings`: speed and duration of every animation
- `celebrationHeartScreenFraction`: photo heart size relative to the screen (default 1/6)

Photos and song that are missing are skipped gracefully (hearts show a pink-purple gradient, no audio).

## Flow

1. Page 1: Yes goes to page 2; No runs away; option 3 plays the ERROR animation; option 4 plays the pistachio animation. Both animations return to the question automatically.
2. Page 2: same layout, no tricks on Yes/No. No shows a sweet message; options 3 and 4 play the same animations.
3. Yes on page 2: song plays, photo hearts float up, then the final message appears.
