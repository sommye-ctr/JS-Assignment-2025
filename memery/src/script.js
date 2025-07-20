const PROMPTS_DATA = [
    "a house", "a tree", "a sun", "a car", "a flower", "a dog",
    "a cat", "a book", "a star", "a happy face", "a sad face", "a bird",
    "a boat", "a mountain", "a fish", "a cloud", "a heart", "a moon"
];

const startGameBtn = document.getElementById("start-game-btn");
const doneDrawingBtn = document.getElementById("done-drawing-btn");
const startMatchingBtn = document.getElementById("start-matching-btn");
const gameRound = document.getElementById("game-round");
const gameMatches = document.getElementById("game-matches-count");
const gameMessage = document.getElementById("game-message");
const gameArea = document.getElementById("game-area");

let canvas = null;
let clearCanvasBtn = null;
let currentPlayerHeading = null;

let context = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

let round = 0;
let matches = 0;
let prompt = "";
let addedPrompts = [];
let isPlayer1Turn = true;
let player1Cards = [];
let player2Cards = [];

const updateRound = (val) => {
    round = val;
    gameRound.textContent = `Round ${round}/6`;
}
const updateMatches = (count) => {
    matches = count;
    gameMatches.textContent = `Matches ${matches}`;
}
const updatePrompt = () => {
    let rand = Math.floor(Math.random() * PROMPTS_DATA.length);
    while (addedPrompts.includes(rand)) {
        rand = Math.floor(Math.random() * PROMPTS_DATA.length);
    }
    addedPrompts.push(rand);
    prompt = PROMPTS_DATA[rand];
    gameMessage.textContent = `Draw ${prompt}`;
}
const updatePlayer = (val) => {
    isPlayer1Turn = val;
    if (isPlayer1Turn) {
        currentPlayerHeading.textContent = "Player 1";
    } else {
        currentPlayerHeading.textContent = "Player 2";
    }
}

const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

const startDrawing = (event) => {
    isDrawing = true;
    const pos = getPos(event);
    lastX = pos.x;
    lastY = pos.y;

    event.preventDefault();
}
const stopDrawing = (event) => {
    if (!isDrawing) return;

    isDrawing = false;
    event.preventDefault();
}
const draw = (event) => {
    if (!isDrawing) return;

    const pos = getPos(event);

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(pos.x, pos.y);
    context.stroke();

    lastX = pos.x;
    lastY = pos.y;
    event.preventDefault();
}
const clearCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
const addCanvasListeners = () => {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    clearCanvasBtn.addEventListener("click", clearCanvas)
}

const submitDrawing = () => {
    let data = {
        img: canvas.toDataURL(),
        prompt: prompt,
    };
    if (isPlayer1Turn) {
        player1Cards.push(data);
    } else {
        player2Cards.push(data)
        if (round === 6) {
            gameMessage.textContent = "All Drawings Completed!";
            doneDrawingBtn.style.display = "none";
            startMatchingBtn.style.display = "block";
            gameArea.replaceChildren();
            return;
        }
        updateRound(round + 1);
        updatePrompt();
    }
    clearCanvas();
    updatePlayer(!isPlayer1Turn);
}
const startGame = () => {
    const template = document.getElementById("canvas-container");
    gameArea.replaceChildren(template.content);

    canvas = document.getElementById("canvas");
    clearCanvasBtn = document.getElementById("clear-btn");
    currentPlayerHeading = document.getElementById("current-player-heading")

    doneDrawingBtn.style.display = "block";
    startGameBtn.style.display = "none";

    [canvas.width, canvas.height] = [canvas.parentElement.clientWidth, canvas.parentElement.clientHeight];
    context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.lineCap = "round";
    context.lineWidth = 4;
    context.lineJoin = "round";
    context.strokeStyle = "black";
    addCanvasListeners();

    updatePrompt();
    updateRound(1);
}
const initGame = () => {
    doneDrawingBtn.style.display = "none";
    startMatchingBtn.style.display = "none";
}

doneDrawingBtn.addEventListener("click", submitDrawing);
startGameBtn.addEventListener("click", startGame);
document.addEventListener('DOMContentLoaded', initGame);
