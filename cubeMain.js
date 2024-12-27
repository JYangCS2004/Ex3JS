import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { degToRad, radToDeg } from 'three/src/math/MathUtils';
import moveInfo from './pickerUtils';
import { EffectComposer, OutputPass, RenderPass, ShaderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js';


const rotation = { 'U': {}, 'R': {}, 'L': {}, 'D': {}, 'B': {}, 'F': {} };
const globalCubeState = {
    u: [],
    d: [],
    r: [],
    l: [],
    f: [],
    b: []
};


rotation['U'].faces = ['B', 'R', 'F', 'L'];
rotation['U'].center = new THREE.Vector3(0, 2, 0);
rotation['U'].axis = new THREE.Vector3(0, -1, 0);

rotation['R'].faces = ['F', 'U', 'B', 'D'];
rotation['R'].center = new THREE.Vector3(2, 0, 0);
rotation['R'].axis = new THREE.Vector3(-1, 0, 0);

rotation['L'].faces = ['F', 'D', 'B', 'U'];
rotation['L'].center = new THREE.Vector3(-2, 0, 0);
rotation['L'].axis = new THREE.Vector3(1, 0, 0);

rotation['D'].faces = ['F', 'R', 'B', 'L'];
rotation['D'].center = new THREE.Vector3(0, -2, 0);
rotation['D'].axis = new THREE.Vector3(0, 1, 0);

rotation['B'].faces = ['U', 'L', 'D', 'R'];
rotation['B'].center = new THREE.Vector3(0, 0, 2);
rotation['B'].axis = new THREE.Vector3(0, 0, 1);

rotation['F'].faces = ['U', 'R', 'D', 'L'];
rotation['F'].center = new THREE.Vector3(0, 0, 2);
rotation['F'].axis = new THREE.Vector3(0, 0, -1);


const updateCubeState = (sticker) => {
    const center = sticker.center;
    const color = sticker.color;

    const [x, y, z] = [center.x, center.y, center.z];

    if (center.x == 3) {
        const c = -0.5 * z + 1;
        const r = -0.5 * y + 1;
        globalCubeState.r[r * 3 + c] = color;
    }

    if (center.x == -3) {
        const c = 0.5 * z + 1;
        const r = -0.5 * y + 1;
        globalCubeState.l[r * 3 + c] = color;
    }

    if (center.y == 3) {
        const c = 0.5 * x + 1;
        const r = 0.5 * z + 1;
        globalCubeState.u[r * 3 + c] = color;
    }

    if (center.y == -3) {
        const c = 0.5 * x + 1;
        const r = -0.5 * z + 1;
        globalCubeState.d[r * 3 + c] = color;
    }

    if (center.z == 3) {
        const c = 0.5 * x + 1;
        const r = -0.5 * y + 1;
        globalCubeState.f[r * 3 + c] = color;
    }

    if (center.z == -3) {
        const c = -0.5 * x + 1;
        const r = -0.5 * y + 1;
        globalCubeState.b[r * 3 + c] = color;
    }
}

const movePicker = (moveStr) => {
    const moveObj = {};
    moveObj.all = false;
    moveObj.sign = 1;
    moveObj.turns = 1;

    moveStr = moveStr.trim();

    const move = moveStr[0];
    const modifier = moveStr.length > 1 ? moveStr[1] : '';

    if (modifier == '\'') {
        moveObj.sign = -1;
    }

    if (modifier == '2') {
        moveObj.turns = 2;
    }

    const right = new THREE.Vector3(1, 0, 0);
    const up = new THREE.Vector3(0, 1, 0);
    const forward = new THREE.Vector3(0, 0, 1);

    switch (move) {
        case 'R':
            moveObj.axis = new THREE.Vector3(-1, 0, 0);
            moveObj.plane = new THREE.Plane(right, -2);
            break;
        case 'L':
            moveObj.axis = new THREE.Vector3(1, 0, 0);
            moveObj.plane = new THREE.Plane(right, 2);
            break;
        case 'U':
            moveObj.axis = new THREE.Vector3(0, -1, 0);
            moveObj.plane = new THREE.Plane(up, -2);
            break;
        case 'D':
            moveObj.axis = new THREE.Vector3(0, 1, 0);
            moveObj.plane = new THREE.Plane(up, 2);
            break;
        case 'F':
            moveObj.axis = new THREE.Vector3(0, 0, -1);
            moveObj.plane = new THREE.Plane(forward, -2);
            break;
        case 'B':
            moveObj.axis = new THREE.Vector3(0, 0, 1);
            moveObj.plane = new THREE.Plane(forward, 2);
            break;
        case 'r':
            moveObj.axis = new THREE.Vector3(-1, 0, 0);
            moveObj.plane = new THREE.Plane(right, -2);
            moveObj.plane2 = new THREE.Plane(right, 0);
            break;
        case 'l':
            moveObj.axis = new THREE.Vector3(1, 0, 0);
            moveObj.plane = new THREE.Plane(right, 2);
            moveObj.plane2 = new THREE.Plane(right, 0);
            break;
        case 'u':
            moveObj.axis = new THREE.Vector3(0, -1, 0);
            moveObj.plane = new THREE.Plane(up, -2);
            moveObj.plane2 = new THREE.Plane(up, 0);
            break;
        case 'd':
            moveObj.axis = new THREE.Vector3(0, 1, 0);
            moveObj.plane = new THREE.Plane(up, 2);
            moveObj.plane2 = new THREE.Plane(up, 0);
            break;
        case 'f':
            moveObj.axis = new THREE.Vector3(0, 0, -1);
            moveObj.plane = new THREE.Plane(forward, -2);
            moveObj.plane2 = new THREE.Plane(forward, 0);

            break;
        case 'b':
            moveObj.axis = new THREE.Vector3(0, 0, 1);
            moveObj.plane = new THREE.Plane(forward, 2);
            moveObj.plane2 = new THREE.Plane(forward, 0);

            break;
        case 'x':
            moveObj.axis = new THREE.Vector3(-1, 0, 0);
            moveObj.plane = new THREE.Plane(right, -2);
            moveObj.all = true;
            break;
        case 'y':
            moveObj.axis = new THREE.Vector3(0, -1, 0);
            moveObj.plane = new THREE.Plane(right, -2);
            moveObj.all = true;
            break;
        case 'z':
            moveObj.axis = new THREE.Vector3(0, 0, -1);
            moveObj.plane = new THREE.Plane(right, -2);
            moveObj.all = true;
            break;
        case 'M':
            moveObj.axis = new THREE.Vector3(1, 0, 0);
            moveObj.plane = new THREE.Plane(right, 0);
            break;
        case 'E':
            moveObj.axis = new THREE.Vector3(0, 1, 0);
            moveObj.plane = new THREE.Plane(up, 0);
            break;
        case 'S':
            moveObj.axis = new THREE.Vector3(0, 0, -1);
            moveObj.plane = new THREE.Plane(forward, 0);
            break;
        default:
            break;
    }

    return moveObj;
}


class Cubie {
    constructor(mesh, outline) {
        this.obj = mesh;
        this.outline = outline;
        this.CtFMap = {};
        this.idToCenter = {};
        this.idToColour = {};
        this.center = new THREE.Vector3();
        this.pickingObj = null;
    }

    containsId(id) {
        for (const key in this.idToCenter) {
            if (key == id) return true;
        }

        return false;
    }

    getCenterId(id) {
        return this.idToCenter[id];
    }

    addFace(color, face) {
        this.CtFMap[color] = face;
    }

    setPosition(x, y, z) {
        //this.obj.geometry.translate(x, y, z);
        this.obj.position.set(x, y, z);
        this.center.set(x, y, z);
        //this.outline.position.set(x, y, z);
    }

    getCenter() { return this.center; }

    contains(face) {
        for (const key in this.CtFMap) {
            if (this.CtFMap[key] == face) return true;
        }

        return false;
    }

    moveFace(face, direction = 1) {
        const temp = rotation[face].faces;
        for (const key in this.CtFMap) {
            if (this.CtFMap[key] != face) {
                const curr = temp.indexOf(this.CtFMap[key]);
                this.CtFMap[key] = temp[(curr + direction) % temp.length];
            }
        }
    }

    rotateCenters(rotation) {
        this.center.applyQuaternion(rotation);
        this.center.round();

        for (const key in this.idToCenter) {
            let center = this.idToCenter[key];

            center.applyQuaternion(rotation);
            center.round();
        }
    }

    updateColState() {
        for (const key in this.idToCenter) {
            updateCubeState({
                center: this.idToCenter[key],
                color: this.idToColour[key]
            });
        }
    }
}


class FaceController {
    constructor(cubies) {
        this.preMoves = false;
        this.clock = new THREE.Clock();
        this.moveQueue = [];
        this.auto = false;
        this.moveObj = {};
        this.selected = [];
        this.moves = [];
        this.cubies = cubies;
        this.face = new THREE.Group();
        this.angle = 0;
        this.sign = 1;
        scene.add(this.face);

        this.clock.running = true;
    }

    bind(moveObj) {
        this.moveObj = moveObj;
        this.cubies.forEach(c => {
            let cond2 = moveObj.plane2 != undefined ? intersects(moveObj.plane2, c.obj) : false;
            if (moveObj.all || intersects(moveObj.plane, c.obj) || cond2) {
                this.selected.push(c);
                this.face.attach(c.obj);
            }
        });
    }

    rotate2() {
        if (this.preMoves) {
            this.rotateTowards(this.moveObj.quaternion);
        } else {
            this.rotate();
        }
    }

    rotate() {
        if (this.auto) {
            const target = Math.PI / 2 * this.moveObj.sign * this.moveObj.turns;
            const targetQ = new THREE.Quaternion().setFromAxisAngle(this.moveObj.axis.normalize(), target);
            this.rotateTowards(targetQ);
            return;
        }

        if (clickHeld) {
            const dist = new THREE.Vector2(mousePrev.x - mouse.x, mousePrev.y - mouse.y).length();
            const signedDist = this.sign * dist * 4;

            this.face.rotateOnWorldAxis(axis, signedDist);
            this.angle += signedDist;

            mousePrev.copy(mouse);
        } else {
            const closestAngle = degToRad(Math.round(radToDeg(this.angle) / 90) * 90);
            const closestQ = new THREE.Quaternion().setFromAxisAngle(axis.normalize(), closestAngle);
            this.rotateTowards(closestQ);
        }
    }

    rotateTowards(quaternion) {
        if (!this.face.quaternion.equals(quaternion)) {
            this.face.quaternion.rotateTowards(quaternion, 0.1);
        } else {
            this.unbind(quaternion);
        }
    }

    unbind(rotation) {
        const copy = [...this.face.children];
        for (let i = 0; i < copy.length; i++) {
            scene.attach(copy[i]);
        }

        for (let i = 0; i < this.selected.length; i++) {
            const c = this.selected[i];
            c.obj.position.round();

            c.pickingObj.position.copy(c.obj.position);
            c.pickingObj.quaternion.copy(c.obj.quaternion);
            c.rotateCenters(rotation);
        }

        this.face.quaternion.copy(new THREE.Quaternion().identity());
        this.selected = [];
        this.angle = 0;

        if (this.moveObj.callback != undefined) {
            this.moveObj.callback();
        }
    }

    setAutoMoves(moves) {
        this.auto = true;
        this.moves = moves;
    }

    bindNextMove() {
        if (!this.auto || this.selected.length > 0) return;
        if (this.moves.length == 0) {
            this.auto = false;
            return;
        }

        const front = this.moves.shift();
        const temp = movePicker(front);
        this.bind(temp);
    }
}


class RubiksCube {
    clock = 13;
    center = new THREE.Vector3(0, 2, 0);
    axis = new THREE.Vector3(0, 1, 0);
    tempFace;

    constructor(material) {
        this.state = 1;
        this.uniqueId = 1;
        this.cubes = [];
        this.pickingData = [];
        this.rotating = false;
        this.markerG = null;
        this.markerW = null;

        const defaultMaterial = new THREE.MeshBasicMaterial({
            vertexColors: true,

        });

        for (let z = -2; z <= 2; z += 2) {
            for (let x = -2; x <= 2; x += 2) {
                for (let y = -2; y <= 2; y += 2) {
                    const box = new THREE.BoxGeometry(2, 2, 2).toNonIndexed();

                    const mesh = new THREE.Mesh(box, material);
                    // const wireframe = new THREE.LineSegments(new THREE.EdgesGeometry(box),
                    //     new THREE.LineBasicMaterial({ color: 0x000000 }));

                    var cubie = new Cubie(mesh);
                    cubie.setPosition(x, y, z);
                    this.cubes.push(cubie);
                }
            }
        }

        this.cubes.forEach((c) => {
            const geometry = c.obj.geometry;
            const colors = Array(geometry.getAttribute('position').count * 3).fill(Math.random());
            const ids = new Int16Array(geometry.attributes.position.count);

            this.initColors(colors, c);
            this.initIds(ids, c);

            const bufferAttrib = new THREE.Int16BufferAttribute(ids, 1, false);
            bufferAttrib.gpuType = THREE.IntType;

            geometry.setAttribute('id', bufferAttrib);
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

            scene.add(c.obj);

            const meshPicking = new THREE.Mesh(geometry, pickingMaterial);
            meshPicking.position.copy(c.obj.position);
            pickingScene.add(meshPicking);

            c.pickingObj = meshPicking;
        });
    }

    initIds(array, c) {
        const position = c.getCenter();
        if (position.x == 2) {
            const id = this.nextId();
            applyFaceIds(0, array, id);

            c.idToCenter[id] = new THREE.Vector3(3, position.y, position.z);
            c.idToColour[id] = 'r';
        }

        if (position.x == -2) {
            const id = this.nextId();
            applyFaceIds(6, array, id);

            c.idToCenter[id] = new THREE.Vector3(-3, position.y, position.z);
            c.idToColour[id] = 'o';
        }

        if (position.y == 2) {
            const id = this.nextId();
            applyFaceIds(12, array, id);

            c.idToCenter[id] = new THREE.Vector3(position.x, 3, position.z);
            c.idToColour[id] = 'w';

            if (new THREE.Vector3(0, 3, 0).equals(c.idToCenter[id])) {
                this.markerW = c.idToCenter[id];
            }
        }

        if (position.y == -2) {
            const id = this.nextId();
            applyFaceIds(18, array, id);
            c.idToCenter[id] = new THREE.Vector3(position.x, -3, position.z);
            c.idToColour[id] = 'y';
        }

        if (position.z == 2) {
            const id = this.nextId();
            applyFaceIds(24, array, id);
            c.idToCenter[id] = new THREE.Vector3(position.x, position.y, 3);
            c.idToColour[id] = 'g';

            if (new THREE.Vector3(0, 0, 3).equals(c.idToCenter[id])) {
                this.markerG = c.idToCenter[id];
            }
        }

        if (position.z == -2) {
            const id = this.nextId();
            applyFaceIds(30, array, id);
            c.idToCenter[id] = new THREE.Vector3(position.x, position.y, -3);
            c.idToColour[id] = 'b';
        }
    }

    initColors(array, c) {
        const position = c.getCenter();
        if (position.x == 2) {
            applyFaceColor(0, array, new THREE.Color(0xff0000));

            //c.idToCenter[id] = new THREE.Vector3(3, position.y, position.z);
            c.addFace('R', 'R');
        }

        if (position.y == 2) {
            applyFaceColor(36, array, new THREE.Color(0xffffff));
            //c.idToCenter[this.nextId()] = new THREE.Vector3(position.x, 3, position.z);

            c.addFace('W', 'U');
        }

        if (position.x == -2) {
            applyFaceColor(18, array, new THREE.Color(0xffa500));
            //c.idToCenter[this.nextId()] = new THREE.Vector3(-3, position.y, position.z);

            c.addFace('O', 'L');
        }

        if (position.z == 2) {
            applyFaceColor(72, array, new THREE.Color(0x00ff00));
            //c.idToCenter[this.nextId()] = new THREE.Vector3(position.x, position.y, 3);

            c.addFace('G', 'F');
        }

        if (position.z == -2) {
            applyFaceColor(90, array, new THREE.Color(0x87CEFA));
            //c.idToCenter[this.nextId()] = new THREE.Vector3(position.x, position.y, -3);

            c.addFace('B', 'B');
        }

        if (position.y == -2) {
            applyFaceColor(54, array, new THREE.Color(0xffff00));
            //c.idToCenter[this.nextId()] = new THREE.Vector3(position.x, -3, position.z);

            c.addFace('Y', 'D');
        }
    }

    initializeFaces() {
        this.cubes.forEach((c) => {
            const position = c.obj.geometry.attributes.position;
            if (position.x == 2) {
                applyFaceColor(0, c.obj.geometry.getAttribute('color').array, new THREE.Color(0xff0000));
                c.addFace('R', 'R');
            }

            if (position.y == 2) {
                applyFaceColor(36, c.obj.geometry.getAttribute('color').array, new THREE.Color(0xffffff));
                c.addFace('W', 'U');
            }

            if (position.x == -2) {
                applyFaceColor(18, c.obj.geometry.getAttribute('color').array, new THREE.Color(0xfc6600));
                c.addFace('O', 'L');
            }

            if (position.z == 2) {
                applyFaceColor(72, c.obj.geometry.getAttribute('color').array, new THREE.Color(0x00ff00));
                c.addFace('G', 'F');
            }

            if (position.z == -2) {
                applyFaceColor(90, c.obj.geometry.getAttribute('color').array, new THREE.Color(0x87CEFA));
                c.addFace('B', 'B');
            }

            if (position.y == -2) {
                applyFaceColor(54, c.obj.geometry.getAttribute('color').array, new THREE.Color(0xffff00));
                c.addFace('Y', 'D');
            }
        });
    }


    render(scene) {
        // Add each cubie to scene
        this.cubes.forEach((c) => scene.add(c.obj));
        //this.cubes.forEach((c) => scene.add(c.outline));

        //this.cubes.forEach((c) => c.outline.scale.set(1, 1, 1));
    }

    updateColorState() {
        for (let i = 0; i < this.cubes.length; i++) {
            this.cubes[i].updateColState();
        }
    }

    update() {
        if (this.clock <= 12) {
            const frameRate = remainingRot / 12;
            this.clock += 1;

            this.cubes.forEach((c) => {
                if (this.#isInFace(c)) {
                    rotateAboutPivot(c.obj, rotation[this.tempFace].center, rotation[this.tempFace].axis, frameRate);
                    //rotateAboutPivot(c.outline, rotation[this.tempFace].center, rotation[this.tempFace].axis, remainingRot * frameRate);
                }
            });

            if (this.clock > 12) {
                remainingRot = 0;
            }
        }

        const diff = mouse.x - mousePrev.x;
        remainingRot += diff;
        this.cubes.forEach(c => {
            if (c.contains(this.tempFace) && clickHeld) {
                rotateAboutPivot(c.obj, rotation[this.tempFace].center, rotation[this.tempFace].axis, diff);
            }
        });
    }


    checkIntersection() {
        let closest = null;
        let distance = Infinity;
        raycaster.setFromCamera(mouse, camera);
        this.cubes.forEach((c) => {

            var intersect = raycaster.intersectObject(c.obj);

            if (intersect.length > 0) {
                const pos = new THREE.Vector3();
                camera.getWorldPosition(pos);

                if (pos.distanceTo(c.obj.position) < distance) {
                    closest = c;
                    distance = pos.distanceTo(c.obj.position);
                }
            }

            // if (clickHeld && c.contains('U')) {
            //     //rotateAboutPivot(c.obj, this.center, this.axis, diff.x * 4);
            //     //rotateAboutPivot(c.outline, this.center, this.axis, diff.x * 4);
            // }
        });

        return closest;
    }

    applyId(geometry, id) {
        const position = geometry.attributes.position;
        const array = new Int16Array(position.count);
        array.fill(id);

        const bufferAttrib = new THREE.Int16BufferAttribute(array, 1, false);
        bufferAttrib.gpuType = THREE.IntType;
        geometry.setAttribute('id', bufferAttrib);
    }

    getCubieContainingId(id) {
        for (const c of this.cubes) {
            if (c.containsId(id)) {
                return c;
            }
        }
    }

    applyRotation(move, direction = 1) {
        this.clock = 0;

        this.center.copy(rotation[move].center);
        this.axis.copy(rotation[move].axis);
        this.axis.multiplyScalar(direction);
        this.tempFace = move;
        //console.log(this.tempFace);

        this.cubes.forEach((c) => {
            if (this.#isInFace(c)) c.rotate(move, direction);
        });

        //console.log(rubiks.cubes[0].CtFMap);
    }

    up() {
        this.center.set(0, 2, 0);
        this.axis.set(0, 1, 0);
        this.clock = 0;
    }

    right() {
        this.center.set(2, 0, 0);
        this.axis.set(1, 0, 0);
        this.clock = 0;
    }

    left() {
        this.center.set(-2, 0, 0);
        this.axis.set(-1, 0, 0);
        this.clock = 0;
    }

    down() {
        this.center.set(0, -2, 0);
        this.axis.set(0, 1, 0);
        this.clock = 0;
    }

    #isInFace(c) {
        return c.contains(this.tempFace);
        /*if (this.center.x != 0) {
            console.log(obj.position.x);
            return obj.position.x == this.center.x;
        }
        
        if (this.center.y != 0) {
            console.log(obj.position.y);
            return obj.position.y == this.center.y;
        }
        
        if (this.center.z != 0) {
            console.log(obj.position.z);
            return obj.position.z == this.center.z;
        } */
    }

    findCubie(obj) {
        for (let i = 0; i < this.cubes.length; i++) {
            const c = this.cubes[i];
            if (Object.is(c.obj, obj)) return c;
        }

        return null;
    }

    getState() { return this.state; }


    setRotatingFace(face) {
        this.tempFace = face;
    }

    isRotating() {
        return this.clock <= 12;
    }

    setFaceByAxis(axis) {
        for (const [key, value] of Object.entries(rotation)) {
            if (value.axis.equals(axis)) {
                this.tempFace = key;
                break;
            }
        }
    }

    resetClock() {
        this.state = 0;
        this.clock = 0;
    }

    getCubies() {
        return this.cubes;
    }

    getFace() {
        return this.tempFace;
    }

    nextId() {
        return this.uniqueId++;
    }
}



// Main Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 15);

// Texture Scene
const pointer = new THREE.Vector2();
const pickingScene = new THREE.Scene();
const pickingTexture = new THREE.WebGLRenderTarget(1, 1, {
    type: THREE.IntType,
    format: THREE.RGBAIntegerFormat,
    internalFormat: 'RGBA32I'
});

const pickingMaterial = new THREE.ShaderMaterial({

    glslVersion: THREE.GLSL3,

    vertexShader: /* glsl */`
                    attribute int id;
                    flat varying int vid;
                    void main() {

                        vid = id;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

                    }
                `,

    fragmentShader: /* glsl */`
                    layout(location = 0) out int out_id;
                    flat varying int vid;

                    void main() {

                        out_id = vid;

                    }
                `,

});


// temporary axes visualizer
//scene.add(new THREE.AxesHelper(10));

const color = 0xffffff;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
//scene.add(light);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
//renderer.toneMapping = THREE.ReinhardToneMapping;
document.body.appendChild(renderer.domElement);

// Post Processing
const composer = new EffectComposer(renderer);

const renderScene = new RenderPass(scene, camera);
//const fxaaPass = new ShaderPass(THREE.FXXAShader);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.1, 0.2, 1.0);
const outputPass = new OutputPass();

composer.addPass(renderScene);
composer.addPass(bloomPass);
//composer.addPass(fxaaPass);
composer.addPass(outputPass);

// Mouse
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var mousePrev = new THREE.Vector2();
let currDirection = new THREE.Vector2();

var remainingRot = 0;
let directionSet = false;
var clickHeld = false;
let pickedId = -1;



// Orbital Controls
const controls = new TrackballControls(camera, renderer.domElement);
controls.noPan = true;
controls.noZoom = true;

const cubieMaterial = new THREE.ShaderMaterial({
    uniforms: {
        size: {
            value: new THREE.Vector3(1, 2, 2).multiplyScalar(0.5)
        },
        thickness: {
            value: 3.0
        },
        smoothness: {
            value: 0.2
        }
    },
    glslVersion: THREE.GLSL3,
    vertexShader: `
        attribute int id;
        precision highp float;
        out vec3 vColor;
        out vec3 vPos;
        out vec2 vUv;
        flat out int vid;
        void main() {
            vUv = uv;
            vid = id;
            vPos = position;
            vColor = color;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        layout (location = 0) out vec4 outColor;
		//#extension GL_OES_standard_derivatives : enable
    precision highp float; 
    in vec2 vUv;
    in vec3 vColor;
    flat in int vid;
    in vec3 vPos;
    uniform float thickness;
   	
    float edgeFactor(vec2 p){
    	vec2 grid = abs(fract(p - 0.5) - 0.5) / 0.5;
  		return min(grid.x, grid.y);
    }

    vec3 toSRGB(vec3 color) {
      return pow(color, vec3(1.0 / 2.2));
    }
    
    void main() {
    vec3 color = vec3(0);
    if (vid >= 1) {
        color = vColor;
    }

      float a = edgeFactor(vUv);
      vec3 c = mix(vec3(0.0), color, a);
      outColor = vec4(toSRGB(c) * 1.3, 1.0);
    }
    `,
    vertexColors: true
});


const rubiks = new RubiksCube(cubieMaterial);
const rotator = new FaceController(rubiks.getCubies());

window.addEventListener('mousedown', mouseDown);
window.addEventListener('pointermove', mouseMove);
window.addEventListener('mouseup', mouseUp);

const facing = new THREE.Vector3();
const axis = new THREE.Vector3();
// render scene
const cameraDir = new THREE.Vector3(0, 0, 0);
camera.getWorldDirection(cameraDir);


// Animation Loop
animate();
function animate() {
    rotator.bindNextMove(rubiks.getCubies());
    rotator.rotate2();
    controls.update();

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //composer.render();
}

function pick(event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    const dpr = window.devicePixelRatio;
    camera.setViewOffset(
        renderer.domElement.width, renderer.domElement.height,
        Math.floor(pointer.x * dpr), Math.floor(pointer.y * dpr),
        1, 1
    );

    renderer.setRenderTarget(pickingTexture);
    renderer.render(pickingScene, camera);

    camera.clearViewOffset();

    const buffer = new Int32Array(4);
    renderer.readRenderTargetPixels(pickingTexture, 0, 0, 1, 1, buffer);

    //console.log(buffer[0]); // Testing
    renderer.setRenderTarget(null);

    return buffer[0];
}


function mouseDown(event) {
    console.log('mousedown');
    if (rotator.auto) return;
    pickedId = pick(event);

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    mousePrev.copy(mouse);

    if (pickedId > 0) {
        clickHeld = true;
        controls.noRotate = true;

        const cubie = rubiks.getCubieContainingId(pickedId);
        const idCenter = cubie.getCenterId(pickedId);
    }
}

function mouseMove(event) {
    //if (rubiks.isRotating() || !clickHeld) return;
    mousePrev.copy(mouse);

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const mouseDir = new THREE.Vector3(
        mouse.x - mousePrev.x,
        mouse.y - mousePrev.y,
        0
    )

    if (pickedId > 0) {
        const cubie = rubiks.getCubieContainingId(pickedId);
        const idCenter = cubie.getCenterId(pickedId);

        const moveObj = moveInfo(idCenter);
        if (!directionSet) {

            // console.log(moveObj.v);
            // console.log(moveObj.h);

            const origin = new THREE.Vector3(0, 0, 0).project(camera);
            const horizontal = moveObj.h.clone().project(camera).sub(origin).normalize();
            const vertical = moveObj.v.clone().project(camera).sub(origin).normalize();

            let rotatePlane = null;

            const crossH = new THREE.Vector3(horizontal.x, horizontal.y, 0).cross(mouseDir);
            const crossV = new THREE.Vector3(vertical.x, vertical.y, 0).cross(mouseDir);

            if (crossH.length() < crossV.length()) {
                rotatePlane = moveObj.hp;
                currDirection = new THREE.Vector3(horizontal.x, horizontal.y, 0);

                axis.copy(moveObj.hx);
            } else {
                rotatePlane = moveObj.vp;
                currDirection = new THREE.Vector3(vertical.x, vertical.y, 0);

                axis.copy(moveObj.vx);
            }

            rotatePlane.constant = -rotatePlane.normal.dot(cubie.center);

            rotator.bind({
                plane: rotatePlane,
                all: false
            });
            directionSet = true;
        }

        if (currDirection.angleTo(mouseDir) > Math.PI / 2) {
            rotator.sign = -1;
        } else {
            rotator.sign = 1;
        }
    }
}

function mouseUp(event) {
    clickHeld = false;
    controls.noRotate = false;
    directionSet = false;
    pickedId = -1;

    mousePrev.copy(mouse);
}


function rotateAboutPivot(obj, pivot, axis, angle) {
    obj.position.sub(pivot);
    obj.position.applyAxisAngle(axis, angle);
    obj.position.add(pivot);

    obj.rotateOnWorldAxis(axis, angle);
}

function applyFaceColor(start, color_arr, color) {
    const rgb = [color.r, color.g, color.b];
    let count = 0;

    for (let i = start; i <= start + 17; i++) {
        color_arr[i] = rgb[count];
        count = (count + 1) % 3;
    }
}

function applyFaceIds(start, id_arr, id) {
    for (let i = start; i <= start + 5; i++) {
        id_arr[i] = id;
    }
}


document.getElementById('orient').addEventListener('click', orientCube);
document.getElementById('solve').addEventListener('click', solveCube);
document.getElementById('scramble').addEventListener('click', scrambleCube);

function orientCube() {
    rotator.preMoves = true;
    const rotateGreen = new THREE.Quaternion().setFromUnitVectors(
        rubiks.markerG.clone().normalize(),
        new THREE.Vector3(0, 0, 1));

    rotator.bind({
        all: true,
        quaternion: rotateGreen,
        callback: () => {
            const rotateWhite = new THREE.Quaternion().setFromUnitVectors(
                rubiks.markerW.clone().normalize(),
                new THREE.Vector3(0, 1, 0));

            rotator.bind({
                all: true,
                quaternion: rotateWhite,
                callback: () => {
                    rotator.preMoves = false
                }
            })
        }
    })
}

async function solveCube() {
    rubiks.updateColorState();
    let cubeStr = globalCubeState.u.join("") + " " + globalCubeState.f.join("") + " " + globalCubeState.r.join("") + " " + globalCubeState.b.join("") + " " + globalCubeState.l.join("") + " " + globalCubeState.d.join("");

    const response = await fetch("http://localhost:5000/solve", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ algo: cubeStr })
    });

    const json = await response.json();
    const cleanedStr = json.solution.replace(/[\r\n]/g, ' ');

    rotator.preMoves = false;
    rotator.setAutoMoves(cleanedStr.split(" ").filter((m) => { return m != "" }));
}

