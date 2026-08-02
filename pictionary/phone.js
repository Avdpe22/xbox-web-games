const peer = new Peer();
let conn = null;

const loginScreen = document.getElementById('login-screen');
const drawingScreen = document.getElementById('drawing-screen');
const canvas = document.getElementById('phoneCanvas');

function joinGame() {
    const code = document.getElementById('room-code-input').value.toUpperCase();
    if (code.length !== 4) return alert('Enter a 4-letter code');

    // Connect to the Host TV
    conn = peer.connect(code);

    conn.on('open', () => {
        // Swap screens
        loginScreen.style.display = 'none';
        drawingScreen.style.display = 'flex';
        
        // Dynamically size the canvas to fit the phone's remaining screen space
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    });

    conn.on('error', (err) => {
        alert('Connection failed: ' + err);
    });
}

// --- Toolbar Logic ---

function setColor(color, element) {
    if (!conn) return;
    
    // Update UI selection outline
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    // Tell the TV to change our brush color
    conn.send({ type: 'COLOR', color: color });
}

function clearCanvas() {
    if (!conn) return;
    // Tell the TV to wipe the screen
    conn.send({ type: 'CLEAR' });
}

// --- Drawing Logic ---

function getNormalizedCoordinates(touchEvent) {
    const rect = canvas.getBoundingClientRect(); 
    const rawX = touchEvent.touches[0].clientX - rect.left;
    const rawY = touchEvent.touches[0].clientY - rect.top;
    
    return {
        x: rawX / canvas.width,
        y: rawY / canvas.height
    };
}

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    const coords = getNormalizedCoordinates(e);
    conn.send({ type: 'START', x: coords.x, y: coords.y });
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); 
    const coords = getNormalizedCoordinates(e);
    conn.send({ type: 'MOVE', x: coords.x, y: coords.y });
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    conn.send({ type: 'END' });
});