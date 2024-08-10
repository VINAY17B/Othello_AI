const board = document.getElementById('board');
const currentPlayerDisplay = document.getElementById('current-player');
const winnerDisplay = document.getElementById('winner');
const modeSelection = document.getElementById('mode-selection');
const boardContainer = document.getElementById('board-container');

let currentPlayer = 'black'; // 'black' or 'white'
let gameBoard = Array(8).fill(null).map(() => Array(8).fill(null));
let gameOver = false;
let isAiGame = false;

document.addEventListener('DOMContentLoaded', () => {
    const rulesButton = document.getElementById('rules-button');
    const rulesModal = document.getElementById('rules-modal');
    const closeRulesButton = document.getElementById('close-rules');

    // Function to open the rules modal
    function openRulesModal() {
        rulesModal.style.display = 'flex';
    }

    // Function to close the rules modal
    function closeRulesModal() {
        rulesModal.style.display = 'none';
    }

    // Event listener for the "Rules" button
    rulesButton.addEventListener('click', openRulesModal);

    // Event listener for the close button inside the modal
    closeRulesButton.addEventListener('click', closeRulesModal);

    // Close the modal if the user clicks outside of the modal content
    rulesModal.addEventListener('click', (event) => {
        if (event.target === rulesModal) {
            closeRulesModal();
        }
    });
});


document.getElementById('player-vs-player').addEventListener('click', () => {
    isAiGame = false;
    startGame();
});

document.getElementById('player-vs-ai').addEventListener('click', () => {
    isAiGame = true;
    startGame();
});

function startGame() {
    modeSelection.style.display = 'none';
    boardContainer.style.display = 'block';
    initializeBoard();
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}`;

    // Check if the current player has valid moves
    if (getValidMoves(gameBoard, currentPlayer).length === 0) {
        // If no valid moves, switch to the other player
        currentPlayer = getOpponent(currentPlayer);
        currentPlayerDisplay.textContent = `Current Player: ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}`;

        // Check if the opponent also has no valid moves
        if (getValidMoves(gameBoard, currentPlayer).length === 0) {
            // Game over as both players have no moves
            gameOver = true;
            checkWinner();
            return;
        }
    }

    if (isAiGame && currentPlayer === 'white') {
        setTimeout(aiMove, 500); // Pause a bit before AI move
    }
}

async function aiMove() {
    try {
        const response = await fetch('http://localhost:5000/api/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                board: gameBoard,
                player: currentPlayer
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const move = data.move;

        if (move) {
            makeMove(move[0], move[1]);
        } else {
            console.error('AI did not return a valid move:', data);
        }
    } catch (error) {
        console.error('Error during AI move:', error);
    }
}

function checkWinner() {
    let blackCount = 0;
    let whiteCount = 0;

    gameBoard.forEach(row => {
        row.forEach(cell => {
            if (cell === 'black') blackCount++;
            if (cell === 'white') whiteCount++;
        });
    });

    if (blackCount + whiteCount === 64 || 
        (getValidMoves(gameBoard, 'black').length === 0 && getValidMoves(gameBoard, 'white').length === 0)) {
        gameOver = true;
        if (blackCount > whiteCount) {
            winnerDisplay.textContent = "Winner: Black";
        } else if (whiteCount > blackCount) {
            winnerDisplay.textContent = "Winner: White";
        } else {
            winnerDisplay.textContent = "It's a tie!";
        }
    }
}

function handleCellClick(event) {
    if (gameOver || (isAiGame && currentPlayer === 'white')) return;

    const cell = event.target;
    const row = cell.getAttribute('data-row');
    const col = cell.getAttribute('data-col');

    makeMove(parseInt(row), parseInt(col));
}

function makeMove(row, col) {
    if (gameBoard[row][col] === null && isValidMove(gameBoard, currentPlayer, row, col)) {
        gameBoard[row][col] = currentPlayer;
        const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
        if (cell) {
            cell.innerHTML = `<div class="disc ${currentPlayer}"></div>`;
            flipPieces(row, col, currentPlayer);
            checkWinner();
            if (!gameOver) switchPlayer();
        }
    }
}

function flipPieces(row, col, player) {
    const opponent = getOpponent(player);
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]];
    
    for (const direction of directions) {
        let r = row + direction[0];
        let c = col + direction[1];
        let flipPositions = [];
        while (0 <= r && r < 8 && 0 <= c && c < 8) {
            if (gameBoard[r][c] === opponent) {
                flipPositions.push([r, c]);
            } else if (gameBoard[r][c] === player) {
                for (const [fr, fc] of flipPositions) {
                    gameBoard[fr][fc] = player;
                    const flipCell = document.querySelector(`[data-row='${fr}'][data-col='${fc}']`);
                    if (flipCell) {
                        flipCell.innerHTML = `<div class="disc ${player}"></div>`;
                    }
                }
                break;
            } else {
                break;
            }
            r += direction[0];
            c += direction[1];
        }
    }
}

function initializeBoard() {
    board.innerHTML = ''; // Clear the board
    gameBoard = Array(8).fill(null).map(() => Array(8).fill(null));
    gameOver = false;
    currentPlayer = 'black';
    currentPlayerDisplay.textContent = `Current Player: ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}`;
    winnerDisplay.textContent = '';

    // Set up the initial board state
    gameBoard[3][3] = 'white';
    gameBoard[3][4] = 'black';
    gameBoard[4][3] = 'black';
    gameBoard[4][4] = 'white';

    // Ensure the board cells are added to the DOM
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-col', j);
            cell.addEventListener('click', handleCellClick);

            // Set initial discs for the central positions
            if (i === 3 && j === 3) {
                cell.innerHTML = `<div class="disc white"></div>`;
            } else if (i === 3 && j === 4) {
                cell.innerHTML = `<div class="disc black"></div>`;
            } else if (i === 4 && j === 3) {
                cell.innerHTML = `<div class="disc black"></div>`;
            } else if (i === 4 && j === 4) {
                cell.innerHTML = `<div class="disc white"></div>`;
            }

            board.appendChild(cell);
        }
    }
}

function isValidMove(board, player, row, col) {
    if (board[row][col] !== null) {
        return false;
    }

    const opponent = getOpponent(player);
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]];

    for (const direction of directions) {
        let r = row + direction[0];
        let c = col + direction[1];
        let foundOpponent = false;
        while (0 <= r && r < 8 && 0 <= c && c < 8) {
            if (board[r][c] === opponent) {
                foundOpponent = true;
            } else if (board[r][c] === player && foundOpponent) {
                return true;
            } else {
                break;
            }
            r += direction[0];
            c += direction[1];
        }
    }
    return false;
}

function getValidMoves(board, player) {
    const validMoves = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (isValidMove(board, player, i, j)) {
                validMoves.push([i, j]);
            }
        }
    }
    return validMoves;
}

function getOpponent(player) {
    return player === 'black' ? 'white' : 'black';
}


