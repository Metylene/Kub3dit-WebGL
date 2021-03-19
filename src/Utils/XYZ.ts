export namespace XYZ {

    export type type = {
        x: number;
        y: number;
        z: number;
    };

}

/**
 * Multiply x, y and z by a value.
 * @param xyz Object who will by multiply
 * @param value Value used to multiply by
 * @returns new XYZ object
 */
export function multiplyBy(xyz: XYZ.type, value: number): XYZ.type{
    return {
        x: xyz.x * value,
        y: xyz.y * value,
        z: xyz.z * value,
    }
}