import { WHITE, YELLOW, ORANGE, RED, GREEN, BLUE, UP, DOWN, FRONT, BACK, RIGHT, LEFT } from './constants';

export class Cube {
  constructor(state = null) {
    /**
     * Initializes the cube with WHITE on UP face (standard orientation).
     */
    if (state) {
      this.faces = state;
    } else {
      // Default SOLVED state with White on Top
      this.faces = {
        [UP]: [[WHITE, WHITE, WHITE], [WHITE, WHITE, WHITE], [WHITE, WHITE, WHITE]],
        [DOWN]: [[YELLOW, YELLOW, YELLOW], [YELLOW, YELLOW, YELLOW], [YELLOW, YELLOW, YELLOW]],
        [FRONT]: [[GREEN, GREEN, GREEN], [GREEN, GREEN, GREEN], [GREEN, GREEN, GREEN]],
        [BACK]: [[BLUE, BLUE, BLUE], [BLUE, BLUE, BLUE], [BLUE, BLUE, BLUE]],
        [RIGHT]: [[RED, RED, RED], [RED, RED, RED], [RED, RED, RED]],
        [LEFT]: [[ORANGE, ORANGE, ORANGE], [ORANGE, ORANGE, ORANGE], [ORANGE, ORANGE, ORANGE]]
      };
    }
  }

  validateState() {
    /**
     * Performs a basic validation of the cube state.
     * Checks if there are exactly 9 of each color.
     */
    const allStickers = [];
    for (const faceName in this.faces) {
      for (const row of this.faces[faceName]) {
        allStickers.push(...row);
      }
    }

    const counts = {};
    for (const sticker of allStickers) {
      counts[sticker] = (counts[sticker] || 0) + 1;
    }

    const countValues = Object.values(counts);
    if (Object.keys(counts).length !== 6 || countValues.some(c => c !== 9)) {
      console.error(`Error: Invalid sticker counts. Found: ${JSON.stringify(counts)}. Each color must have 9 stickers.`);
      return false;
    }

    console.log("Cube state has the correct number of stickers.");
    return true;
  }

  toString() {
    /**
     * Provides a string representation for printing the cube's state.
     */
    let representation = "";
    // Print Up face (White)
    for (const row of this.faces[UP]) {
      representation += `      ${row.join(' ')}\n`;
    }
    representation += "\n";
    // Print Left, Front, Right, Back faces side-by-side
    for (let i = 0; i < 3; i++) {
      const leftRow = this.faces[LEFT][i].join(' ');
      const frontRow = this.faces[FRONT][i].join(' ');
      const rightRow = this.faces[RIGHT][i].join(' ');
      const backRow = this.faces[BACK][i].join(' ');
      representation += `${leftRow}  ${frontRow}  ${rightRow}  ${backRow}\n`;
    }
    representation += "\n";
    // Print Down face (Yellow)
    for (const row of this.faces[DOWN]) {
      representation += `      ${row.join(' ')}\n`;
    }
    return representation;
  }

  isSolved() {
    /** Checks if the cube is in a solved state. */
    for (const faceName in this.faces) {
      const faceMatrix = this.faces[faceName];
      const centerColor = faceMatrix[1][1];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (faceMatrix[i][j] !== centerColor) {
            return false;
          }
        }
      }
    }
    return true;
  }

  deepcopy() {
    /** Creates a deep copy of the cube object. */
    return new Cube(JSON.parse(JSON.stringify(this.faces)));
  }
}
