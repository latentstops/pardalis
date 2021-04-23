import { Game } from './Game';

export class PardalisGame extends Game {
    constructor(...args) {
        super(...args);
        this.enablePhysics();
    }

    enablePhysics(){
        const scene = this.scene;
        scene.enablePhysics();
    }
    load(){
        return new Promise(res => setTimeout(res, 1000));
    }
}
