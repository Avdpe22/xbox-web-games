const peer = new Peer();
let conn = null;

const loginScreen = document.getElementById('login-screen');
const drawingScreen = document.getElementById('drawing-screen');
const canvas = document.getElementById('phoneCanvas');
const ctx = canvas.getContext('2d'); // ADDED: Get the local canvas context

// Local brush settings
let currentColor = 'black';
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.lineWidth = 5;

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
        
        // Re-apply settings after resizing canvas (resizing clears context state)
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 5;
        ctx.strokeStyle = currentColor;
    });

    conn.on('error', (err) => {
        alert('Connection failed: ' + err);
    });
}

// --- Toolbar Logic ---

function setColor(color, element) {
    if (!conn) return;
    
    // Update local brush color
    currentColor = color;
    ctx.strokeStyle = currentColor;

    // Update UI selection outline
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    // Tell the TV to change our brush color
    conn.send({ type: 'COLOR', color: color });
}

function clearCanvas() {
    if (!conn) return;
    
    // Clear the local phone screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Tell the TV to wipe the screen
    conn.send({ type: 'CLEAR' });
}

// --- Drawing Logic ---

// We need the raw coordinates for local drawing, and normalized for the TV
function getCoordinates(touchEvent) {
    const rect = canvas.getBoundingClientRect(); 
    const rawX = touchEvent.touches[0].clientX - rect.left;
    const rawY = touchEvent.touches[0].clientY - rect.top;
    
    return {
        rawX: rawX,
        rawY: rawY,
        normX: rawX / canvas.width,
        normY: rawY / canvas.height
    };
}

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    const coords = getCoordinates(e);
    
    // 1. Draw locally on the phone
    ctx.beginPath();
    ctx.moveTo(coords.rawX, coords.rawY);
    
    // 2. Send to the TV
    conn.send({ type: 'START', x: coords.normX, y: coords.normY });
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); 
    const coords = getCoordinates(e);
    
    // 1. Draw locally on the phone
    ctx.lineTo(coords.rawX, coords.rawY);
    ctx.stroke();
    
    // 2. Send to the TV
    conn.send({ type: 'MOVE', x: coords.normX, y: coords.normY });
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    // Finish local line
    ctx.beginPath(); 
    
    // Tell TV line is finished
    conn.send({ type: 'END' });
});