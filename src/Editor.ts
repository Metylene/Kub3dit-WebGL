import * as THREE from "three";
import VoxelWorld from './VoxelWorld/VoxelWorld';
import { XYZ } from "./Utils/XYZ";
import { Utils } from "./Utils/Utils";

export class Editor {

    world : VoxelWorld;
    worldSize : XYZ.type = { x : 16, y : 16, z : 16 };
    cellSize = 16;

    main(){
        let world = new VoxelWorld(this.worldSize, {cellSize: this.cellSize});
        for (let y = 0; y < this.worldSize.y; y++) {
            for (let z = 0; z < this.worldSize.z; z++) {
                for (let x = 0; x < this.worldSize.x; x++) {
                    const height = (Math.sin(x / this.cellSize * Math.PI * 2) + Math.sin(z / this.cellSize * Math.PI * 3)) * (this.cellSize / 6) + (this.cellSize / 2);
                    if(y < height) {
                        const voxelId = Utils.randomInt(0, 75);
                        world.setVoxel({x, y, z}, voxelId);
                    }
                }
            }
        }
        
        const canvas = document.querySelector('#c') as HTMLCanvasElement;
        const renderer = new THREE.WebGLRenderer({canvas});
    
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("lightblue");
    
        const camera = new THREE.PerspectiveCamera();
        camera.position.set(-10, 20, -10);
        
        renderer.render(scene, camera);

        const cell = world.cells[0][0][0];
        // console.log(cell.voxels);
        console.log(world.cells);
    }
}