import * as THREE from 'three';

export const ENTRANCE_POS = { x: 0, y: 0.5, z: 15 };
export const EXIT_POS = ENTRANCE_POS;
export const HOST_POS = { x: 0, y: 0.5, z: 12 };
export const KITCHEN_POS = { x: 10, y: 0.5, z: -12 };
export const RESTROOM_POS = { x: -10, y: 0.5, z: -12 };

// Table positions (4-tops and 2-tops)
export const TABLE_POSITIONS = [
  // 4-tops (center)
  { x: -6, y: 0.5, z: 4 },
  { x: 0, y: 0.5, z: 4 },
  { x: 6, y: 0.5, z: 4 },
  { x: -6, y: 0.5, z: -2 },
  { x: 0, y: 0.5, z: -2 },
  { x: 6, y: 0.5, z: -2 },
  // 2-tops (sides)
  { x: -12, y: 0.5, z: 6 },
  { x: 12, y: 0.5, z: 6 },
  { x: -12, y: 0.5, z: 0 },
  { x: 12, y: 0.5, z: 0 },
  { x: -12, y: 0.5, z: -6 },
  { x: 12, y: 0.5, z: -6 },
];

export let OBSTACLES = [];

export function createRestaurantMap(scene) {
  OBSTACLES = [];
  // Dimensions
  const width = 32;
  const depth = 32;
  const wallHeight = 4;
  const wallThickness = 0.3;

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshStandardMaterial({ color: 0xf5f5dc })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Perimeter walls
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  // Back wall
  addObstacle(createWall(width, wallHeight, wallThickness, 0, wallHeight/2, -depth/2 + wallThickness/2, wallMaterial), scene);
  // Front wall (split for entrance gap)
  const entranceGap = 4;
  addObstacle(createWall((width-entranceGap)/2, wallHeight, wallThickness, -((width-entranceGap)/4 + entranceGap/2), wallHeight/2, depth/2 - wallThickness/2, wallMaterial), scene);
  addObstacle(createWall((width-entranceGap)/2, wallHeight, wallThickness, ((width-entranceGap)/4 + entranceGap/2), wallHeight/2, depth/2 - wallThickness/2, wallMaterial), scene);
  // Left wall
  addObstacle(createWall(wallThickness, wallHeight, depth, -width/2 + wallThickness/2, wallHeight/2, 0, wallMaterial), scene);
  // Right wall
  addObstacle(createWall(wallThickness, wallHeight, depth, width/2 - wallThickness/2, wallHeight/2, 0, wallMaterial), scene);

  // Host/hostess stand
  const hostMat = new THREE.MeshStandardMaterial({ color: 0x795548 });
  const hostStand = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 1),
    hostMat
  );
  hostStand.position.set(HOST_POS.x, 0.5, HOST_POS.z);
  scene.add(hostStand);
  addObstacle(new THREE.Box3().setFromObject(hostStand), scene);

  // Tables and chairs
  const tableMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const chairMat = new THREE.MeshStandardMaterial({ color: 0x607d8b });
  for (const pos of TABLE_POSITIONS) {
    // Table
    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 0.2, 16),
      tableMat
    );
    table.position.set(pos.x, 0.6, pos.z);
    scene.add(table);
    addObstacle(new THREE.Box3().setFromObject(table), scene);
    // Chairs (4 per table, spaced around)
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI/2) * i;
      const cx = pos.x + Math.cos(angle) * 1.5;
      const cz = pos.z + Math.sin(angle) * 1.5;
      const chair = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.8, 0.4),
        chairMat
      );
      chair.position.set(cx, 0.4, cz);
      scene.add(chair);
      addObstacle(new THREE.Box3().setFromObject(chair), scene);
    }
  }

  // Kitchen area
  const kitchenMat = new THREE.MeshStandardMaterial({ color: 0xffe082 });
  const kitchen = new THREE.Mesh(
    new THREE.BoxGeometry(8, 2.5, 6),
    kitchenMat
  );
  kitchen.position.set(KITCHEN_POS.x, 1.25, KITCHEN_POS.z);
  scene.add(kitchen);
  addObstacle(new THREE.Box3().setFromObject(kitchen), scene);

  // Restrooms
  const restroomMat = new THREE.MeshStandardMaterial({ color: 0x90caf9 });
  const restroom = new THREE.Mesh(
    new THREE.BoxGeometry(6, 2.5, 4),
    restroomMat
  );
  restroom.position.set(RESTROOM_POS.x, 1.25, RESTROOM_POS.z);
  scene.add(restroom);
  addObstacle(new THREE.Box3().setFromObject(restroom), scene);

  // Waiting area (benches)
  const benchMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
  for (let i = -2; i <= 2; i += 2) {
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.4, 0.6),
      benchMat
    );
    bench.position.set(i * 2, 0.2, 10);
    scene.add(bench);
    addObstacle(new THREE.Box3().setFromObject(bench), scene);
  }
}

function addObstacle(meshOrBox, scene) {
  if (meshOrBox instanceof THREE.Box3) {
    OBSTACLES.push(meshOrBox);
  } else {
    scene.add(meshOrBox);
    meshOrBox.updateMatrixWorld();
    OBSTACLES.push(new THREE.Box3().setFromObject(meshOrBox));
  }
}

function createWall(width, height, depth, x, y, z, material) {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material
  );
  wall.position.set(x, y, z);
  wall.castShadow = true;
  wall.receiveShadow = true;
  return wall;
}
