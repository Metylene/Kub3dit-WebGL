import Cell from "./Cell";
import { XYZ } from "../Utils/XYZ";
import { MathUtils } from "three";

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
    private _size: XYZ.type = {x:this._cellSize, y:this._cellSize, z:this._cellSize};
    /**
     *  Cell array that make up the world.
     */
    cells : Cell[][][];
    
    /**
     * World made up of Cells.
     * @param worldSize Length of the world in voxel for each axis. Must be Integer and minimum equal to Cellsize.
     * @param options.cellSize Voxel length of the edge of a Cell. Must be Integer and minimum 1. Default 32
     */
    constructor(worldSize : XYZ.type, options ?: {cellSize ?: number}){
        if(typeof options !== 'undefined'){
            if(typeof options.cellSize !== 'undefined'){
                // Todo throw error if this.size.x or y or z < Cellsize
                this.cellSize = Math.max(1, Math.floor(options.cellSize));
            }
        }
        this.size = worldSize; // Setter take care that size is minimum 1 cell
        const cellLength = {
            x: Math.floor(this.size.x / this.cellSize), // length
            y: Math.floor(this.size.y / this.cellSize), // height
            z: Math.floor(this.size.z / this.cellSize)  // depth
        };
        this.cells = []
        for (let x = 0; x < cellLength.x; x++) {
            let length : Cell[][] = []
            for (let y = 0; y < cellLength.y; y++) {
                let height : Cell[] = []
                for (let z = 0; z < cellLength.z; z++) {
                    const cell = new Cell({x:x, y:y, z:z}, this.cellSize); // height
                    height.push(cell);
                }
                length.push(height);
            }
            this.cells.push(length);
        }
    }

    private computeCellPosition(voxelPosition : XYZ.type){
        const cellX = Math.floor(voxelPosition.x / this.cellSize);
        const cellY = Math.floor(voxelPosition.y / this.cellSize);
        const cellZ = Math.floor(voxelPosition.z / this.cellSize);
        return {x: cellX, y: cellY, z: cellZ};
    }


    setVoxel(voxelPosition : XYZ.type, voxelId: number, addCell = true) {
        let cell = this.getCellForVoxel(voxelPosition);
        if(!cell){
            if(!addCell){
                return;
            }
            cell = this.addCellForVoxel(voxelPosition);
        }
        cell.setVoxel(this.computeVoxelOffset(voxelPosition), voxelId);
    }
    addCellForVoxel(voxelPosition: XYZ.type): Cell {
        // FIXME Is it useless to check if we find the cell ? We did in the method calling this one
        const cellId = this.computeCellPosition(voxelPosition);
        let cell : Cell = this.getCell(cellId);
        if(!cell){
            cell = new Cell(cellId, this.cellSize);
            if(typeof this.cells[cellId.x] === 'undefined'){
                this.cells[cellId.x] = [];
            }
            if(typeof this.cells[cellId.x][cellId.y] === 'undefined'){
                this.cells[cellId.x][cellId.y] = [];
            }
            this.cells[cellId.x][cellId.y][cellId.z] = cell;
        } else {
            // TODO throw error because we want to add already existing cell
            console.error("addCellForVoxel()", "Cell exist. We can't add it again");
        }
        return cell;
    }
    getCellForVoxel(voxelPosition : XYZ.type): Cell {
        const cellId = this.computeCellPosition(voxelPosition);
        return this.getCell(cellId);
    }
    computeVoxelOffset(voxelPosition: XYZ.type): number{
        const voxelX = MathUtils.euclideanModulo(voxelPosition.x, this.cellSize) | 0;
        const voxelY = MathUtils.euclideanModulo(voxelPosition.y, this.cellSize) | 0;
        const voxelZ = MathUtils.euclideanModulo(voxelPosition.z, this.cellSize) | 0;
        return voxelY * this.cellSize * this.cellSize +
            voxelZ * this.cellSize +
            voxelX;
    }


    /**
     * GETTERS / SETTERS
     */
    private getCell(x: number, y: number, z: number)
    private getCell(cellId: XYZ.type)
    private getCell(xOrCellId : number | XYZ.type, y?: number, z?: number): Cell{
        if(typeof xOrCellId === "number"){
            return this.cells[xOrCellId][y][z];
        } else {
            return this.cells[xOrCellId.x][xOrCellId.y][xOrCellId.z];
        }
    }
    /**
     * Length of the world in voxel for each axis.
     */
    public get size(): XYZ.type {
        return this._size;
    }
    /** 
     * Values must be Integers.
     * @min_value 1 for each axis
     */
    public set size(value: XYZ.type) {
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