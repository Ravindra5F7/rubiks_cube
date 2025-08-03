import { Cube } from './cube_model';
import { UP, DOWN, FRONT, BACK, RIGHT, LEFT } from './constants';

export function rotateFaceClockwise(cube, faceName) {
  const face = cube.faces[faceName];
  // Transpose and reverse rows to rotate clockwise
  const newFace = face[0].map((_, i) => face.map(row => row[i]).reverse());
  cube.faces[faceName] = newFace;
}

export function rotateFaceCounterClockwise(cube, faceName) {
  const face = cube.faces[faceName];
  // Transpose and reverse columns to rotate counter-clockwise
  const newFace = face[0].map((_, i) => face.map(row => row[row.length - 1 - i]));
  cube.faces[faceName] = newFace;
}

export function U(cube) {
  rotateFaceClockwise(cube, UP);
  const tempRow = [...cube.faces[FRONT][0]];
  cube.faces[FRONT][0] = [...cube.faces[RIGHT][0]];
  cube.faces[RIGHT][0] = [...cube.faces[BACK][0]];
  cube.faces[BACK][0] = [...cube.faces[LEFT][0]];
  cube.faces[LEFT][0] = tempRow;
}

export function U_prime(cube) {
  for (let i = 0; i < 3; i++) U(cube);
}

export function D(cube) {
  rotateFaceClockwise(cube, DOWN);
  const tempRow = [...cube.faces[FRONT][2]];
  cube.faces[FRONT][2] = [...cube.faces[LEFT][2]];
  cube.faces[LEFT][2] = [...cube.faces[BACK][2]];
  cube.faces[BACK][2] = [...cube.faces[RIGHT][2]];
  cube.faces[RIGHT][2] = tempRow;
}

export function D_prime(cube) {
  for (let i = 0; i < 3; i++) D(cube);
}

export function R(cube) {
  rotateFaceClockwise(cube, RIGHT);
  const tempCol = [cube.faces[UP][0][2], cube.faces[UP][1][2], cube.faces[UP][2][2]];
  for (let i = 0; i < 3; i++) {
    cube.faces[UP][i][2] = cube.faces[FRONT][i][2];
    cube.faces[FRONT][i][2] = cube.faces[DOWN][i][2];
    cube.faces[DOWN][i][2] = cube.faces[BACK][2 - i][0];
    cube.faces[BACK][2 - i][0] = tempCol[i];
  }
}

export function R_prime(cube) {
  for (let i = 0; i < 3; i++) R(cube);
}

export function L(cube) {
  rotateFaceClockwise(cube, LEFT);
  const tempCol = [cube.faces[UP][0][0], cube.faces[UP][1][0], cube.faces[UP][2][0]];
  for (let i = 0; i < 3; i++) {
    cube.faces[UP][i][0] = cube.faces[BACK][2 - i][2];
    cube.faces[BACK][2 - i][2] = cube.faces[DOWN][i][0];
    cube.faces[DOWN][i][0] = cube.faces[FRONT][i][0];
    cube.faces[FRONT][i][0] = tempCol[i];
  }
}

export function L_prime(cube) {
  for (let i = 0; i < 3; i++) L(cube);
}

export function F(cube) {
  rotateFaceClockwise(cube, FRONT);
  const tempRow = [...cube.faces[UP][2]];
  for (let i = 0; i < 3; i++) cube.faces[UP][2][i] = cube.faces[LEFT][2 - i][2];
  for (let i = 0; i < 3; i++) cube.faces[LEFT][i][2] = cube.faces[DOWN][0][i];
  for (let i = 0; i < 3; i++) cube.faces[DOWN][0][i] = cube.faces[RIGHT][2 - i][0];
  for (let i = 0; i < 3; i++) cube.faces[RIGHT][i][0] = tempRow[i];
}

export function F_prime(cube) {
  for (let i = 0; i < 3; i++) F(cube);
}

export function B(cube) {
  rotateFaceClockwise(cube, BACK);
  const tempRow = [...cube.faces[UP][0]];
  for (let i = 0; i < 3; i++) cube.faces[UP][0][i] = cube.faces[RIGHT][i][2];
  for (let i = 0; i < 3; i++) cube.faces[RIGHT][i][2] = cube.faces[DOWN][2][2 - i];
  for (let i = 0; i < 3; i++) cube.faces[DOWN][2][i] = cube.faces[LEFT][2 - i][0];
  for (let i = 0; i < 3; i++) cube.faces[LEFT][i][0] = tempRow[i];
}

export function B_prime(cube) {
  for (let i = 0; i < 3; i++) B(cube);
}
