# solver/kociemba_solver.py

import kociemba
from cube.cube_model import Cube
from utils.constants import *

class KociembaSolver:
    def __init__(self, cube_to_solve: Cube):
        self.cube = cube_to_solve.deepcopy()
        self.solution_moves = ""

    def solve(self):
        """
        Translates the cube state into a Kociemba-compatible string
        and uses the library to find a fast, optimal solution.
        """
        print("\n--- Using Kociemba's Two-Phase Algorithm for a Fast Solution ---")
        try:
            cube_string = self._generate_kociemba_string()
            print(f"Generated Kociemba String: {cube_string}")
            print(f"Kociemba String Length: {len(cube_string)}")
            
            # Validate the cube string before sending to kociemba
            if len(cube_string) != 54:
                raise Exception(f"Invalid cube string length: {len(cube_string)}, expected 54")
            
            valid_chars = set('URFDLB')
            invalid_chars = set(cube_string) - valid_chars
            if invalid_chars:
                raise Exception(f"Invalid characters in cube string: {invalid_chars}")
            
            self.solution_moves = kociemba.solve(cube_string)
            return self.solution_moves
        except Exception as e:
            print(f"\nError from Kociemba solver: {e}")
            print("This usually means the cube configuration entered is not possible on a real cube.")
            return "Error: Invalid cube state"

    def _generate_kociemba_string(self):
        """
        Converts our cube's face dictionary into the 54-character string
        that the Kociemba library requires.
        
        The required order is U-R-F-D-L-B (Up, Right, Front, Down, Left, Back).
        """
        # Direct mapping of colors to Kociemba face names for a standard color scheme
        # W (White) -> U, Y (Yellow) -> D, O (Orange) -> L, R (Red) -> R, G (Green) -> F, B (Blue) -> B
        color_to_face_map = {
            WHITE: 'U',
            YELLOW: 'D',
            ORANGE: 'L',
            RED: 'R',
            GREEN: 'F',
            BLUE: 'B'
        }

        face_order = [UP, RIGHT, FRONT, DOWN, LEFT, BACK]
        
        cubestring = ""
        for face_name in face_order:
            for row in self.cube.faces[face_name]:
                for sticker_color in row:
                    cubestring += color_to_face_map[sticker_color]
        
        return cubestring
