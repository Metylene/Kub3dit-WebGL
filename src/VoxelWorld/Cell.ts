import { XYZ, multiplyBy } from "../Utils/XYZ";
import { Mesh, BufferGeometry, MeshLambertMaterial, BufferAttribute } from "three";
import { MathUtils } from "three";
import { Voxel } from "./Voxel";

export type cellId = "{cellPosition.x,cellPosition.y,cellPosition.z}";

export default class Cell {

    private _size: number;
    private _position: XYZ.type;

    voxels: Uint8Array;

    mesh: THREE.Mesh;

    constructor(position: XYZ.type, size : number){
        this.size = size;
        this.voxels = new Uint8Array(size * size * size);
        this.position = position;
    }

    setVoxel(voxelOffset: number, voxelId: number) {
        this.voxels[voxelOffset] = voxelId;
    }

    generateMesh(): THREE.Mesh{
        if(typeof this.mesh === 'undefined'){
            const {positions, normals, indices} = this.generateGeometryData();
            const geometry = new BufferGeometry();
            const material = new MeshLambertMaterial({color: 0x1167B1});

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
            console.log(this.mesh);
        } else {
            console.log("Ah ? Oups !");
        }
        return this.mesh;
    }
    generateGeometryData() {
        const positions = [];
        const normals = [];
        const indices = [];
        const startVoxelPosition = multiplyBy(this.position, this.size);
        
        let currentVoxelPosition: XYZ.type = {x:0, y:0, z:0};
        for (let x = 0; x < this.size; x++) {
            currentVoxelPosition.x = startVoxelPosition.x + x;
            for (let y = 0; y < this.size; y++) {
                currentVoxelPosition.y = startVoxelPosition.y + y;
                for (let z = 0; z < this.size; z++) {
                    currentVoxelPosition.z = startVoxelPosition.z + z;
                    const voxel = this.getVoxel(currentVoxelPosition);
                    if(voxel){
                        for(const {direction, corners} of Voxel.Faces){
                            const neighborPosition = {
                                x: currentVoxelPosition.x + direction[0],
                                y: currentVoxelPosition.y + direction[1],
                                z: currentVoxelPosition.z + direction[2]
                            };
                            const neighbor = this.getVoxel(neighborPosition);
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
    getVoxel(position: XYZ.type): number{
        const voxelOffset = Cell.computeVoxelOffset(position, this.size);
        return this.voxels[voxelOffset];
    }

    static computeVoxelOffset(voxelPosition: XYZ.type, cellSize: number): number{
        const voxelX = MathUtils.euclideanModulo(voxelPosition.x, cellSize) | 0;
        const voxelY = MathUtils.euclideanModulo(voxelPosition.y, cellSize) | 0;
        const voxelZ = MathUtils.euclideanModulo(voxelPosition.z, cellSize) | 0;
        return voxelY * cellSize * cellSize +
            voxelZ * cellSize +
            voxelX;
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
    public get position(): XYZ.type {
        return this._position;
    }
    /** Must be Integers */
    public set position(position: XYZ.type) {
        // TODO throw error if x, y or z isn't integer
        position.x = Math.floor(position.x);
        position.y = Math.floor(position.y);
        position.z = Math.floor(position.z);
        this._position = position;
    }
    public get size(): number {
        return this._size;
    }
    public set size(value: number) {
        // TODO throw error if size is < 1 or not integer
        this._size = value;
    }



}