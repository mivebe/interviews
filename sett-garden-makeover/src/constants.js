// Spot configuration data
export const SPOT_CONFIGS = [
  {
    id: 'animalPen',
    position: [10, 0, -3],
    labelOffset: [0, 4, 4],
    baseModel: 'AnimalPen',
    baseScale: 1.1,
    baseRotY: Math.PI + Math.PI / 2,
    baseOffset: [-1, -4, 10],
    items: [
      { name: 'cow', icon: 'cow.png', sound: 'cow' },
      { name: 'sheep', icon: 'sheep.png', sound: 'sheep' },
      { name: 'chicken', icon: 'chicken.png', sound: 'chicken' },
    ],
  },
  {
    id: 'furniture',
    position: [-9, -4.2, -10.5],
    labelOffset: [0, 5, 0],
    baseModel: null,
    items: [
      { name: 'table', icon: 'table.png', sound: 'hammering' },
      { name: 'cart', icon: 'cart.png', sound: 'hammering' },
      { name: 'swing', icon: 'swing.png', sound: 'hammering' },
    ],
  },
  {
    id: 'plants',
    position: [-8, -3.2, 0],
    labelOffset: [0, 4, 0.5],
    baseModel: 'SeedBed',
    baseScale: 1.4,
    items: [
      { name: 'tomato', icon: 'tomato.png', sound: 'shovel' },
      { name: 'strawberry', icon: 'strawberry.png', sound: 'shovel' },
      { name: 'grape', icon: 'grapes.png', sound: 'shovel' },
      { name: 'corn', icon: 'corn.png', sound: 'shovel' },
    ],
  },
];

// Animal item configurations
export const ANIMAL_CONFIGS = {
  cow: {
    asset: 'cow_asset',
    scale: 1.0,
    bodyName: 'cowBody',
    idleAnim: 'idle_cow',
    mixerSpeed: 1 / 40,
    positions: [
      [-3.5, -4, 9],
      [-0.5, -4, 12],
      [2.5, -4, 10],
    ],
    rotations: [-Math.PI / 8, Math.PI / 4, -Math.PI / 3],
  },
  sheep: {
    asset: 'sheep_asset',
    scale: 1.2,
    bodyName: 'sheepBody',
    idleAnim: 'idle_sheep',
    mixerSpeed: 1 / 30,
    positions: [
      [-0.5, -3.2, -2],
      [3, -3.2, -1],
    ],
    rotations: [Math.PI / 4, -Math.PI / 4],
  },
  chicken: {
    asset: 'chicken_asset',
    scale: 1.2,
    bodyName: 'chickenBody',
    idleAnim: 'idle_chicken',
    mixerSpeed: 1 / 30,
    positions: [
      [-0.5, -4, -1],
      [1.5, -4, 0.5],
      [3, -4, -1.5],
    ],
    rotations: [Math.PI / 6, -Math.PI / 3, Math.PI / 2],
  },
};

// Furniture item configurations
export const FURNITURE_CONFIGS = {
  table: { objName: 'Table', scale: 1.3, rotY: Math.PI / 4, posY: 0 },
  cart: { objName: 'Cart', scale: 1.5, rotY: Math.PI / 4, posY: 0 },
  swing: { objName: 'Swing', scale: 2.0, rotY: -Math.PI / 4, posY: 1.3 },
};

// Plant item configurations
export const PLANT_CONFIGS = {
  strawberry: {
    asset: 'strawberry',
    scale: 1.3,
    rotY: Math.PI / 4,
    positions: [
      [-2.5, 0.5, -4.0],
      [2.2, 0.5, -4.0],
      [-2.2, 0.5, 0.8],
      [2.2, 0.5, 0.8],
      [-2.5, 0.5, 5],
      [2.2, 0.5, 5],
    ],
  },
  grape: {
    asset: 'grape',
    scale: 1.5,
    rotY: Math.PI / 4,
    positions: [
      [-2.5, -0.2, -4.0],
      [2.2, -0.2, -4.0],
      [-2.2, -0.2, 0.8],
      [2.2, -0.2, 0.8],
      [-2.5, -0.2, 5],
      [2.2, -0.2, 5],
    ],
  },
  tomato: {
    asset: 'tomato',
    scale: 1.2,
    rotY: 0,
    positions: [
      [-2.5, -0.2, -4.0],
      [2.2, -0.2, -4.0],
      [-2.2, -0.2, 0.8],
      [2.2, -0.2, 0.8],
      [-2.5, -0.2, 5],
      [2.2, -0.2, 5],
    ],
  },
  corn: {
    asset: 'corn',
    scale: 1.3,
    rotY: 0,
    positions: [
      [-2.5, -0.2, -4.0],
      [2.2, -0.2, -4.0],
      [-2.2, -0.2, 0.8],
      [2.2, -0.2, 0.8],
      [-2.5, -0.2, 5],
      [2.2, -0.2, 5],
    ],
  },
};
