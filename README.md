# Xbox Web Games

A small static web project that mimics an Xbox-style game hub. It hosts a dashboard of browser games, most controllable with an Xbox controller via the Gamepad API, plus a phone-controlled Pictionary game built on WebRTC.

## Overview

- [index.html](index.html): the Xbox-inspired hub page with a grid of game cards. Clicking a card loads the game in a fullscreen overlay iframe.
- `game*.html`: the individual games (see [Games](#games) below).
- `pictionary/`: a separate multiplayer drawing game that pairs a TV/host screen with phone controllers over a peer-to-peer connection.

## Games

| File | Title | Description |
| --- | --- | --- |
| [game.html](game.html) | Test Template | Canvas + Gamepad API movement demo |
| [game2.html](game2.html) | Space Shooter | Fly & shoot |
| [game3.html](game3.html) | Base Assault | Destroy tadpoles |
| [game4.html](game4.html) | Toy Soldiers | Protect the base |
| [game5.html](game5.html) | Toy Soldiers Classic | Protect the base |
| [game6.html](game6.html) | Tadpole Attack v2A | Spawn army troops |
| [game7.html](game7.html) | Tadpole Swarm | Spawn army troops |
| [game8.html](game8.html) | Honey Rush | Extract the honey |
| [game9.html](game9.html) | Blocky Builder | Build bots, fight skeletons |
| [game10.html](game10.html) | The Claw | Win the prize |
| [game11.html](game11.html) | Tadpole vs Army | Two player versus mode |
| [game12.html](game12.html) | Hex & Hearth | Pass-and-play hex strategy |
| [pictionary/game13.html](pictionary/game13.html) | Pictionary | Phone-controlled drawing game |

New games are registered as a `.game-card` block in [index.html](index.html); the card's `onclick` calls `launchGame('gameN.html')`, which points the overlay iframe at that file.

## Features

- Dark Xbox-inspired UI with green highlight accents
- Responsive game card grid on the hub, keyboard-accessible (Enter/Space launches a card)
- Fullscreen game overlay with an Exit button
- Controller support via the browser Gamepad API (left stick movement, face buttons)
- A dozen canvas-based games covering shooters, tower-defense/base-assault, builders, a claw machine, and a hex strategy game
- A separate phone-as-controller drawing game (Pictionary) using PeerJS for peer-to-peer connections between a TV host and phone clients

## How to Run

Because this is a static project, the simplest way to run it is with a local web server:

```bash
cd /workspaces/xbox-web-games
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Note: the Pictionary game connects a host page to phone controllers over the network (via PeerJS), so the phone and TV/host must both be able to reach `unpkg.com` (for the PeerJS library) and each other's PeerJS signaling server — serving over `localhost` alone won't let a separate phone connect in.

## How It Works

### Hub page

[index.html](index.html) displays the game cards. Clicking (or pressing Enter/Space on) a card calls `launchGame(gameUrl)`, which sets the overlay iframe's `src` and shows the fullscreen game container. An Exit button in the overlay clears the iframe and returns to the hub.

### Games

Each `game*.html` file is a self-contained canvas game. Most follow the same basic pattern established in [game.html](game.html):

- create a canvas that fills the viewport
- read controller input with `navigator.getGamepads()`
- use the left analog stick to move the player, and face buttons for actions
- run a `requestAnimationFrame` loop to update and redraw the scene

Beyond that shared template, individual games add their own mechanics (waves of enemies, building/placement, hex-grid turns, claw-machine physics, etc.) — open the file directly to see its specifics.

### Pictionary (`pictionary/`)

A separate multiplayer game outside the Gamepad-based games:

- [game13.html](pictionary/game13.html) — the TV/host display. Generates a 4-letter room code and paints strokes received from connected phones onto a shared canvas.
- [host.js](pictionary/host.js) — sets up a `Peer` with the room code as its ID, listens for phone connections, and relays drawing/color/clear events to the TV canvas.
- [controller.html](pictionary/controller.html) — the phone UI: a room code entry screen, then a touch-drawing canvas with a color palette and clear button.
- [phone.js](pictionary/phone.js) — connects to the host's `Peer` using the entered room code and streams touch/draw events to it.

Connections are peer-to-peer via [PeerJS](https://peerjs.com/) (loaded from unpkg), so no custom backend is required, but each client does need internet access to reach the public PeerJS signaling/STUN infrastructure.

## Customizing

To add a new game:

1. Create a new `gameN.html` file (use [game.html](game.html) as a starting template for Gamepad-based games).
2. Add a new `.game-card` block in [index.html](index.html):

```html
<div class="game-card" tabindex="0" onclick="launchGame('gameN.html')" onkeypress="handleKeyPress(event, 'gameN.html')">
    <h2>Your Game Title</h2>
    <p>Short description</p>
</div>
```

## Notes

- This project is a lightweight collection of browser-based game prototypes; each game file is independent and can be opened/edited on its own.
- Controller support depends on browser support for the Gamepad API and the connected gamepad.
- Pictionary requires two separate clients (a host/TV and at least one phone) and a live network connection between them.

## License

This project is provided as a simple demo and is not currently tied to a formal license.
