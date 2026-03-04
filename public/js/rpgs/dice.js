class DiceCalc {

  constructor() {}

  calc() {}
  calcAverage() {}

  static parse(calc) {
    calc = calc.replaceAll(' ', '');
    calc = calc.replaceAll('D', 'd');
    if (!DiceCalc.checkBraces(calc))
      return null;
    try {
      return DiceCalc.parseCalc(calc);
    } catch (e) {
      return null;
    }
  }

  static checkBraces(calc) {
    var indent = 0;
    for (var i = 0; i < calc.length; i++) {
      if (calc[i] == '(')
        indent++;
      else if (calc[i] == ')')
        indent--;
      else if (indent < 0)
        return false;
    }
    return true;
  }

  static parseCalc(calc) {
    calc = DiceCalc.removeEnclosingBrackets(calc);
    for (var i = 0; i < DICE_CALCULATIONS.length; i++) {
      var parts = DiceCalc.getParts(calc, DICE_CALCULATIONS[i].SIGN);
      if (parts.length > 0)
        return new DICE_CALCULATIONS[i](parts[0], parts[1]);
    }
    return new ConstDiceCalc(calc);
  }

  static removeEnclosingBrackets(calc) {
    if (!calc.startsWith('(') || !calc.endsWith(')'))
      return calc;

    calc = calc.substring(1, calc.length - 1);
    if (!DiceCalc.checkBraces(calc))
      return '(' + calc + ')';
    return DiceCalc.removeEnclosingBrackets(calc);
  }

  static getParts(calc, sign) {
    var indent = 0;
    for (var i = 0; i < calc.length; i++) {
      if (calc[i] == '(')
        indent++;
      else if (calc[i] == ')')
        indent--;
      else if (indent == 0 && calc[i] == sign)
        return [calc.substring(0, i), calc.substring(i + 1)];
    }
    return [];
  }

}

class AddDiceCalc extends DiceCalc {

  static SIGN = '+';

  constructor(a, b) {
    super();

    this.a = DiceCalc.parseCalc(a);
    this.b = DiceCalc.parseCalc(b);
  }

  calc() {
    return this.a.calc() + this.b.calc();
  }

  calcAverage() {
    return this.a.calcAverage() + this.b.calcAverage();
  }

}

class SubDiceCalc extends DiceCalc {

  static SIGN = '-';

  constructor(a, b) {
    super();

    this.a = DiceCalc.parseCalc(a);
    this.b = DiceCalc.parseCalc(b);
  }

  calc() {
    return this.a.calc() - this.b.calc();
  }

  calcAverage() {
    return this.a.calcAverage() - this.b.calcAverage();
  }

}

class MulDiceCalc extends DiceCalc {

  static SIGN = '*';

  constructor(a, b) {
    super();

    this.a = DiceCalc.parseCalc(a);
    this.b = DiceCalc.parseCalc(b);
  }

  calc() {
    return this.a.calc() * this.b.calc();
  }

  calcAverage() {
    return this.a.calcAverage() * this.b.calcAverage();
  }

}

class DivDiceCalc extends DiceCalc {

  static SIGN = '/';

  constructor(a, b) {
    super();

    this.a = DiceCalc.parseCalc(a);
    this.b = DiceCalc.parseCalc(b);
  }

  calc() {
    return this.a.calc() / this.b.calc();
  }

  calcAverage() {
    return this.a.calcAverage() / this.b.calcAverage();
  }

}

class PowDiceCalc extends DiceCalc {

  static SIGN = '^';

  constructor(a, b) {
    super();

    this.a = DiceCalc.parseCalc(a);
    this.b = DiceCalc.parseCalc(b);
  }

  calc() {
    return Math.pow(this.a.calc(), this.b.calc());
  }

  calcAverage() {
    return Math.pow(this.a.calcAverage(), this.b.calcAverage());
  }

}

class DieDiceCalc extends DiceCalc {

  static SIGN = 'd';

  constructor(a, b) {
    super();

    this.a = DiceCalc.parseCalc(a);
    this.b = DiceCalc.parseCalc(b);
  }

  calc() {
    var value = 0;
    var a = this.a.calc();
    var b = this.b.calc();
    for (var i = 0; i < a; i++) {
      value += Math.floor(Math.random(b) + 1);
    }
    return value;
  }

  calcAverage() {
    return this.a.calcAverage() * (this.b.calcAverage() + 1) / 2;
  }

}

class ConstDiceCalc extends DiceCalc {

  constructor(a) {
    super();

    this.a = Number.parseInt(a);
    if (isNaN(a))
      throw new Error('Number could not be converted.');
  }

