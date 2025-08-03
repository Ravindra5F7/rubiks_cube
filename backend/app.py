from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import sys
import os

# Add parent directory to sys.path to import modules from root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import kociemba library
try:
    import kociemba
except ImportError as e:
    print(f"Failed to import kociemba: {e}")
    kociemba = None

from generate_scramble import generate_valid_scramble
from cube.cube_model import Cube
from solver.kociemba_solver import KociembaSolver

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/scramble', methods=['GET'])
def api_scramble():
    # Capture the output of generate_valid_scramble
    buffer = io.StringIO()
    sys.stdout = buffer
    try:
        generate_valid_scramble()
        output = buffer.getvalue()
    finally:
        sys.stdout = sys.__stdout__
    return jsonify({'scramble': output})

@app.route('/api/solve', methods=['POST'])
def api_solve():
    data = request.json
    if not data or 'cube_state' not in data:
        return jsonify({'error': 'Missing cube_state in request'}), 400

    cube_state = data['cube_state']
    
    # Debug log the received cube state
    print("Received cube state:", cube_state)
    
    # Log the structure of the cube state
    if isinstance(cube_state, dict):
        print("Cube state structure:")
        for face, rows in cube_state.items():
            print(f"  {face}: {rows}")
    else:
        print("Cube state is not a dictionary")
    
    # Validate the cube state structure
    expected_faces = ['U', 'D', 'L', 'R', 'F', 'B']
    if not isinstance(cube_state, dict):
        return jsonify({'error': 'Invalid cube_state format: must be a dictionary'}), 400
    
    for face in expected_faces:
        if face not in cube_state:
            return jsonify({'error': f'Missing face "{face}" in cube_state'}), 400
        if not isinstance(cube_state[face], list) or len(cube_state[face]) != 3:
            return jsonify({'error': f'Invalid format for face "{face}": must be a 3x3 array'}), 400
        for row in cube_state[face]:
            if not isinstance(row, list) or len(row) != 3:
                return jsonify({'error': f'Invalid format for face "{face}": rows must have 3 elements'}), 400

    try:
        # Test with a known valid cube state first
        print("Testing with a known valid cube state...")
        try:
            # A simple solved cube state string for Kociemba
            solved_cube_string = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
            print(f"Testing Kociemba with solved cube string: {solved_cube_string}")
            test_solution = kociemba.solve(solved_cube_string)
            print(f"Kociemba test successful, solution: {test_solution}")
        except Exception as test_e:
            print(f"Kociemba test failed: {test_e}")
            return jsonify({'error': f'Kociemba library test failed: {test_e}'}), 500
        
        cube = Cube(state=cube_state)
        # Validate the cube state
        if not cube.validate_state():
            # Log detailed validation info
            all_stickers = []
            for face_name in cube.faces:
                for row in cube.faces[face_name]:
                    all_stickers.extend(row)
            from collections import Counter
            counts = Counter(all_stickers)
            print(f"Sticker counts: {counts}")
            return jsonify({'error': 'Invalid cube state: validation failed'}), 400
            
        # Log the cube state string representation
        solver = KociembaSolver(cube)
        cube_string = solver._generate_kociemba_string()
        print(f"Cube string for Kociemba: {cube_string}")
        
        solution = solver.solve()
        return jsonify({'solution': solution})
    except Exception as e:
        print("Error solving cube:", str(e))
        # Return a more detailed error message
        error_msg = str(e)
        if "Invalid cube string" in error_msg:
            return jsonify({'error': f'Invalid cube state: {error_msg}'}), 400
        return jsonify({'error': f'Error solving cube: {error_msg}'}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
