import { PardalisGame } from "./PardalisGame";

window.CANNON = CANNON;
window.BABYLON = BABYLON;
window.game = new PardalisGame({canvas: '#canvas' });

game.start().then(console.log);

// import * as BABYLON from '@babylonjs/core';
// import * as CANNON from 'cannon';
// window.BABYLON = BABYLON;
// window.CANNON = CANNON;