  calc() {
    return this.a;
  }

  calcAverage() {
    return this.a;
  }

}

const DICE_CALCULATIONS = [
  AddDiceCalc,
  SubDiceCalc,
  MulDiceCalc,
  DivDiceCalc,
  PowDiceCalc,
  DieDiceCalc
];

class Roller3D {

  constructor() {
    this.initialized = false;
  }

  async init() {
    this.Ammo = await Ammo();
    this.collisionConfig = new this.Ammo.btDefaultCollisionConfiguration();
    this.dispatcher = new this.Ammo.btCollisionDispatcher(this.collisionConfig);
    this.broadphase = new this.Ammo.btDbvtBroadphase();
    this.solver = new this.Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new this.Ammo.btDiscreteDynamicsWorld(
      this.dispatcher, this.broadphase, this.solver, this.collisionConfig);
    this.physicsWorld.setGravity(new this.Ammo.btVector3(0, -11, 0));

    this.addGroundPlaneCollision();

    console.log('loaded ammo');

    this.GLTFLoader = await import('/js/libraries/GLTFLoader.js');
    this.GLTFLoader = this.GLTFLoader.GLTFLoader;

    this.THREE = await import('/js/libraries/three.webgpu.js');

    console.log('loaded three');

    this.loader = new this.GLTFLoader();
    this.dice = [];
    this.diceModels = [];
    this.diceCollisionModels = [];
    var d6 = await this.loader.loadAsync('/resources/models/dice/d6.glb');
    d6 = d6.scene.children[0];
    d6.castShadow = true;
    d6.receiveShadow = true;
    this.diceModels.push(d6);
    var d6Collision = await this.loader.loadAsync('/resources/models/dice/d6_collision.glb');
    d6Collision = d6Collision.scene.children[0];
    this.diceCollisionModels.push(d6Collision);

    console.log('loaded 3d models');

    this.scene = new this.THREE.Scene();
    this.camera = new this.THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.2, 5000);
    this.camera.position.set(0, 5, 0);
    this.camera.lookAt(new this.THREE.Vector3(0, 0, 0));

    this.renderer = new this.THREE.WebGPURenderer({ antialias: true, alpha: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = this.THREE.VSMShadowMap;
    this.renderer.setClearColor( 0x000000, 0 );
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.id = 'dice-roller';
    
    var ambientLight = new this.THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    this.directLight = new this.THREE.DirectionalLight(0xffffff, 1);
    this.directLight.position.set(-2, 10, -2);
    this.directLight.lookAt(new this.THREE.Vector3(0, 0, 0));
    this.directLight.castShadow = true;
    this.directLight.shadow.mapSize = new this.THREE.Vector2(1024 * 2, 1024 * 2);
    this.directLight.shadow.camera.top = 200;
    this.directLight.shadow.camera.bottom = -200;
    this.directLight.shadow.camera.left = -200;
    this.directLight.shadow.camera.right = 200;
    this.directLight.shadow.camera.near = 0.1;
    this.directLight.shadow.camera.far = 100;
    this.directLight.shadow.bias = -0.0005;
    this.directLight.shadow.radius = 7.5;
    this.directLight.shadow.blurSamples = 25;
    this.directLight.shadow.camera.updateProjectionMatrix();
    this.scene.add(this.directLight);

    this.walls = [];
    var wall = new this.THREE.PlaneGeometry(2, 20);
    var mat = new this.THREE.MeshBasicMaterial({ color: 0xff0000 });
    wall = new this.THREE.Mesh(wall, mat);

    var north = wall.clone();
    north.position.set(0, 0, -1);
    north.lookAt(new this.THREE.Vector3(0, 0, 0));
    this.scene.add(north);
    this.walls.push(north);

    var east = wall.clone();
    east.position.set(1, 0, 0);
    east.lookAt(new this.THREE.Vector3(0, 0, 0));
    this.scene.add(east);
    this.walls.push(east);

    var south = wall.clone();
    south.position.set(0, 0, 1);
    south.lookAt(new this.THREE.Vector3(0, 0, 0));
    this.scene.add(south);
    this.walls.push(south);

    var west = wall.clone();
    west.position.set(-1, 0, 0);
    west.lookAt(new this.THREE.Vector3(0, 0, 0));
    this.scene.add(west);
    this.walls.push(west);

    var groundGeometry = new this.THREE.PlaneGeometry(2, 2);
    this.ground = new this.THREE.Mesh(groundGeometry);
    this.ground.position.set(0, 0, 0);
    this.ground.lookAt(new this.THREE.Vector3(0, 1, 0));
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
    
    this.timer = new this.THREE.Timer();

    await this.renderer.init();

    this.renderer.render(this.scene, this.camera);

    this.ground.material = new this.THREE.ShadowMaterial({ opacity: 0.35 });
    this.ground.material.needsUpdate = true;
    // this.ground.material = new this.THREE.MeshBasicMaterial({ color: 0x00ff00 });

    console.log('renderer initialized');

    this.render();

    this.initialized = true;

    this.addD6();
  }

  generateTransform(pos) {
    var transform = new this.Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new this.Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new this.Ammo.btQuaternion(1, 0, 0, 0));
    return transform;
  }

