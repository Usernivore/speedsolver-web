export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export const calculateMagnitude = (v: Vector3): number => {
    return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
};

export const addVectors = (v1: Vector3, v2: Vector3): Vector3 => {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
        z: v1.z + v2.z
    };
};

export const subtractVectors = (v1: Vector3, v2: Vector3): Vector3 => {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
        z: v1.z - v2.z
    };
};

export const dotProduct = (v1: Vector3, v2: Vector3): number => {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};

export const crossProduct = (v1: Vector3, v2: Vector3): Vector3 => {
    return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
    };
};
