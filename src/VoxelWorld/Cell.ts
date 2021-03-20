import { XYZ, multiplyBy } from "../Utils/XYZ";
import { Mesh, BufferGeometry, BufferAttribute } from "three";
import { Voxel } from "./Voxel";
import VoxelWorld from "./VoxelWorld";

export type cellId = "{cellPosition.x,cellPosition.y,cellPosition.z}";

export default class Cell {

    readonly world: VoxelWorld;
    private _position: XYZ;

    voxels: Uint8Array;

    mesh: THREE.Mesh;

    constructor(cellPosition: XYZ, world : VoxelWorld){
        this.world = world;
        this.voxels = new Uint8Array(world.cellSize * world.cellSize * world.cellSize);
        this.position = cellPosition;
    }

    generateMesh(material): THREE.Mesh{
        if(typeof this.mesh === 'undefined'){
            const {positions, normals, indices} = this.generateGeometryData();
            const geometry = new BufferGeometry();

            const positionNumComponents = 3;
            const normalNumComponents = 3;
            geometry.setAttribute(
                'position',
                new BufferAttribute(new Float32Array(positions), positionNumComponents));
            geometry.setAttribute(
                'normal',
                new BufferAttribute(new Float32Array(normals), normalNumComponents));
            geometry.setIndex(indices);
            this.mesh = new Mesh(geometry, material);
        }
        return this.mesh;
    }
    generateGeometryData() {
        const cellSize = this.world.cellSize;
        const positions = [];
        const normals = [];
        const indices = [];
        const startVoxelPosition = multiplyBy(this.position, cellSize);
        
        let currentVoxelPosition: XYZ = {x:0, y:0, z:0};
        for (let x = 0; x < cellSize; x++) {
            currentVoxelPosition.x = startVoxelPosition.x + x;
            for (let y = 0; y < cellSize; y++) {
                currentVoxelPosition.y = startVoxelPosition.y + y;
                for (let z = 0; z < cellSize; z++) {
                    currentVoxelPosition.z = startVoxelPosition.z + z;
                    const voxel = this.world.getVoxel(currentVoxelPosition);
                    if(voxel){
                        for(const {direction, corners} of Voxel.Faces){
                            const neighborPosition = {
                                x: currentVoxelPosition.x + direction[0],
                                y: currentVoxelPosition.y + direction[1],
                                z: currentVoxelPosition.z + direction[2]
                            };
                            const neighbor = this.world.getVoxel(neighborPosition);
                            if(!neighbor){
                                const ndx = positions.length / 3;
                                for(const pos of corners){
                                    positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                                    normals.push(...direction);
                                }
                                indices.push(
                                    ndx, ndx + 1, ndx + 2,
                                    ndx + 2, ndx + 1, ndx + 3,
                                  );
                            }
                        }
                    }
                }
            }
        }

        return {
          positions,
          normals,
          indices,
        };
    }
    /**
     * @param offset Offset between the voxel and the cell position
     * @param voxelId What type of voxel is it
     */
    setVoxel(offset: number, voxelId: number){
        this.voxels[offset] = voxelId;
    }

    /**
     * GETTERS / SETTERS
     */
    /** 
     * Position of this cell compared to other cells. Not in voxel distance.
     * Correspond to the cellId in their world.
     * @example
     * Cell{1, 0, 0} is next to Cell{0, 0, 0}
     */
    public get position(): XYZ {
        return this._position;
    }
    /** Must be Integers */
    public set position(position: XYZ) {
        // TODO throw error if x, y or z isn't integer
        position.x = Math.floor(position.x);
        position.y = Math.floor(position.y);
        position.z = Math.floor(position.z);
        this._position = position;
    }



}