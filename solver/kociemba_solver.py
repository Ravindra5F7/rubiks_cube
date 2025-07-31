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
        # Map our cube's center colors to the Kociemba library's face names (U, R, F, etc.)
        # This mapping is based on the center piece of each face in our solved state.
        kociemba_face_map = {
            self.cube.faces[UP][1][1]: 'U',
            self.cube.faces[RIGHT][1][1]: 'R',
            self.cube.faces[FRONT][1][1]: 'F',
            self.cube.faces[DOWN][1][1]: 'D',
            self.cube.faces[LEFT][1][1]: 'L',
            self.cube.faces[BACK][1][1]: 'B'
        }

        face_order = [UP, RIGHT, FRONT, DOWN, LEFT, BACK]
        
        cubestring = ""
        for face_name in face_order:
            for row in self.cube.faces[face_name]:
                for sticker_color in row:
                    cubestring += kociemba_face_map[sticker_color]
        
        return cubestring