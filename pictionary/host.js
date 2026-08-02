// Generate a 4-letter alphanumeric code (e.g., "K9B2")
const generateCode = () => Math.random().toString(36).substring(2, 6).toUpperCase();
const roomCode = generateCode();

document.getElementById('room-code').innerText = roomCode;

// Initialize PeerJS with the room code
const peer = new Peer(roomCode);
const tvCanvas = document.getElementById('tvCanvas');
const ctx = tvCanvas.getContext('2d');

// Configure brush settings
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.lineWidth = 8;

// Keep track of each connected player's brush state
const players = {};

peer.on('open', (id) => {
    console.log('Host is ready. Room code:', id);
});

peer.on('connection', (conn) => {
    console.log('Player connected:', conn.peer);
    
    // Default state for a new player
    players[conn.peer] = { color: 'black', lastX: 0, lastY: 0 };

    conn.on('data', (data) => {
        const player = players[conn.peer];

        if (data.type === 'COLOR') {
            player.color = data.color;
        } 
        else if (data.type === 'CLEAR') {
            ctx.clearRect(0, 0, tvCanvas.width, tvCanvas.height);
        }
        else if (data.type === 'START') {
            player.lastX = data.x * tvCanvas.width;
            player.lastY = data.y * tvCanvas.height;
        } 
        else if (data.type === 'MOVE') {
            const currentX = data.x * tvCanvas.width;
            const currentY = data.y * tvCanvas.height;

            // Draw a line from the player's last position to their new position
            ctx.beginPath();
            ctx.moveTo(player.lastX, player.lastY);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = player.color;
            ctx.stroke();

            // Update their last known position
            player.lastX = currentX;
            player.lastY = currentY;
        }
    });

    conn.on('close', () => {
        delete players[conn.peer];
    });
});