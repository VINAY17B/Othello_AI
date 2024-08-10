# Othello_AI

# Othello Game

Welcome to the Othello Game! This project is a classic board game implemented using HTML, CSS, JavaScript for the frontend, and Python with Flask for the backend. The game allows you to play Othello against another player or against an AI.

## Features

- **Play Modes**: Choose between Player vs Player and Player vs AI modes.
- **AI Opponent**: Play against a simple AI that makes moves on your behalf.
- **Game Rules**: Display the rules of the game in a modal.
- **Backend Integration**: Uses Flask to handle AI moves in Player vs AI mode.


Algorithm Details:

AI Algorithm
The AI in this game uses a Minimax algorithm with Alpha-Beta pruning to decide the best move. Here’s a brief overview of how the algorithm works:

Minimax Algorithm: This is a recursive algorithm used for decision-making in two-player games. It simulates all possible moves to a certain depth, then evaluates the end states to determine the best move.

Maximizing Player: The AI (white) tries to maximize its advantage.
Minimizing Player: The opponent (black) tries to minimize the AI's advantage.
Alpha-Beta Pruning: This optimization technique reduces the number of nodes evaluated in the Minimax algorithm. It skips branches that are guaranteed to be worse than the current best option found, making the algorithm more efficient.

Implementation:

The AI sends the current board state and player color to the Flask backend.
The backend computes the best move using the Minimax algorithm with Alpha-Beta pruning.
The best move is returned to the frontend and executed on the board.
How It Works in the Game
Player vs AI Mode: When you select Player vs AI mode, the AI opponent will make its move after you make a move. The AI evaluates possible moves and selects the one that provides the best outcome according to the Minimax algorithm.





