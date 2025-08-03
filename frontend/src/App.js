import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Cube } from './cube_model';
import * as Moves from './moves';

const MOVE_FUNCTIONS = {
  "U": "U",
  "U'": "U'",
  "U2": "U2",
  "D": "D",
  "D'": "D'",
  "D2": "D2",
  "R": "R",
  "R'": "R'",
  "R2": "R2",
  "L": "L",
  "L'": "L'",
  "L2": "L2",
  "F": "F",
  "F'": "F'",
  "F2": "F2",
  "B": "B",
  "B'": "B'",
  "B2": "B2",
};

function createCubeFaceMaterials() {
  const colors = {
    white: 0xffffff,
    yellow: 0xffff00,
    orange: 0xffa500,
    red: 0xff0000,
    green: 0x00ff00,
    blue: 0x0000ff,
    black: 0x000000,
  };

  return {
    U: new THREE.MeshBasicMaterial({ color: colors.white }),
    D: new THREE.MeshBasicMaterial({ color: colors.yellow }),
    L: new THREE.MeshBasicMaterial({ color: colors.orange }),
    R: new THREE.MeshBasicMaterial({ color: colors.red }),
    F: new THREE.MeshBasicMaterial({ color: colors.green }),
    B: new THREE.MeshBasicMaterial({ color: colors.blue }),
    black: new THREE.MeshBasicMaterial({ color: colors.black }),
  };
}

  const Cube3D = forwardRef((props, ref) => {
    const mountRef = useRef(null);
    const [scene, setScene] = useState(null);
    const [renderer, setRenderer] = useState(null);
    const [camera, setCamera] = useState(null);
    const [cubeGroup, setCubeGroup] = useState(null);
    const cubeletsRef = useRef([]);
    const controlsRef = useRef(null);
    const rotationEnabledRef = useRef(true); // New ref to toggle rotation

    // New: Cube state instance
    const cubeStateRef = useRef(new Cube());

    // New: Materials for colors
    const materialsRef = useRef(createCubeFaceMaterials());

    // Function to update cubelet materials/colors based on cube state
    const updateCubeColors = () => {
      if (!cubeStateRef.current || !cubeletsRef.current.length) return;

      // Map cubelet positions to cube state facelets
      // Each cubelet has 6 faces: right, left, top, bottom, front, back
      // We update the material color of each face based on cubeStateRef

      // Helper to get color from cube state for a given face and position
      const getColorForFacelet = (face, row, col) => {
        return cubeStateRef.current.faces[face][row][col];
      };

      // Map color letters to face materials keys
      const colorToFaceMaterialKey = {
        'W': 'U', // White -> Up face material
        'Y': 'D', // Yellow -> Down face material
        'O': 'L', // Orange -> Left face material
        'R': 'R', // Red -> Right face material
        'G': 'F', // Green -> Front face material
        'B': 'B', // Blue -> Back face material
      };

      // For each cubelet, update materials
      cubeletsRef.current.forEach(cubelet => {
        const pos = cubelet.position;
        const faceMaterials = [];

        // Right face (R)
        if (pos.x > 0.5) {
          // Map to cube state RIGHT face
          // Determine row and col based on y,z
          const row = 2 - Math.round(pos.y + 1);
          const col = Math.round(pos.z + 1);
          const color = getColorForFacelet('R', row, col);
          const materialKey = colorToFaceMaterialKey[color] || 'black';
          faceMaterials[0] = materialsRef.current[materialKey];
        } else {
          faceMaterials[0] = materialsRef.current.black;
        }

        // Left face (L)
        if (pos.x < -0.5) {
          const row = 2 - Math.round(pos.y + 1);
          const col = 2 - Math.round(pos.z + 1);
          const color = getColorForFacelet('L', row, col);
          const materialKey = colorToFaceMaterialKey[color] || 'black';
          faceMaterials[1] = materialsRef.current[materialKey];
        } else {
          faceMaterials[1] = materialsRef.current.black;
        }

        // Top face (U)
        if (pos.y > 0.5) {
          const row = 2 - Math.round(pos.z + 1);
          const col = Math.round(pos.x + 1);
          const color = getColorForFacelet('U', row, col);
          const materialKey = colorToFaceMaterialKey[color] || 'black';
          faceMaterials[2] = materialsRef.current[materialKey];
        } else {
          faceMaterials[2] = materialsRef.current.black;
        }

        // Bottom face (D)
        if (pos.y < -0.5) {
          const row = Math.round(pos.z + 1);
          const col = Math.round(pos.x + 1);
          const color = getColorForFacelet('D', row, col);
          const materialKey = colorToFaceMaterialKey[color] || 'black';
          faceMaterials[3] = materialsRef.current[materialKey];
        } else {
          faceMaterials[3] = materialsRef.current.black;
        }

        // Front face (F)
        if (pos.z > 0.5) {
          const row = 2 - Math.round(pos.y + 1);
          const col = Math.round(pos.x + 1);
          const color = getColorForFacelet('F', row, col);
          const materialKey = colorToFaceMaterialKey[color] || 'black';
          faceMaterials[4] = materialsRef.current[materialKey];
        } else {
          faceMaterials[4] = materialsRef.current.black;
        }

        // Back face (B)
        if (pos.z < -0.5) {
          const row = 2 - Math.round(pos.y + 1);
          const col = 2 - Math.round(pos.x + 1);
          const color = getColorForFacelet('B', row, col);
          const materialKey = colorToFaceMaterialKey[color] || 'black';
          faceMaterials[5] = materialsRef.current[materialKey];
        } else {
          faceMaterials[5] = materialsRef.current.black;
        }

        // Ensure faceMaterials has 6 materials
        for (let i = 0; i < 6; i++) {
          if (!faceMaterials[i]) {
            faceMaterials[i] = materialsRef.current.black;
          }
        }

        // Update cubelet material
        cubelet.material = faceMaterials;
      });
    };

    useEffect(() => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      // Scene
      const scene = new THREE.Scene();
      setScene(scene);

      // Camera
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(5, 5, 5);
      camera.lookAt(0, 0, 0);
      setCamera(camera);

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      mountRef.current.appendChild(renderer.domElement);
      setRenderer(renderer);

      // Controls for 360 degree rotation
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controlsRef.current = controls;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(0, 5, 5);
      scene.add(directionalLight);

      // Cube group
      const cubeGroup = new THREE.Group();
      scene.add(cubeGroup);
      setCubeGroup(cubeGroup);

      // Create cubelets
      const materials = createCubeFaceMaterials();
      const cubelets = [];

      const cubeletSize = 0.95;
      const gap = 0.05;

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const geometry = new THREE.BoxGeometry(cubeletSize, cubeletSize, cubeletSize);

            // Assign materials to each face of the cubelet
            const faceMaterials = [];

            // Order of faces: right, left, top, bottom, front, back
            // Map to Rubik's cube faces: R, L, U, D, F, B
            faceMaterials.push(x === 1 ? materials.R : materials.black); // right
            faceMaterials.push(x === -1 ? materials.L : materials.black); // left
            faceMaterials.push(y === 1 ? materials.U : materials.black); // top
            faceMaterials.push(y === -1 ? materials.D : materials.black); // bottom
            faceMaterials.push(z === 1 ? materials.F : materials.black); // front
            faceMaterials.push(z === -1 ? materials.B : materials.black); // back

            const cubelet = new THREE.Mesh(geometry, faceMaterials);
            cubelet.position.set(x * (cubeletSize + gap), y * (cubeletSize + gap), z * (cubeletSize + gap));
            cubeGroup.add(cubelet);
            cubelets.push(cubelet);
          }
        }
      }

      cubeletsRef.current = cubelets;

      // Initial update of cube colors
      updateCubeColors();

      // Animation loop with continuous rotation
      const animate = () => {
        requestAnimationFrame(animate);
        if (rotationEnabledRef.current && cubeGroup) {
          cubeGroup.rotation.y += 0.01; // Continuous 360 rotation on Y axis
        }
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Cleanup on unmount
      return () => {
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        controls.dispose();
      };
    }, []);

  // Function to apply a move to the cube (to be implemented)
  const applyMove = (move) => {
    return new Promise((resolve) => {
      if (!cubeGroup) {
        resolve();
        return;
      }

      // Disable continuous rotation during move animation
      rotationEnabledRef.current = false;

      const angle = Math.PI / 2; // 90 degrees
      let axis = null;
      let layer = null;

      // Determine axis and layer based on move notation
      switch (move[0]) {
        case 'U':
          axis = new THREE.Vector3(0, 1, 0);
          layer = (cubelet) => cubelet.position.y > 0.5;
          break;
        case 'D':
          axis = new THREE.Vector3(0, -1, 0);
          layer = (cubelet) => cubelet.position.y < -0.5;
          break;
        case 'L':
          axis = new THREE.Vector3(-1, 0, 0);
          layer = (cubelet) => cubelet.position.x < -0.5;
          break;
        case 'R':
          axis = new THREE.Vector3(1, 0, 0);
          layer = (cubelet) => cubelet.position.x > 0.5;
          break;
        case 'F':
          axis = new THREE.Vector3(0, 0, 1);
          layer = (cubelet) => cubelet.position.z > 0.5;
          break;
        case 'B':
          axis = new THREE.Vector3(0, 0, -1);
          layer = (cubelet) => cubelet.position.z < -0.5;
          break;
        default:
          resolve();
          return;
      }

      let rotationAngle = angle;
      if (move.length > 1) {
        if (move[1] === "'") {
          rotationAngle = -angle;
        } else if (move[1] === '2') {
          rotationAngle = angle * 2;
        }
      }

      // Select cubelets in the layer
      const selectedCubelets = cubeletsRef.current.filter(layer);

      // Create a temporary group for rotation
      const rotationGroup = new THREE.Group();
      cubeGroup.add(rotationGroup);

      // Move selected cubelets to rotation group
      selectedCubelets.forEach(cubelet => {
        // Manually detach cubelet from cubeGroup and add to rotationGroup
        cubeGroup.remove(cubelet);
        scene.attach(cubelet);
        rotationGroup.add(cubelet);
      });

      // Animate rotation of the group
      let rotated = 0;
      const step = rotationAngle / 15;
      const animateRotation = () => {
        if (Math.abs(rotated) < Math.abs(rotationAngle)) {
          rotationGroup.rotateOnWorldAxis(axis, step);
          rotated += step;
          requestAnimationFrame(animateRotation);
        } else {
          // Reattach cubelets back to cubeGroup
          selectedCubelets.forEach(cubelet => {
            // Manually detach cubelet from rotationGroup and add back to cubeGroup
            rotationGroup.remove(cubelet);
            scene.attach(cubelet);
            cubeGroup.add(cubelet);
          });
          cubeGroup.remove(rotationGroup);

          // Re-enable continuous rotation after animation
          rotationEnabledRef.current = true;
          resolve();
        }
      };
      animateRotation();
    });
  };

  // Expose applyMove method and cubeGroup to parent via ref
  useImperativeHandle(ref, () => ({
    applyMove,
    cubeGroup,
    cubeStateRef,
    updateCubeColors,
  }));

  return <div ref={mountRef} style={{ width: '400px', height: '400px', margin: 'auto' }} />;
});

