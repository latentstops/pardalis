import io from 'socket.io-client';
import { deepAssign } from "./utils/utils";

export class Game {

    constructor(config){
        this.config = config;
        this.setup();
    }


    async start(){
        await this.callChildLoadMethod();
        this.beforeRender();
        this.render();
        this.animateFromSocket();

        // this.applyMotionBlurEffect();
        // this.showDebugLayerIfExists();
    }

    animateFromSocket(){
        const debugObject = this.debugObject;
        const socket = io( 'http://192.168.2.17:3003', { transports: [ 'websocket' ] } );
        // const debugElement = document.querySelector('#debug');
        socket.on( 'deviceMotion', data => {
            const rotation = data.rotation;

            // debugElement.innerHTML = JSON.stringify( data, null, 2 );
            // debugObject.rotation.set( rotation.alpha, rotation.beta, rotation.gamma );
            // debugObject.rotation.set( rotation.alpha, rotation.gamma, rotation.beta );
            // debugObject.rotation.set( rotation.gamma, rotation.beta, rotation.alpha );
            // debugObject.rotation.set( rotation.gamma, rotation.alpha, rotation.beta );
            // debugObject.rotation.set( rotation.beta, rotation.gamma, rotation.alpha );
            debugObject.rotation.set( rotation.beta, rotation.alpha, rotation.gamma ); //!
        } );

        socket.on( 'gyroscope', data => {
            const { x, y, z } = data;
            const { x: positionX, y: positionY, z: positionZ } = debugObject.position;

            debugObject.position.set( x + positionX, y + positionY, z + positionZ );
        } );
        socket.on( 'accelerometer', data => {
            const { x, y, z } = data;
            const { x: positionX, y: positionY, z: positionZ } = debugObject.position;

            // debugObject.position.set( x - positionX, y - positionY, z + positionZ );
        } );
    }

    async callChildLoadMethod(){
        const engine = this.engine;

        engine.displayLoadingUI();

        this.callChildMethod('beforeLoad');
        await this.callChildMethodAsync('load');
        this.callChildMethod('afterLoad');

        engine.hideLoadingUI();
    }

    async callChildMethodAsync( method, args ){
        await this.callChildMethod( method, args );
    }


    callChildMethod( method, args ){
        const func = this[method];

        if( typeof func !== "function") return;

        return func.apply( this, args );
    }

    render(){
        const engine = this.engine;
        const scene = this.scene;
        engine.runRenderLoop( () => {
            scene.render();
        } );
    }

    beforeRender(){
        const scene = this.scene;
        const camera = this.camera;
        const defaultLight = scene.getLightByID( "default light" );
        if(!defaultLight) return;
        scene.registerBeforeRender( function(){
            // defaultLight.position = camera.position;
        } );
    }

    setup(){
        this.setupCanvas();
        this.setupEngine();
        this.setupScene();
        // this.setupCamera();
        this.setupGlassMaterial();
        this.setupDebugObject();
    }

    setupDebugObject(){
        const scene = this.scene;
        const debugObject = BABYLON.Mesh.CreateBox('debugObject', 4, scene);
        const pbr = this.pbr;

        debugObject.material = pbr;
        debugObject.material.bumpTexture = new BABYLON.Texture( require('./assets/normal_map.jpg').default, scene );
        // debugObject.material.wireframe = true;
        this.debugObject = debugObject;
    }

    applyMotionBlurEffect(){
        const scene = this.scene;
        const camera = this.camera;
        const motionblur = new BABYLON.MotionBlurPostProcess( "mb", scene, 1.0, camera );

        deepAssign( motionblur, {
            motionStrength: 8,
            motionBlurSamples: 12,
        } );

        this.motionblur = motionblur;
    }

    showDebugLayerIfExists(){
        const scene = this.scene;

        if ( !scene.debugLayer ) return;

        scene.debugLayer.show();
    }

