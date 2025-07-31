# main.py

from cube.cube_model import Cube
from solver.kociemba_solver import KociembaSolver
from utils.constants import *

def get_cube_from_user_input():
    """
    Prompts the user to enter the colors for each face with the standard orientation.
    """
    print("--- Rubik's Cube Solver ---")
    print("Please enter the colors for each face, with WHITE on top and GREEN at the front.")
    print("Use the following color codes: W, Y, O, R, G, B")
    print("Enter the 9 colors for a face as a single string (e.g., 'GGGGGGGGG').\n")

    face_order = [
        (UP, "Up (White Center)"),
        (LEFT, "Left (Orange Center)"),
        (FRONT, "Front (Green Center)"),
        (RIGHT, "Right (Red Center)"),
        (BACK, "Back (Blue Center)"),
        (DOWN, "Down (Yellow Center)")
    ]

    cube_state = {}
    for face_code, face_name in face_order:
        while True:
            raw_input = input(f"Enter the 9 colors for the {face_name} face: ").upper().replace(" ", "")
            if len(raw_input) == 9 and all(c in "WYORGB" for c in raw_input):
                face_matrix = [list(raw_input[i:i+3]) for i in range(0, 9, 3)]
                cube_state[face_code] = face_matrix
                break
            else:
                print("Invalid input. Please enter exactly 9 valid color characters (W,Y,O,R,G,B).")
    return Cube(state=cube_state)

if __name__ == "__main__":
    my_cube = get_cube_from_user_input()
    print("\n--- You entered the following cube state: ---")
    print(my_cube)

    if not my_cube.validate_state():
        print("\nThis is not a valid cube configuration. Exiting.")
    elif my_cube.is_solved():
        print("\nThe cube is already solved!")
    else:
        # USE THE NEW, FAST KOCIEMBA SOLVER
        solver = KociembaSolver(my_cube)
        solution_moves = solver.solve()
        
        print("\n-----------------------------------")
        print("           SOLUTION FOUND          ")
        print("-----------------------------------\n")
        print("A fast, optimal solution is:\n")
        print(solution_moves)
        print("\n")