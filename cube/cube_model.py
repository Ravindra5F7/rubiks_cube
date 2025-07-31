# cube/cube_model.py

import copy
from utils.constants import *
from collections import Counter

class Cube:
    def __init__(self, state=None):
        """
        Initializes the cube with WHITE on UP face (standard orientation).
        """
        if state:
            self.faces = state
        else:
            # Default SOLVED state with White on Top
            self.faces = {
                UP: [[WHITE, WHITE, WHITE], [WHITE, WHITE, WHITE], [WHITE, WHITE, WHITE]],
                DOWN: [[YELLOW, YELLOW, YELLOW], [YELLOW, YELLOW, YELLOW], [YELLOW, YELLOW, YELLOW]],
                FRONT: [[GREEN, GREEN, GREEN], [GREEN, GREEN, GREEN], [GREEN, GREEN, GREEN]],
                BACK: [[BLUE, BLUE, BLUE], [BLUE, BLUE, BLUE], [BLUE, BLUE, BLUE]],
                RIGHT: [[RED, RED, RED], [RED, RED, RED], [RED, RED, RED]],
                LEFT: [[ORANGE, ORANGE, ORANGE], [ORANGE, ORANGE, ORANGE], [ORANGE, ORANGE, ORANGE]]
            }

    def validate_state(self):
        """
        Performs a basic validation of the cube state.
        Checks if there are exactly 9 of each color.
        """
        all_stickers = []
        for face_name in self.faces:
            for row in self.faces[face_name]:
                all_stickers.extend(row)
        
        counts = Counter(all_stickers)
        
        if len(counts) != 6 or any(c != 9 for c in counts.values()):
            print(f"Error: Invalid sticker counts. Found: {counts}. Each color must have 9 stickers.")
            return False

        print("Cube state has the correct number of stickers.")
        return True

    def __str__(self):
        """
        Provides a string representation for printing the cube's state.
        """
        representation = ""
        # Print Up face (White)
        for row in self.faces[UP]:
            representation += f"      {' '.join(row)}\n"
        representation += "\n"
        # Print Left, Front, Right, Back faces side-by-side
        for i in range(3):
            left_row = ' '.join(self.faces[LEFT][i])
            front_row = ' '.join(self.faces[FRONT][i])
            right_row = ' '.join(self.faces[RIGHT][i])
            back_row = ' '.join(self.faces[BACK][i])
            representation += f"{left_row}  {front_row}  {right_row}  {back_row}\n"
        representation += "\n"
        # Print Down face (Yellow)
        for row in self.faces[DOWN]:
            representation += f"      {' '.join(row)}\n"
        return representation

    def is_solved(self):
        """Checks if the cube is in a solved state."""
        for face_name, face_matrix in self.faces.items():
            center_color = face_matrix[1][1]
            for i in range(3):
                for j in range(3):
                    if face_matrix[i][j] != center_color:
                        return False
        return True

    def deepcopy(self):
        """Creates a deep copy of the cube object."""
        return copy.deepcopy(self)