# Project Notes

A running log of gotchas, fixes, and conventions for this project — things
that aren't obvious from the code alone and are easy to lose when adding a
new game.

## Required: gamepad focus fix for every new game

**Symptom:** a game works fine opened directly, but the controller doesn't
respond to it at all when launched from the hub ([index.html](index.html)).

**Cause:** the Xbox console browser (Edge) only exposes the Gamepad API to
whichever document currently has focus. Launching a game loads it inside the
hub's `<iframe>`, and that load can leave focus on the hub page instead of
the game — so `navigator.getGamepads()` inside the game never sees input.

**Fix:** every game must pull focus onto itself, right after `canvas` is
declared:

```js
const canvas = document.getElementById('gameCanvas');
// Xbox Edge (console browser) only exposes the Gamepad API to the currently
// focused document, and gains focus can be lost when loaded inside the hub's
// iframe -- pull focus onto this game whenever we get a chance to.
function ensureGameFocus() { window.focus(); canvas.focus({ preventScroll: true }); }
ensureGameFocus();
window.addEventListener('load', ensureGameFocus);
document.addEventListener('visibilitychange', () => { if (!document.hidden) ensureGameFocus(); });
window.addEventListener('gamepadconnected', ensureGameFocus);
const ctx = canvas.getContext('2d');
```

This pattern originated in [game.html](game.html) and was present through
[game15.html](game15.html) (Robot Wars), but games added after that —
[game16.html](game16.html), [game17.html](game17.html),
[zombieslug/game18.html](zombieslug/game18.html), [game19.html](game19.html),
and [game20.html](game20.html) — were missing it, which broke controller
input for all of them. Fixed 2026-08-18.

**Checklist for every new game file:**
- [ ] `ensureGameFocus()` block added right after `const canvas = ...`
- [ ] New card in [index.html](index.html) calls `launchGame('correct-file.html')`
      — double-check the filename; a copy-pasted card can point at the wrong
      game (this happened with the Game 20 / Football Maze card, which was
      wired to `zombieslug/game18.html`).
- [ ] Launch the game through the hub (not by opening the file directly) and
      confirm the controller works before calling it done — that's the only
      way this class of bug shows up.

## Verifying the fix without a physical controller

There's no gamepad hardware in this environment, so the fix here was
verified by code inspection (confirming the same focus-pulling pattern used
in the known-working games 1–15 was present in games 16–20) and a JS syntax
check on each file's inline `<script>`, not by an actual controller test.
Confirm on the Xbox with a controller when you get a chance.
