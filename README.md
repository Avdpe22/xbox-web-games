# Xbox Web Games

A small static web project that mimics an Xbox-style game hub and includes a playable canvas demo game that responds to an Xbox controller via the Gamepad API.

## Overview

This project contains two main parts:

- [index.html](index.html): the Xbox-inspired hub page with a grid of game cards
- [games.html](games.html): a fullscreen canvas demo game template that can be launched from the hub

The hub loads games in an overlay iframe and gives the feel of navigating a console dashboard. The demo game is a minimal movement prototype where a green square responds to left-stick input and changes color when the A button is pressed.

## Features

- Dark Xbox-inspired UI with green highlight accents
- Responsive game card layout in the main hub
- Fullscreen game overlay with an Exit button
- Simple controller support using the browser Gamepad API
- Canvas-based game loop for movement and interaction
- Easy to extend by adding more game cards and game pages

## Project Structure

```text
xbox-web-games/
├── index.html        # Main Xbox-style game dashboard
├── games.html        # Sample canvas game demo
├── README.md         # Project documentation
└── (add more pages) # Each new game can be added as its own HTML page
```

## How to Run

Because this is a static HTML project, the simplest way to run it is with a local web server:

```bash
cd /workspaces/xbox-web-games
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## How It Works

### Hub page

The main hub in [index.html](index.html) displays game cards. Clicking a card calls the `launchGame()` function, which sets the iframe source and shows the fullscreen game container.

### Game template

The demo game in [games.html](games.html) does the following:

- creates a canvas that fills the viewport
- reads controller input with `navigator.getGamepads()`
- uses the left analog stick to move a player box
- changes the box color to bright green when the A button is pressed
- keeps the player inside the screen bounds
- redraws the scene every animation frame

## Customizing

To add more games:

1. Duplicate a game-card block in [index.html](index.html)
2. Change the `onclick` target to the new game's HTML file
3. Create a new HTML page similar to [games.html](games.html)

Example:

```html
<div class="game-card" onclick="launchGame('game2.html')">
    <h2>Game 2</h2>
    <p>Coming Soon</p>
</div>
```

## Notes

- This project is intended as a lightweight starter for browser-based game prototypes.
- Controller support depends on browser support for the Gamepad API and the connected gamepad.
- The demo is best experienced in a browser that supports modern gamepad input.

## License

This project is provided as a simple demo and is not currently tied to a formal license.
