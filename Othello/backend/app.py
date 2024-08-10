from flask import Flask, request, jsonify
from flask_cors import CORS
from othello import get_ai_move

app = Flask(__name__)
CORS(app)

@app.route('/api/move', methods=['POST'])
def ai_move():
    try:
        data = request.json
        board = data.get('board')
        player = data.get('player')
        
        if not board or not player:
            return jsonify({"error": "Invalid input"}), 400
        
        # Validate board dimensions
        if len(board) != 8 or any(len(row) != 8 for row in board):
            return jsonify({"error": "Invalid board size"}), 400
        
        move = get_ai_move(board, player)
        
        if move is None:
            return jsonify({"error": "AI did not return a valid move"}), 500
        
        return jsonify({'move': move})
    
    except Exception as e:
        print(f"Error: {e}")  # Print error to console
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