function App() {
  const cubeRef = useRef(null);

  // State for solution steps and current step index
  const [solutionSteps, setSolutionSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // State for scramble and solution display
  const [scrambleText, setScrambleText] = useState('');
  const [solutionText, setSolutionText] = useState('');

  // Reset cube to solved state by resetting cubeGroup rotation
  const resetCube = () => {
    if (cubeRef.current) {
      // For simplicity, reset the entire cubeGroup rotation to identity
      const cubeGroup = cubeRef.current.cubeGroup;
      if (cubeGroup) {
        cubeGroup.rotation.set(0, 0, 0);
      }
      // Reset cube state as well
      if (cubeRef.current.cubeStateRef) {
        cubeRef.current.cubeStateRef.current = new Cube();
        cubeRef.current.updateCubeColors();
      }
    }
    setScrambleText('');
    setSolutionText('');
  };

  // Keyboard event handler for manual moves
  const handleKeyDown = async (event) => {
    const keyToMoveMap = {
      'u': "U",
      'd': "D",
      'l': "L",
      'r': "R",
      'f': "F",
      'b': "B",
      'U': "U'",
      'D': "D'",
      'L': "L'",
      'R': "R'",
      'F': "F'",
      'B': "B'",
      // Add more mappings if needed
    };

    const move = keyToMoveMap[event.key];
    if (move && cubeRef.current) {
      await cubeRef.current.applyMove(move);
      const moveFunc = Moves[move.replace("'", "_prime").replace("2", "")];
      if (moveFunc) {
        moveFunc(cubeRef.current.cubeStateRef.current);
      }
      cubeRef.current.updateCubeColors();

      // Check if cube is solved after move
      if (cubeRef.current.cubeStateRef.current.is_solved()) {
        alert("Cube is solved!");
      }
    }
  };

  // Add keyboard event listener on mount and cleanup on unmount
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Updated scramble function to call backend API and animate moves
  const scramble = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/scramble');
      const data = await response.json();
      if (data.scramble) {
        setSolutionText(''); // Clear previous solution

        // Extract scramble moves from the scramble string
        // Assuming scramble moves are in the line starting with "Scramble sequence used:"
        const scrambleLine = data.scramble.split('\n').find(line => line.startsWith('Scramble sequence used:'));
        if (scrambleLine) {
          const movesStr = scrambleLine.replace('Scramble sequence used:', '').trim();
          setScrambleText(movesStr); // Display scramble moves string
          const moves = movesStr.split(' ').filter(m => m.length > 0);

          // Reset cube state before scrambling
          if (cubeRef && cubeRef.current) {
            cubeRef.current.cubeGroup.rotation.set(0, 0, 0);
            cubeRef.current.cubeStateRef.current = new Cube();
            cubeRef.current.updateCubeColors();
          }

          // Animate moves sequentially and update cube state
          for (const move of moves) {
            if (cubeRef && cubeRef.current) {
              await cubeRef.current.applyMove(move);
              // Update cube state after move
              const moveFunc = Moves[move.replace("'", "_prime").replace("2", "")];
              if (moveFunc) {
                moveFunc(cubeRef.current.cubeStateRef.current);
              }
              cubeRef.current.updateCubeColors();
            }
          }
        }
      } else {
        alert('Failed to get scramble');
      }
    } catch (error) {
      alert('Error fetching scramble: ' + error.message);
    }
  };

  // Updated solve function to call backend API and animate solution moves
  const solve = async () => {
    // Send a known valid cube state for testing
    const validCubeState = {
      U: [['W','W','W'],['W','W','W'],['W','W','W']],
      L: [['O','O','O'],['O','O','O'],['O','O','O']],
      F: [['G','G','G'],['G','G','G'],['G','G','G']],
      R: [['R','R','R'],['R','R','R'],['R','R','R']],
      B: [['B','B','B'],['B','B','B'],['B','B','B']],
      D: [['Y','Y','Y'],['Y','Y','Y'],['Y','Y','Y']],
    };

    try {
      const response = await fetch('http://localhost:5000/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cube_state: validCubeState }),
      });
      const data = await response.json();
      if (data.solution) {
        setSolutionText(data.solution); // Display solution text

        // Do NOT apply moves automatically; user will apply manually via keys
      } else if (data.error) {
        alert('Error solving cube: ' + data.error);
      } else {
        alert('Failed to get solution');
      }
    } catch (error) {
      alert('Error fetching solution: ' + error.message);
    }
  };

  // Manual move buttons
  const manualMoves = [
    "U", "U'", "U2",
    "D", "D'", "D2",
    "R", "R'", "R2",
    "L", "L'", "L2",
    "F", "F'", "F2",
    "B", "B'", "B2"
  ];

  // Handler for manual move button click
  const handleManualMove = async (move) => {
    if (cubeRef && cubeRef.current) {
      cubeRef.current.applyMove(move);
    }
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', backgroundColor: '#6a6fc9', minHeight: '100vh', paddingTop: '20px', color: 'white' }}>
      <h1>Rubik's Cube Solver</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <Cube3D ref={cubeRef} />
          <div style={{ marginTop: '20px' }}>
            <button onClick={resetCube} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', marginRight: '10px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
              🎯 RESET SOLVED
            </button>
            <button onClick={scramble} style={{ backgroundColor: '#f39c12', color: 'white', padding: '10px 20px', marginRight: '10px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
              🔀 SCRAMBLE
            </button>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button onClick={solve} style={{ backgroundColor: '#3498db', color: 'white', padding: '10px 40px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
              🧠 SOLVE
            </button>
          </div>
          <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', backgroundColor: 'rgba(255,255,255,0.15)', display: 'inline-block', padding: '15px', borderRadius: '10px', maxWidth: '600px', margin: '20px auto', textAlign: 'left' }}>
            <h3>Scramble Output:</h3>
            <div>{scrambleText}</div>
          </div>
          <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', backgroundColor: 'rgba(255,255,255,0.15)', display: 'inline-block', padding: '15px', borderRadius: '10px', maxWidth: '600px', margin: '20px auto', textAlign: 'left' }}>
            <h3>Solution Output:</h3>
            <div>{solutionText}</div>
          </div>
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', display: 'inline-block', padding: '15px', borderRadius: '10px', alignSelf: 'flex-start', marginTop: '50px' }}>
          <h3>Manual Moves</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 50px)', gap: '10px', justifyContent: 'center' }}>
            {manualMoves.map(move => (
              <button key={move} onClick={() => handleManualMove(move)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid white', backgroundColor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 'bold' }}>
                {move}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
