import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import VoxelWorld from './VoxelWorld/VoxelWorld';
import { XYZ } from "./Utils/XYZ";
import { Utils } from "./Utils/Utils";

export class Editor {

    world : VoxelWorld;

    main(){
        const canvas = document.querySelector('#c') as HTMLCanvasElement;
        const renderer = new THREE.WebGLRenderer({canvas});
    
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("lightblue");
    
        const worldSize : XYZ.type = { x : 64, y : 32, z : 64 };
        const cellSize = 32;

        const light = new THREE.AmbientLight( 0x404040 );
        scene.add(light);

        const camera = new THREE.PerspectiveCamera(75, 2);
        camera.position.set(-cellSize * .3, cellSize * .8, -cellSize * .3);

        const controls = new OrbitControls(camera, canvas);
        controls.target.set(cellSize / 2, cellSize / 3, cellSize / 2);
        controls.update();

        this.world = new VoxelWorld(worldSize, {cellSize: cellSize});
        for (let y = 0; y < worldSize.y; y++) {
            for (let z = 0; z < worldSize.z; z++) {
                for (let x = 0; x < worldSize.x; x++) {
                    const height = (Math.sin(x / cellSize * Math.PI * 2) + Math.sin(z / cellSize * Math.PI * 3)) * (cellSize / 6) + (cellSize / 2);
                    if(y < height) {
                        const voxelId = Utils.randomInt(0, 75);
                        this.world.setVoxel({x, y, z}, voxelId);
                    }
                }
            }
        }
        let meshArray = this.world.generateCellsMeshArray();
        for (let i = 0; i < meshArray.length; i++) {
            const mesh = meshArray[i];
            scene.add(mesh);
        }
        renderer.render(scene, camera);
    }

}