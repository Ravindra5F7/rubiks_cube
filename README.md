# Rubik's Cube Solver

## Overview

This project is a command-line application that can find a fast, optimal solution for any valid scrambled 3x3x3 Rubik's Cube. It was developed as a submission for the **Aero Hack Challenge**.

The program accepts a user-defined cube state and leverages the highly efficient **Kociemba two-phase algorithm** to calculate a short solution almost instantaneously. To ensure robust testing, the project also includes a scramble generator that uses the **`pycuber` library** to produce guaranteed valid, physically possible cube states.

## Features

-   **Fast & Optimal Solutions:** Utilizes the Kociemba algorithm to find solutions in under 22 moves, typically in milliseconds.
-   **User-Friendly Input:** A guided command-line interface prompts the user to enter the colors for each face of the cube.
-   **Robust Validation:** The program validates the user's input to ensure it corresponds to a real, solvable cube, checking both sticker counts and the mathematical possibility of the configuration via the Kociemba library.
-   **Guaranteed Valid Scramble Generator:** Includes a separate script (`generate_scramble.py`) that uses the `pycuber` library to create random, physically possible scrambles for easy and reliable testing.
-   **Modular Codebase:** The project is structured into logical packages for the cube model, solver logic, and utilities, making it clean and easy to understand.

## Project Structure

rubiks-cube-solver/
│
├── cube/
│ ├── init.py
│ ├── cube_model.py
│ └── moves.py
│
├── solver/
│ ├── init.py
│ └── kociemba_solver.py
│
├── utils/
│ ├── init.py
│ └── constants.py
│
├── generate_scramble.py
├── main.py
└── README.md

Setup and Installation
Prerequisites
Python 3 (should be added to your system's PATH)
1. Clone or Download the Code
First, get the project code onto your local machine.
2. Install Required Libraries
This project depends on two external Python libraries: kociemba for solving and pycuber for generating valid scrambles.
Open your terminal or command prompt and run the following command to install both libraries:

python -m pip install kociemba pycuber


If you encounter any issues, you can also try pip install kociemba pycuber.
How to Use
The project has a simple two-step workflow: first, generate a valid scramble, then run the solver with that scramble data.
Step 1: Generate a Valid Scramble
To get a guaranteed valid and physically possible scrambled cube state for testing, run the generate_scramble.py script:

python generate_scramble.py

This will print a random scramble sequence and the corresponding 6 faces of the cube.
Example Output from Generator:

PS C:\Users\ravin\Desktop\rubiks-cube-solver> python generate_scramble.py
--- Use this Guaranteed Valid Input for main.py ---

Scramble sequence used: R' F2 L U B2 L' U' F2 D' R2 U' B2 D' F L2 B R' D B R' D F' R' U' B'

# For the Up (White Center) face:
RGGRYYWGB

# For the Left (Orange Center) face:
WBBYRROOR

# For the Front (Green Center) face:
OOYGGWGYR

# For the Right (Red Center) face:
ORWBORBBG

# For the Back (Blue Center) face:
OWBWBGRYY

# For the Down (Yellow Center) face:
WOYWWOGBY


Step 2: Run the Solver
Now, run the main solver program:

python main.py


The program will prompt you to enter the 9 colors for each of the 6 faces. Copy and paste the 9-character strings that were generated in Step 1.
After you enter all 54 colors, the solver will instantly calculate and display the optimal solution.


PS C:\Users\ravin\Desktop\rubiks-cube-solver> python main.py
--- Rubik's Cube Solver ---
Please enter the colors for each face, with WHITE on top and GREEN at the front.
Use the following color codes: W, Y, O, R, G, B
Enter the 9 colors for a face as a single string (e.g., 'GGGGGGGGG').

Enter the 9 colors for the Up (White Center) face: RGGRYYWGB
Enter the 9 colors for the Left (Orange Center) face: WBBYRROOR
Enter the 9 colors for the Front (Green Center) face: OOYGGWGYR
Enter the 9 colors for the Right (Red Center) face: ORWBORBBG
Enter the 9 colors for the Back (Blue Center) face: OWBWBGRYY
Enter the 9 colors for the Down (Yellow Center) face: WOYWWOGBY

--- You entered the following cube state: ---
      R G G
      R Y Y
      W G B

W B B  O O Y  O R W  O W B
Y R R  G G W  B O R  W B G
O O R  G Y R  B B G  R Y Y

      W O Y
      W W O
      G B Y

Cube state has the correct number of stickers.

--- Using Kociemba's Two-Phase Algorithm for a Fast Solution ---
Generated Kociemba String: LFFLUUDFBRLDBRLBBFRRUFFDFULDRUDDRFBUDBBULLRRLRDBDBFLUU

-----------------------------------
           SOLUTION FOUND
-----------------------------------

A fast, optimal solution is:

U R U2 B' D' F D L2 U2 D2 B' L' U' R2 U' D2 L2 D' F2 D' B2 U'
