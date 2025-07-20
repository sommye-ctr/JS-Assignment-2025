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

let gameBoard = null;
let matchingMessage = null;

let context = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

let round = 0;
let matches = 0;
let prompt = "";
let addedPrompts = [];
let isPlayer1Turn = true;
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

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

const flipCard = (event) => {
    if (lockBoard) return;

    const clickedCardElement = event.currentTarget;
    const cardData = cards[clickedCardElement.dataset.index];

    if (cardData.isFlipped || cardData.isMatched) return;

    cardData.isFlipped = true;
    clickedCardElement.classList.add('flipped');

    if (!firstCard) {
        firstCard = cardData;
    } else {
        secondCard = cardData;
        lockBoard = true;
        checkForMatch();
    }
}
const checkForMatch = () => {
    if (firstCard.pairId === secondCard.pairId) {
        disableCards();
    } else {
        unflipCards();
    }
}
const disableCards = () => {
    updateMatches(matches + 1);

    firstCard.isMatched = true;
    secondCard.isMatched = true;
    firstCard.element.classList.add('matched');
    secondCard.element.classList.add('matched');

    firstCard.element.removeEventListener('click', flipCard);
    secondCard.element.removeEventListener('click', flipCard);

    resetBoard();
    checkWin();
}
const unflipCards = () => {
    matchingMessage.textContent = 'No match! Try again.';
    setTimeout(() => {
        firstCard.isFlipped = false;
        secondCard.isFlipped = false;
        firstCard.element.classList.remove('flipped');
        secondCard.element.classList.remove('flipped');
        matchingMessage.textContent = '';
        resetBoard();
    }, 1000);
}
const resetBoard = () => {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}
const checkWin = () => {
    if (matches === cards.length / 2) { // Total pairs = total cards / 2
        matchingMessage.textContent = `Congratulations! You found all pairs!`;
    }
}
const renderCards = () => {
    cards.forEach((cardData, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.index = `${index}`;
        cardElement.dataset.pairId = cardData.prompt;

        const front = document.createElement('div');
        front.classList.add('front-face');
        front.textContent = "?"
        const back = document.createElement('div');
        back.classList.add('back-face');
        const img = document.createElement('img');
        img.src = cardData.img;

        back.appendChild(img);
        cardElement.appendChild(front);
        cardElement.appendChild(back);

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
        cardData.element = cardElement;
    });
}

const startMatching = () => {
    const template = document.getElementById("matching-container");
    if (!template) return console.error("Template not found!");

    gameArea.replaceChildren(template.content.cloneNode(true));

    gameBoard = document.getElementById('game-board');
    matchingMessage = document.getElementById('matching-message');

    updateMatches(0);
    matchingMessage.textContent = "";

    //cleaning prev cards
    gameBoard.replaceChildren();

    shuffle(cards);
    renderCards();
}
const submitDrawing = () => {
    let data = {
        img: canvas.toDataURL(),
        prompt: prompt,
        player: isPlayer1Turn ? 1 : 2,
        isFlipped: false,
        isMatched: false,
        element: null,
        pairId: prompt,
    };
    cards.push(data);
    if (!isPlayer1Turn) {
        if (round === 6){
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
    gameArea.replaceChildren(template.content.cloneNode(true));

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

startMatchingBtn.addEventListener("click", startMatching)
doneDrawingBtn.addEventListener("click", submitDrawing);
startGameBtn.addEventListener("click", startGame);
document.addEventListener('DOMContentLoaded', initGame);
