const gameBoard = document.getElementById('gameBoard');
const gameOverMessage = document.getElementById('gameOverMessage');
const startButton = document.getElementById('startButton');
const volumeSlider = document.getElementById('volumeSlider');
const toggleDarkModeButton = document.getElementById('toggleDarkMode');

const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let cards = [...symbols, ...symbols];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let playerScores = [0, 0];
let currentPlayer = 0;
let matchedPairs = 0;

// Audio files
const flipSound = new Audio('audio/flip.mp3');
const matchSound = new Audio('audio/match.mp3');
const gameOverSound = new Audio('audio/gameover.mp3');
const wrongSounds = [
    new Audio('audio/wrong1.mp3'),
    new Audio('audio/wrong2.mp3'),
    new Audio('audio/wrong3.mp3')
];

// Set initial volume
setVolume(0.5);

// Shuffle the cards
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Create the game board
function createBoard() {
    gameBoard.innerHTML = ''; // Clear the board
    shuffle(cards);
    cards.forEach(symbol => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.symbol = symbol;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);

        const frontFace = document.createElement('img');
        frontFace.classList.add('front-face');
        frontFace.src = `images/${symbol}.png`; // 카드 앞면 이미지

        const backFace = document.createElement('img');
        backFace.classList.add('back-face');
        backFace.src = 'images/back.png'; // 카드 뒷면 이미지

        cardElement.appendChild(frontFace);
        cardElement.appendChild(backFace);
    });
}

// Handle card flip
function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

    flipSound.play(); // Play flip sound
    this.classList.add('flip');
    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    checkMatch();
}

// Check for a match
function checkMatch() {
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        matchSound.play(); // Play match sound
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        playerScores[currentPlayer]++;
        matchedPairs++;
        updateScore();
        resetTurn(true);
        if (matchedPairs === symbols.length) {
            endGame();
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            playRandomWrongSound(); // Play random wrong sound
            resetTurn(false);
        }, 1000);
    }
}

// Play a random wrong sound
function playRandomWrongSound() {
    const randomIndex = Math.floor(Math.random() * wrongSounds.length);
    wrongSounds[randomIndex].play();
}

// Reset turn
function resetTurn(isMatch) {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
    if (!isMatch) {
        currentPlayer = (currentPlayer + 1) % 2; // Switch player
    }
}

// Update score display
function updateScore() {
    document.getElementById('score1').textContent = playerScores[0];
    document.getElementById('score2').textContent = playerScores[1];
}

// End game and display winner
function endGame() {
    gameOverSound.play(); // Play game over sound
    let winner;
    if (playerScores[0] > playerScores[1]) {
        winner = "유저 2 컷";
    } else if (playerScores[0] < playerScores[1]) {
        winner = "유저 1 컷";
    } else {
        winner = "아유 나는 모르겠다";
    }
    gameOverMessage.textContent = `Game Over! ${winner}`;
}

// Set volume for all sounds
function setVolume(volume) {
    flipSound.volume = volume;
    matchSound.volume = volume;
    gameOverSound.volume = volume;
    wrongSounds.forEach(sound => sound.volume = volume);
}

// Start game on button click
startButton.addEventListener('click', () => {
    playerScores = [0, 0];
    currentPlayer = 0;
    matchedPairs = 0;
    gameOverMessage.textContent = '';
    updateScore();
    createBoard();
});

// Adjust volume on slider change
volumeSlider.addEventListener('input', (event) => {
    setVolume(event.target.value);
});

// Toggle dark mode
toggleDarkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});