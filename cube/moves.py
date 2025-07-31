# cube/moves.py

from cube.cube_model import Cube
from utils.constants import *

def rotate_face_clockwise(cube: Cube, face_name: str):
    face = cube.faces[face_name]
    cube.faces[face_name] = [list(row) for row in zip(*face[::-1])]

def rotate_face_counter_clockwise(cube: Cube, face_name: str):
    face = cube.faces[face_name]
    cube.faces[face_name] = [list(row) for row in reversed(list(zip(*face)))]

def U(cube: Cube):
    rotate_face_clockwise(cube, UP)
    temp_row = cube.faces[FRONT][0]
    cube.faces[FRONT][0] = cube.faces[RIGHT][0]
    cube.faces[RIGHT][0] = cube.faces[BACK][0]
    cube.faces[BACK][0] = cube.faces[LEFT][0]
    cube.faces[LEFT][0] = temp_row

def U_prime(cube: Cube):
    for _ in range(3): U(cube)

def D(cube: Cube):
    rotate_face_clockwise(cube, DOWN)
    temp_row = cube.faces[FRONT][2]
    cube.faces[FRONT][2] = cube.faces[LEFT][2]
    cube.faces[LEFT][2] = cube.faces[BACK][2]
    cube.faces[BACK][2] = cube.faces[RIGHT][2]
    cube.faces[RIGHT][2] = temp_row

def D_prime(cube: Cube):
    for _ in range(3): D(cube)

def R(cube: Cube):
    rotate_face_clockwise(cube, RIGHT)
    temp_col = [cube.faces[UP][i][2] for i in range(3)]
    for i in range(3):
        cube.faces[UP][i][2] = cube.faces[FRONT][i][2]
        cube.faces[FRONT][i][2] = cube.faces[DOWN][i][2]
        cube.faces[DOWN][i][2] = cube.faces[BACK][2-i][0]
        cube.faces[BACK][2-i][0] = temp_col[i]

def R_prime(cube: Cube):
    for _ in range(3): R(cube)

def L(cube: Cube):
    rotate_face_clockwise(cube, LEFT)
    temp_col = [cube.faces[UP][i][0] for i in range(3)]
    for i in range(3):
        cube.faces[UP][i][0] = cube.faces[BACK][2-i][2]
        cube.faces[BACK][2-i][2] = cube.faces[DOWN][i][0]
        cube.faces[DOWN][i][0] = cube.faces[FRONT][i][0]
        cube.faces[FRONT][i][0] = temp_col[i]

def L_prime(cube: Cube):
    for _ in range(3): L(cube)

def F(cube: Cube):
    rotate_face_clockwise(cube, FRONT)
    temp_row = list(cube.faces[UP][2])
    for i in range(3): cube.faces[UP][2][i] = cube.faces[LEFT][2-i][2]
    for i in range(3): cube.faces[LEFT][i][2] = cube.faces[DOWN][0][i]
    for i in range(3): cube.faces[DOWN][0][i] = cube.faces[RIGHT][2-i][0]
    for i in range(3): cube.faces[RIGHT][i][0] = temp_row[i]

def F_prime(cube: Cube):
    for _ in range(3): F(cube)

def B(cube: Cube):
    rotate_face_clockwise(cube, BACK)
    temp_row = list(cube.faces[UP][0])
    for i in range(3): cube.faces[UP][0][i] = cube.faces[RIGHT][i][2]
    for i in range(3): cube.faces[RIGHT][i][2] = cube.faces[DOWN][2][2-i]
    for i in range(3): cube.faces[DOWN][2][i] = cube.faces[LEFT][2-i][0]
    for i in range(3): cube.faces[LEFT][i][0] = temp_row[i]

def B_prime(cube: Cube):
    for _ in range(3): B(cube)