  generateKineticCube(pos, size) {
    var transform = this.generateTransform(pos);
    var motionState = new this.Ammo.btDefaultMotionState(transform);
    this.Ammo.destroy(transform);

    var size = new this.Ammo.btVector3(size.x, size.y, size.z)
    var shape = new this.Ammo.btBoxShape(size);
    shape.setMargin(0.05);
    this.Ammo.destroy(size);

    var info = new this.Ammo.btRigidBodyConstructionInfo(0, motionState, shape, new this.Ammo.btVector3(0, 0, 0));
    // this.Ammo.destroy(shape);
    
    var body = {'body': new this.Ammo.btRigidBody(info), 'state': motionState};
    this.Ammo.destroy(info);
    this.physicsWorld.addRigidBody(body.body);
    return body;
  }

  addGroundPlaneCollision() {
    this.groundBody = this.generateKineticCube({x: 0, y: -1, z: 0}, {x: 1000, y: 1, z: 1000});
    this.physicsWalls = [
      this.generateKineticCube({x: 0, y: 0, z: 0}, {x: 1000, y: 1000, z: 2}),
      this.generateKineticCube({x: 0, y: 0, z: 0}, {x: 2, y: 1000, z: 1000}),
      this.generateKineticCube({x: 0, y: 0, z: 0}, {x: 1000, y: 1000, z: 2}),
      this.generateKineticCube({x: 0, y: 0, z: 0}, {x: 2, y: 1000, z: 1000})];
  }

  generateRandomQuaternion() {
    var u = Math.random();
    var v = Math.random();
    var w = Math.random();

    var x = Math.sqrt(1 - u) * Math.sin(2 * Math.PI * v);
    var y = Math.sqrt(1 - u) * Math.cos(2 * Math.PI * v);
    var z = Math.sqrt(u)     * Math.sin(2 * Math.PI * w);
    var w = Math.sqrt(u)     * Math.cos(2 * Math.PI * w);

    return new this.Ammo.btQuaternion(x, y, z, w);
  }

  addD6() {
    if (!this.initialized)
      return;

    var mesh = this.diceModels[0].clone();
    this.scene.add(mesh);

    var mass = 1;
    var inertia = new this.Ammo.btVector3(0, 0, 0);
    var shape = this.createConvexHullShape(this.diceCollisionModels[0].clone());
    shape.setMargin(0.05);
    shape.calculateLocalInertia(mass, inertia);
    var transform = new this.Ammo.btTransform();
    transform.setIdentity();
    var pos = new this.Ammo.btVector3(
      (Math.random() * 2 - 1) * this.scaleX, 3, (Math.random() * 2 - 1) * this.scaleZ);
    transform.setOrigin(pos);
    this.Ammo.destroy(pos);
    var quat = this.generateRandomQuaternion();
    transform.setRotation(quat);
    this.Ammo.destroy(quat);
    var motionState = new this.Ammo.btDefaultMotionState(transform);
    this.Ammo.destroy(transform);
    var info = new this.Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, inertia);
    this.Ammo.destroy(inertia);
    var body = new this.Ammo.btRigidBody(info);
    this.Ammo.destroy(info);
    this.physicsWorld.addRigidBody(body);

    this.setRandomVelocity(body);
    body.setFriction(5);