    resizeEngineOnWindowResize(){
        const engine = this.engine;

        window.addEventListener( 'resize', () => {
            engine.resize();
        } );
    }

    setupCamera(){
        const cameraType = this.config.cameraType || 'uni';
        const cameraMap = {
            arc: () => this.setupArcRotateCamera(),
            uni: () => this.setupUniversalCamera()
        };

        const setupCameraMethod = cameraMap[ cameraType ];
        setupCameraMethod();

        this.activateCameraControls();
        // this.deActivateCameraControls();
    }

    setupUniversalCamera(){
        const canvas = this.canvas;
        const scene = this.scene;
        const camera = new BABYLON.FreeCamera( 'camera', new BABYLON.Vector3( 0, 0, -200 ), scene );

        camera.setTarget( BABYLON.Vector3.Zero() );

        camera.attachControl( canvas, false );

        this.camera = camera;
    }

    setupArcRotateCamera(){
        const scene = this.scene;

        const camera = scene.activeCamera;

        deepAssign( camera, {
            radius: 600,
            lowerRadiusLimit: 0.000001,
            upperRadiusLimit: Infinity,
            wheelDeltaPercentage: 0.01,
            autoRotation: false,
            beta: Math.PI / 4,
            alpha: Math.PI / 2,
            minZ: 1,
            useAutoRotationBehavior: false
        } );

        this.camera = camera;
    }

    activateCameraControls(){
        const { camera, canvas } = this;

        camera.attachControl( canvas, true );
    }

    deActivateCameraControls(){
        const { camera, canvas } = this;

        camera.detachControl( canvas );
    }

    setupScene(){
        const engine = this.engine;
        const scene = new BABYLON.Scene( engine );

        scene.clearColor = BABYLON.Color3.Black();

        const url = require( "./assets/environment.dds" ).default;
        scene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(url, scene);


        // var sphere = BABYLON.Mesh.CreateSphere("sphere", 128, 2, scene);
        // sphere.material = pbr;

        /*scene.beforeRender = (() => {
            let a = 0;
            return () => {
                a += 0.01;
                pbr.subSurface.tintColor.r = /!*Math.cos(a) * 0.5 +*!/ 0.5;
                pbr.subSurface.tintColor.g = /!*Math.cos(a) * 0.5 +*!/ 0.5;
                pbr.subSurface.tintColor.b = /!*pbr.subSurface.tintColor.g*!/ 0.5;
            };
        })();*/

        // scene.createDefaultCamera(true, true, true);

        scene.createDefaultCameraOrLight( true, true, true );

        scene.createDefaultSkybox(scene.environmentTexture);

        this.scene = scene;
    }

    setupGlassMaterial(){
        const scene = this.scene;

        const pbr = new BABYLON.PBRMaterial( "pbr", scene );

        pbr.metallic = 0.0;
        pbr.roughness = 0;

        pbr.subSurface.isRefractionEnabled = true;
        pbr.subSurface.indexOfRefraction = 1.5;
        pbr.subSurface.tintColor = new BABYLON.Color3( 0.5, 0.5, 0.5 );

        this.pbr = pbr;
    }

    setupEngine(){
        const canvas = this.canvas;
        const engine = new BABYLON.Engine( canvas, true );

        this.engine = engine;
    }

    setupCanvas(){
        const HTMLCanvasElement = window.HTMLCanvasElement;
        const config = this.config;
        const configCanvas = config.canvas;
        const configCanvasIsCanvasElement = configCanvas instanceof HTMLCanvasElement;
        const canvasIsString = typeof configCanvas === 'string';

        let canvas = null;

        if ( configCanvasIsCanvasElement ) {
            canvas = configCanvas;
        } else if ( canvasIsString ) {
            canvas = document.querySelector( configCanvas ) ||
                document.getElementById( configCanvas ) ||
                document.createElement( 'canvas' )
            ;
        }
        this.canvas = canvas;
    }
}