function scrambleCube() {
    const moves = ['S', 'L', 'M', 'D', 'B', 'F', 'R', 'E', 'U'];
    const modifier = ['\'', '2', ''];

    const moveList = [];
    for (let i = 0; i < 25; i++) {
        let m = '';
        m += moves[Math.floor(Math.random() * moves.length)];
        m += modifier[Math.floor(Math.random() * modifier.length)];

        moveList.push(m);
    }

    rotator.setAutoMoves(moveList);
}


// TO-DO LIST: (Order of Priority)
/* 
-/ means DONE

 -> Construct an abstract representation of a Cubit -/
 -> Array representation of a Rubik's Cube -/
 -> Represent cube rotations somehow -/
 -> Representation of faces?? (idk how to do that lmao)
    Remodel :
    -> map: Face Color -> Face Name
    -> map: Rotation Name -> {... Ordered list of faces ...}

    Utilize both to check for solved Rubik's Cube.

------------------------------------

 -> Encode a unqiue color value for each face
 -> Utilize encoded values in off-screen render target
 -> Use texture (generated from previous step) to determine which face the mouse clicked on
*/


function intersects(plane, cube) {
    let positive = 0;
    let negative = 0;

    const vertex = new THREE.Vector3();

    const position = cube.geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i);

        const world = cube.localToWorld(vertex);
        if (plane.distanceToPoint(world) >= 0) {
            positive++;
        } else {
            negative++;
        }
    }

    return positive > 0 && negative > 0;
}


function encodeValue(color, value) {
    let val = value % 64

    let rBits = (val & 0b110000) >>> 4
    let gBits = (val & 0b001100) >>> 2
    let bBits = val & 0b000011

    let colorVal = color.getHex()

    let r = (colorVal & 0xfc0000) | (rBits << 16)
    let g = (colorVal & 0x00fc00) | (gBits << 8)
    let b = (colorVal & 0x0000fc) | bBits

    let newColor = r | g | b

    return new THREE.Color(newColor)
}

function decodeValue(rIn, gIn, bIn) {
    let r = (rIn & 0xff0000) >>> 16
    let g = (gIn & 0x00ff00) >>> 8
    let b = bIn & 0x0000ff
    let decoded = (r % 4) * 16 + (g % 4) * 4 + (b % 4)

    return decoded
}