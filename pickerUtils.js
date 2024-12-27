import * as THREE from 'three';


const getRotateDirections = (center) => {
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3(1, 0, 0);
    const forward = new THREE.Vector3(0, 0, 1);

    if (center.x == 3) {
        return {
            'h': new THREE.Vector3(0, 0, -1),
            'v': new THREE.Vector3(0, 1, 0), 
            'hp' : new THREE.Plane(up, 0),
            'vp' : new THREE.Plane(forward, 0),
            'hx' : up,
            'vx' : forward
        }
    } 
    else if (center.x == -3) {
        return {
            'h': new THREE.Vector3(0, 0, 1),
            'v': new THREE.Vector3(0, 1, 0), 
            'hp' : new THREE.Plane(up, 0),
            'vp' : new THREE.Plane(forward, 0),
            'hx' : up,
            'vx' : forward.clone().multiplyScalar(-1)
        }
    }
    else if (center.y == 3) {
        return {
            'h': new THREE.Vector3(1, 0, 0),
            'v': new THREE.Vector3(0, 0, -1),
            'hp' : new THREE.Plane(forward, 0),
            'vp' : new THREE.Plane(right, 0),
            'hx' : forward.clone().multiplyScalar(-1),
            'vx' : right.clone().multiplyScalar(-1)
        }
    }
    else if (center.y == -3) {
        return {
            'h': new THREE.Vector3(1, 0, 0),
            'v': new THREE.Vector3(0, 0, 1),
            'hp' : new THREE.Plane(forward, 0),
            'vp' : new THREE.Plane(right, 0),
            'hx' : forward,
            'vx' : right.clone().multiplyScalar(-1)
        }
    }
    else if (center.z == 3) {
        return {
            'h': new THREE.Vector3(1, 0, 0),
            'v': new THREE.Vector3(0, 1, 0),
            'hp' : new THREE.Plane(up, 0),
            'vp' : new THREE.Plane(right, 0),
            'hx' : up,
            'vx' : right.clone().multiplyScalar(-1)
        }
    }
    else if (center.z == -3) {
        return {
            'h': new THREE.Vector3(-1, 0, 0),
            'v': new THREE.Vector3(0, 1, 0),
            'hp' : new THREE.Plane(up, 0),
            'vp' : new THREE.Plane(right, 0),
            'hx' : up,
            'vx' : right
        }
    }

    return {};
}

export default getRotateDirections;