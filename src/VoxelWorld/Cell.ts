import { XYZ } from "../Utils/XYZ";

export default class Cell {

    private _position: XYZ.type;

    voxels: Uint8Array;

    constructor(position: XYZ.type, size : number){
        this.voxels = new Uint8Array(size * size * size);
        this.position = position;
    }

    setVoxel(voxelOffset: number, voxelId: number) {
        this.voxels[voxelOffset] = voxelId;
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



}