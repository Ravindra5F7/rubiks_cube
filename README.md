**Rubik's Cube Solver**

````markdown
# 🧩 Rubik's Cube Solver

A fast and optimal command-line application to solve any valid scrambled 3x3x3 Rubik's Cube using the **Kociemba two-phase algorithm**. This project was developed as a submission for the **Aero Hack Challenge**.

---

## ✨ Features

- 🔄 **Efficient Solver**  
  Utilizes the **Kociemba two-phase algorithm**, capable of solving cubes in under 22 moves—usually within milliseconds.

- 💻 **User-Friendly Interface**  
  A clean and simple command-line interface guides the user through the solving process.

- 🧪 **Robust Validation**  
  Ensures user input represents a valid, solvable Rubik’s Cube.

- 🎲 **Scramble Generator**  
  A script (`generate_scramble.py`) uses the `pycuber` library to generate valid cube scrambles for testing.

- 🧱 **Modular Codebase**  
  Logically organized packages for cube modeling, solving logic, and utility functions. Easy to read and extend.

---

## 🧠 Algorithm Overview

The solver uses the **Kociemba Two-Phase Algorithm**:

1. **Phase 1** – Transforms the scrambled cube to a state within a restricted group.
2. **Phase 2** – Solves the cube from that subgroup state.

This drastically reduces the solution search space and provides near-optimal move sequences.

---

## 🚀 Getting Started

### ✅ Prerequisites

- Python 3.x

### 📦 Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/Ravindra5F7/rubiks_cube.git
    cd rubiks_cube
    ```

2. **Install dependencies**

    ```bash
    pip install -r requirements.txt
    ```

---

## 🔧 Usage

### 🔁 Generate a Scramble

To test the solver with a valid scramble:

```bash
python generate_scramble.py
````

### 🧮 Run the Solver

Run the main program and follow the prompts to enter your cube's state:

```bash
python main.py
```

The program will then display the steps required to solve the cube.

---

## 📂 Project Structure

```
rubiks_cube/
├── cube/               # Cube model and representation
├── solver/             # Kociemba algorithm implementation
├── utils/              # Helper functions and validation
├── generate_scramble.py
├── main.py
└── requirements.txt
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

* Kociemba's Two-Phase Algorithm
* `pycuber` library for cube generation and manipulation

```

Let me know if you want to include badges, screenshots, or a GIF demo of the solver in action.
```
