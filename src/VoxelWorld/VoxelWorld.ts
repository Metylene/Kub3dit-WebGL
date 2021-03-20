import Cell from "./Cell";
import { XYZ } from "../Utils/XYZ";
import { MathUtils, MeshLambertMaterial } from "three";

export default class VoxelWorld {
    /**
     * Voxel length of the edge of a Cell. Must be Integer and minimum 1.
     * @default 32
     */
    private _cellSize: number = 32;
    /**
     * Length of the _supports_ world in voxel for each axis. Must be Integer and minimum equal to Cellsize.
     * @default {x:cellSize, y:cellSize, z:cellSize}
     */
    private _size: XYZ = {x:this._cellSize, y:this._cellSize, z:this._cellSize};
    /**
     *  Cell array that make up the world.
     */
    cells : { [cellId: string]: Cell } = {};
    
    /**
     * World made up of Cells.
     * @param worldSize Length of the world in voxel for each axis. Must be Integer and minimum equal to Cellsize.
     * @param options.cellSize Voxel length of the edge of a Cell. Must be Integer and minimum 1. Default 32
     */
    constructor(worldSize : XYZ, options ?: {cellSize ?: number}){
        if(typeof options !== 'undefined'){
            if(typeof options.cellSize !== 'undefined'){
                // Todo throw error if this.size.x or y or z < Cellsize
                this.cellSize = Math.max(1, Math.floor(options.cellSize));
            }
        }
        this.size = worldSize; // Setter take care that size is minimum 1 cell
    }

    computeCellPosition(voxelPosition : XYZ){
        const cellX = Math.floor(voxelPosition.x / this.cellSize);
        const cellY = Math.floor(voxelPosition.y / this.cellSize);
        const cellZ = Math.floor(voxelPosition.z / this.cellSize);
        return {x: cellX, y: cellY, z: cellZ};
    }
    computeCellId(voxelPosition: XYZ): string{
        const cellSize = this.cellSize;
        const cellX = Math.floor(voxelPosition.x / cellSize);
        const cellY = Math.floor(voxelPosition.y / cellSize);
        const cellZ = Math.floor(voxelPosition.z / cellSize);
        return `${cellX},${cellY},${cellZ}`;
    }

    setVoxel(voxelPosition : XYZ, voxelId: number, addCell = true) {
        let cell = this.getCellForVoxel(voxelPosition);
        if(!cell){
            if(!addCell){
                return;
            }
            cell = this.addCellForVoxel(voxelPosition);
        }
        cell.setVoxel(VoxelWorld.computeVoxelOffset(voxelPosition, this.cellSize), voxelId);
    }
    addCellForVoxel(voxelPosition: XYZ): Cell {
        // FIXME Is it useless to check if we find the cell ? We did in the method calling this one
        const cellId = this.computeCellId(voxelPosition);
        let cell : Cell = this.getCell(cellId);
        if(!cell){
            cell = new Cell(this.computeCellPosition(voxelPosition), this);
            this.cells[cellId] = cell;
        } else {
            // TODO throw error because we want to add already existing cell
            console.error("addCellForVoxel()", "Cell exist. We can't add it again");
        }
        return cell;
    }
    getCellForVoxel(voxelPosition : XYZ): Cell {
        const cellId = this.computeCellId(voxelPosition);
        return this.getCell(cellId);
    }
    getCell(cellId: string): Cell{
        return this.cells[cellId];
    }
    getVoxel(voxelPosition: XYZ): number{
        const cellId = this.computeCellId(voxelPosition);
        const cell = this.cells[cellId];
        if(!cell) {
            return 0;
        }
        return cell.voxels[VoxelWorld.computeVoxelOffset(voxelPosition, this.cellSize)];
    }
    generateCellsMeshArray(): THREE.Mesh[] {
        const worldSizeInCell = {
            x: Math.floor(this.size.x / this.cellSize),
            y: Math.floor(this.size.y / this.cellSize),
            z: Math.floor(this.size.z / this.cellSize)
        }
        const material = new MeshLambertMaterial({color: 0x1167B1});
        let meshArray : THREE.Mesh[] = [];
        for (let x = 0; x < worldSizeInCell.x; x++) {
            for (let y = 0; y < worldSizeInCell.y; y++) {
                for (let z = 0; z < worldSizeInCell.z; z++) {
                    const cell = this.getCell(this.computeCellId({x: x, y: y, z: z}));
                    let mesh = cell.generateMesh(material);
                    meshArray.push(mesh);
                }
            }
        }
        return meshArray;
    }

    static computeVoxelOffset(voxelPosition: XYZ, cellSize: number): number{
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
     * Length of the world in voxel for each axis.
     */
    public get size(): XYZ {
        return this._size;
    }
    /** 
     * Values must be Integers.
     * @min_value 1 for each axis
     */
    public set size(value: XYZ) {
        // TODO throw error if one axe is < 1 and/or not integer
        this._size.x = Math.max(1 * this.cellSize, Math.floor(value.x));
        this._size.y = Math.max(1 * this.cellSize, Math.floor(value.y));
        this._size.z = Math.max(1 * this.cellSize, Math.floor(value.z));
    }
    /**
     * Number of voxel by cell.
     */
    public get cellSize(): number {
        return this._cellSize;
    }
    /**
     * Value must be Integer.
     * @min-value 1
     * @default 32
     */
    public set cellSize(value: number) {
        // TODO throw error if value is < 1 and/or not integer
        // TODO size = Math.max(size, cellSize) // World need to be at least the size of one cell
        this._cellSize = Math.max(1, Math.floor(value));
    }


}