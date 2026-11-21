# spot-the-difference-game

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mekii69/spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mekii69/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Lantern Cove: a spot-the-difference game with three hand-drawn procedural scenes — a dusk harbour, a cottage garden and a starlit camp. Two near-identical pictures side by side, seven differences each, gold markers on the differences found, a remaining counter, timer, hints, sounds and full keyboard play. Runs offline from static files, no network requests.

## Run it

```sh
python3 -m http.server 8000 --directory game
```

Then open http://localhost:8000 in desktop Chrome. The hand-in program is main.ts: MAKEFUN_OUTPUT_DIR=out node main.ts copies game/ and screenshots/ to the output directory and writes dossier.json.

---

<sub>Entered on [make.fun](https://make.fun/?ref=9zhm5f8f&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
