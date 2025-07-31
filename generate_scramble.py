# generate_scramble.py

try:
    import pycuber as pc
except ImportError:
    print("\nError: The 'pycuber' library is not installed.")
    print("Please run 'pip install pycuber' or 'python -m pip install pycuber' in your terminal and try again.\n")
    exit()

from utils.constants import *

def generate_valid_scramble():
    """
    Uses the pycuber library to generate a guaranteed-valid scrambled cube state.
    """
    # Create a solved Cube object from the pycuber library
    my_cube = pc.Cube()

    # Create a random scramble formula
    scramble_formula = pc.Formula().random()

    # Apply the scramble to the pycuber object
    my_cube(scramble_formula)

    # Map pycuber's lowercase color strings to our uppercase color constants
    color_map = {
        "white": WHITE,
        "green": GREEN,
        "red": RED,
        "blue": BLUE,
        "orange": ORANGE,
        "yellow": YELLOW,
    }
    
    output_string = ""
    output_string += "--- Use this Guaranteed Valid Input for main.py ---\n"
    output_string += f"\nScramble sequence used: {str(scramble_formula)}\n\n"

    # Define the order and prompts for our main program
    face_order_prompts = {
        UP: "Up (White Center)",
        LEFT: "Left (Orange Center)",
        FRONT: "Front (Green Center)",
        RIGHT: "Right (Red Center)",
        BACK: "Back (Blue Center)",
        DOWN: "Down (Yellow Center)"
    }
    
    pycuber_face_order = ['U', 'L', 'F', 'R', 'B', 'D']
    our_face_order = [UP, LEFT, FRONT, RIGHT, BACK, DOWN]

    for i in range(len(pycuber_face_order)):
        pycuber_face_char = pycuber_face_order[i]
        our_face_constant = our_face_order[i]

        output_string += f"# For the {face_order_prompts[our_face_constant]} face:\n"
        
        face_string = ""
        face = my_cube.get_face(pycuber_face_char)
        for row in face:
            for cubie in row:
                # Correctly access the color string (e.g., "white") via cubie.colour
                face_string += color_map[cubie.colour]
        output_string += f"{face_string}\n\n"
        
    print(output_string)

if __name__ == "__main__":
    generate_valid_scramble()