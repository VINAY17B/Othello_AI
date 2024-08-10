import random

def get_ai_move(board, player):
    try:
        depth = 3  # Depth for Minimax
        _, best_move = minimax(board, player, depth, float('-inf'), float('inf'), True)
        if best_move is None:
            raise ValueError("No valid moves available")
        return best_move
    except Exception as e:
        print(f"Error in AI move calculation: {e}")
        return None

def minimax(board, player, depth, alpha, beta, maximizing_player):
    if depth == 0 or is_game_over(board):
        return evaluate_board(board, player), None

    valid_moves = get_valid_moves(board, player)
    if not valid_moves:
        return evaluate_board(board, player), None

    best_move = None

    if maximizing_player:
        max_eval = float('-inf')
        for move in valid_moves:
            new_board = make_move(board, move, player)
            eval, _ = minimax(new_board, get_opponent(player), depth - 1, alpha, beta, False)
            if eval > max_eval:
                max_eval = eval
                best_move = move
            alpha = max(alpha, eval)
            if beta <= alpha:
                break
        return max_eval, best_move
    else:
        min_eval = float('inf')
        for move in valid_moves:
            new_board = make_move(board, move, player)
            eval, _ = minimax(new_board, get_opponent(player), depth - 1, alpha, beta, True)
            if eval < min_eval:
                min_eval = eval
                best_move = move
            beta = min(beta, eval)
            if beta <= alpha:
                break
        return min_eval, best_move

def evaluate_board(board, player):
    opponent = get_opponent(player)
    player_score = sum(row.count(player) for row in board)
    opponent_score = sum(row.count(opponent) for row in board)
    return player_score - opponent_score

def is_game_over(board):
    if not get_valid_moves(board, 'black') and not get_valid_moves(board, 'white'):
        return True
    return False

def get_valid_moves(board, player):
    valid_moves = []
    for i in range(8):
        for j in range(8):
            if is_valid_move(board, player, i, j):
                valid_moves.append((i, j))
    return valid_moves

def is_valid_move(board, player, row, col):
    if board[row][col] is not None:
        return False

    opponent = get_opponent(player)
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, 1), (-1, 1), (1, -1)]
    
    for direction in directions:
        r, c = row + direction[0], col + direction[1]
        has_opponent_between = False
        
        while 0 <= r < 8 and 0 <= c < 8:
            if board[r][c] == opponent:
                has_opponent_between = True
            elif board[r][c] == player and has_opponent_between:
                return True
            else:
                break
            r += direction[0]
            c += direction[1]
    
    return False

def make_move(board, move, player):
    new_board = [row[:] for row in board]
    row, col = move
    new_board[row][col] = player
    flip_pieces(new_board, move, player)
    return new_board

def flip_pieces(board, move, player):
    opponent = get_opponent(player)
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, 1), (-1, 1), (1, -1)]
    
    for direction in directions:
        r, c = move[0] + direction[0], move[1] + direction[1]
        to_flip = []
        
        while 0 <= r < 8 and 0 <= c < 8:
            if board[r][c] == opponent:
                to_flip.append((r, c))
            elif board[r][c] == player:
                for flip in to_flip:
                    board[flip[0]][flip[1]] = player
                break
            else:
                break
            r += direction[0]
            c += direction[1]

def get_opponent(player):
    return 'white' if player == 'black' else 'black'
