export namespace Voxel {

    export const Faces = [
        { // left
            uvRow: 0,
            direction: [-1, 0, 0,],
            corners: [
                { pos: [0, 1, 0], uv: [0, 1], },
                { pos: [0, 0, 0], uv: [0, 0], },
                { pos: [0, 1, 1], uv: [1, 1], },
                { pos: [0, 0, 1], uv: [1, 0], },
            ],
        },
        { // right
            uvRow: 0,
            direction: [1, 0, 0,],
            corners: [
                { pos: [1, 1, 1], uv: [0, 1], },
                { pos: [1, 0, 1], uv: [0, 0], },
                { pos: [1, 1, 0], uv: [1, 1], },
                { pos: [1, 0, 0], uv: [1, 0], },
            ],
        },
        { // bottom
            uvRow: 1,
            direction: [0, -1, 0,],
            corners: [
                { pos: [1, 0, 1], uv: [1, 0], },
                { pos: [0, 0, 1], uv: [0, 0], },
                { pos: [1, 0, 0], uv: [1, 1], },
                { pos: [0, 0, 0], uv: [0, 1], },
            ],
        },
        { // top
            uvRow: 2,
            direction: [0, 1, 0,],
            corners: [
                { pos: [0, 1, 1], uv: [1, 1], },
                { pos: [1, 1, 1], uv: [0, 1], },
                { pos: [0, 1, 0], uv: [1, 0], },
                { pos: [1, 1, 0], uv: [0, 0], },
            ],
        },
        { // back
            uvRow: 0,
            direction: [0, 0, -1,],
            corners: [
                { pos: [1, 0, 0], uv: [0, 0], },
                { pos: [0, 0, 0], uv: [1, 0], },
                { pos: [1, 1, 0], uv: [0, 1], },
                { pos: [0, 1, 0], uv: [1, 1], },
            ],
        },
        { // front
            uvRow: 0,
            direction: [0, 0, 1,],
            corners: [
                { pos: [0, 0, 1], uv: [0, 0], },
                { pos: [1, 0, 1], uv: [1, 0], },
                { pos: [0, 1, 1], uv: [0, 1], },
                { pos: [1, 1, 1], uv: [1, 1], },
            ],
        },
    ];
}