import * as BABYLON from '@babylonjs/core';
import { Game } from "./Game";

window.BABYLON = BABYLON;
window.game = new Game({canvas: '#canvas' });

game.start().then(console.log);