    this.dice.push({ 'mesh': mesh, 'body': body, 'state': motionState});
  }

  randomInUnitSphere() {
    // random direction
    var u = Math.random();
    var v = Math.random();
    var theta = 2 * Math.PI * u;
    var z = 2 * v - 1;
    var r_xy = Math.sqrt(1 - z * z);

    var x = r_xy * Math.cos(theta);
    var y = r_xy * Math.sin(theta);

    // random radius (cube root!)
    var radius = Math.cbrt(Math.random());

    return { x: x * radius, y: y * radius, z: z * radius };
  }

  randomInUnitDisk() {
    var a = 2 * Math.PI * Math.random();
    var r = Math.sqrt(Math.random());
    return { x: r * Math.cos(a), y: 0, z: r * Math.sin(a) };
  }

  setRandomVelocity(body) {
    var minVL = 20;
    var maxVL = 30;
    var vl = this.randomInUnitDisk();
    vl.x = vl.x * (maxVL - minVL) + minVL;
    vl.y = -2;
    vl.z = vl.z * (maxVL - minVL) + minVL;
    vl = new this.Ammo.btVector3(vl.x, vl.y, vl.z);
    body.setLinearVelocity(vl);
    this.Ammo.destroy(vl);

    var minVA = 10;
    var maxVA = 10;
    var va = this.randomInUnitSphere();
    va.x = va.x * (maxVA - minVA) + minVA;
    va.y = va.y * (maxVA - minVA) + minVA;
    va.z = va.z * (maxVA - minVA) + minVA;
    va = new this.Ammo.btVector3(va.x, va.y, va.z);
    body.setAngularVelocity(va);
    this.Ammo.destroy(va);
  }

  createConvexHullShape(mesh) {
    var geometry = mesh.geometry;
    var posAttr = geometry.attributes.position;

    var shape = new this.Ammo.btConvexHullShape();

    var v = new this.Ammo.btVector3();

    for (var i = 0; i < posAttr.count; i++) {
      v.setValue(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
      shape.addPoint(v, false);
    }

    shape.recalcLocalAabb();
    this.Ammo.destroy(v);

    return shape;
  }

  reset() {
    if (!this.initialized)
      return;

    this.dice.forEach((die) => {
      this.scene.remove(die.mesh);
      this.physicsWorld.removeRigidBody(die.body);
      this.Ammo.destroy(die.body);
    });
    this.dice = [];
  }

  render() {
    this.timer.update();

    // set  camera
    var camHeight = window.innerHeight / 1000 * 45 + 1;
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.position.set(0, camHeight, 0);
    this.camera.updateProjectionMatrix();

    // scale ground plane to size of scene
    this.scaleZ = Math.tan(30 / 2 / 180 * Math.PI) * camHeight;
    this.scaleX = this.scaleZ / window.innerHeight * window.innerWidth;
    this.ground.scale.set(this.scaleX, this.scaleZ, 1);
    this.directLight.shadow.camera.top = this.scaleZ * 3;
    this.directLight.shadow.camera.bottom = -this.scaleZ * 3;
    this.directLight.shadow.camera.right = this.scaleX * 3;
    this.directLight.shadow.camera.left = -this.scaleX * 3;
    this.directLight.shadow.camera.updateProjectionMatrix();

    // set walls around scene
    this.walls[0].position.set(0, 10, -this.scaleZ);
    this.walls[0].scale.set(this.scaleX, 1, 1);
    this.walls[1].position.set(this.scaleX, 10, 0);
    this.walls[1].scale.set(this.scaleZ, 1, 1);
    this.walls[2].position.set(0, 10, this.scaleZ);
    this.walls[2].scale.set(this.scaleX, 1, 1);
    this.walls[3].position.set(-this.scaleX, 10, 0);
    this.walls[3].scale.set(this.scaleZ, 1, 1);
    
    var northTransform = this.generateTransform({x: 0, y: 0, z: -this.scaleZ - 1});
    this.physicsWalls[0].body.setWorldTransform(northTransform);
    this.Ammo.destroy(northTransform);
    var eastTransform = this.generateTransform({x: this.scaleX + 1, y: 0, z: 0});
    this.physicsWalls[1].body.setWorldTransform(eastTransform);
    this.Ammo.destroy(eastTransform);
    var southTransform = this.generateTransform({x: 0, y: 0, z: this.scaleZ + 1});
    this.physicsWalls[2].body.setWorldTransform(southTransform);
    this.Ammo.destroy(southTransform);
    var westTransform = this.generateTransform({x: -this.scaleX - 1, y: 0, z: 0});
    this.physicsWalls[3].body.setWorldTransform(westTransform);
    this.Ammo.destroy(westTransform);

    // update physics engine
    this.physicsWorld.stepSimulation(this.timer.getDelta());
    var transform = new this.Ammo.btTransform();
    this.dice.forEach((die) => {
      die.state.getWorldTransform(transform);
      var pos = transform.getOrigin();
      var quat = transform.getRotation();
      pos = new this.THREE.Vector3(pos.x(), pos.y(), pos.z());
      quat = new this.THREE.Quaternion(quat.x(), quat.y(), quat.z(), quat.w());
      die.mesh.position.copy(pos);
      die.mesh.quaternion.copy(quat);
    });
    this.Ammo.destroy(transform);

    // update renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

}

window.addEventListener('load', () => {
  // var roller = new Roller3D();
  // roller.init();
});