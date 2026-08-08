/* ==========================================================================
   figure.js — the articulated hero
   --------------------------------------------------------------------------
   A poseable action figure built entirely from primitives. No model file, no
   loader, no texture: capsules for limbs, spheres for the ball joints, and a
   procedurally generated environment map that gives the plastic its sheen.

   The rig is a nested Group hierarchy, which is the whole point. Rotating
   `J.shoulderL` carries the forearm and hand with it, so a "pose" is just a
   table of Euler angles and the figure genuinely articulates rather than
   playing back a baked animation.

   Everything is damped toward a target rather than tweened on a timeline, so
   pose changes, pointer tracking and scroll can all push on the same joints at
   once without fighting each other.
   ========================================================================== */

import * as THREE from './vendor/three.module.min.js';

const DEG = Math.PI / 180;

/* --- Palette. Matches the CSS custom properties exactly. ------------------- */
const C = {
  violet:   0x5d2de6,
  lavender: 0x9e81f0,
  paper:    0xf5f5f5,
  blush:    0xf7cece,
  ink:      0x0e0e0e,
};

/* --------------------------------------------------------------------------
   Environment map
   --------------------------------------------------------------------------
   Two bright horizontal bands on a dark gradient, drawn into a canvas and read
   as an equirectangular panorama. That is enough to read as a photographic
   studio: the bands become the long specular streaks down the arms and the
   dark floor keeps the underside from washing out. Cheaper than shipping an
   HDR and it never 404s.
   ----------------------------------------------------------------------- */
function studioEnvironment(renderer) {
  const w = 512;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0.00, '#ffffff');
  sky.addColorStop(0.32, '#8e8ea8');
  sky.addColorStop(0.55, '#26262e');
  sky.addColorStop(0.80, '#160d2b');
  sky.addColorStop(1.00, '#050508');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Key softbox, camera-left and high.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(w * 0.06, h * 0.10, w * 0.26, h * 0.20);
  // Cool rim source behind the figure.
  ctx.fillStyle = '#7241ff';
  ctx.fillRect(w * 0.58, h * 0.16, w * 0.30, h * 0.16);
  // Low bounce off the turntable.
  ctx.fillStyle = '#3a2a66';
  ctx.fillRect(0, h * 0.72, w, h * 0.06);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(texture).texture;

  pmrem.dispose();
  texture.dispose();
  return env;
}

/* --- Materials ------------------------------------------------------------ */

function makeMaterials() {
  const plastic = (color, extra = {}) =>
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.34,
      metalness: 0,
      clearcoat: 0.85,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.1,
      ...extra,
    });

  return {
    shell:  plastic(C.violet),
    joint:  plastic(C.lavender, { roughness: 0.42, clearcoat: 0.5 }),
    trim:   plastic(C.paper, { roughness: 0.28 }),
    skin:   plastic(C.blush, { roughness: 0.45, clearcoat: 0.4 }),
    // The visor is the only near-mirror on the figure, which is what makes the
    // head read as the focal point.
    visor:  plastic(0x0a0a0a, { roughness: 0.04, metalness: 0.35, clearcoat: 1, envMapIntensity: 1.6 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.62, metalness: 0 }),
    deck:   new THREE.MeshStandardMaterial({ color: 0x131316, roughness: 0.85, metalness: 0.1 }),
    // Unlit, so the turntable edge reads as an emitting line rather than a lit
    // object. Kept below full violet or it blows out under the headline.
    rim:    new THREE.MeshBasicMaterial({ color: 0x4a24b8 }),
  };
}

/* --------------------------------------------------------------------------
   Rig construction
   ----------------------------------------------------------------------- */

/**
 * A limb segment that hangs from its pivot.
 *
 * CapsuleGeometry is centred on its own origin, so the mesh is pushed down by
 * half its total length. That puts the rotation point at the top of the
 * segment — a shoulder, not a mid-arm — which is what a ball joint does.
 */
function segment(parent, geoCache, { radius, length, material }) {
  const pivot = new THREE.Group();
  parent.add(pivot);

  const key = `cap:${radius}:${length}`;
  if (!geoCache[key]) geoCache[key] = new THREE.CapsuleGeometry(radius, length, 6, 18);

  const mesh = new THREE.Mesh(geoCache[key], material);
  mesh.position.y = -(length / 2 + radius);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  pivot.add(mesh);

  // Where the next joint in the chain belongs.
  pivot.userData.end = -(length + radius * 2);
  return pivot;
}

function ball(parent, geoCache, radius, material) {
  const key = `ball:${radius}`;
  if (!geoCache[key]) geoCache[key] = new THREE.SphereGeometry(radius, 20, 14);
  const mesh = new THREE.Mesh(geoCache[key], material);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function buildFigure(M) {
  const geoCache = {};
  const parts = []; // every mesh, for the assemble-in animation

  const figure = new THREE.Group();

  /* Pelvis — the root of both chains. */
  const pelvis = new THREE.Group();
  figure.add(pelvis);

  const hipBlock = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.2, 0.22), M.shell);
  hipBlock.position.y = -0.02;
  hipBlock.castShadow = true;
  hipBlock.receiveShadow = true;
  pelvis.add(hipBlock);

  const beltTrim = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.045, 0.235), M.trim);
  beltTrim.position.y = 0.04;
  pelvis.add(beltTrim);

  /* Waist — one joint, and the reason the figure can twist. */
  const waist = new THREE.Group();
  waist.position.y = 0.11;
  pelvis.add(waist);
  ball(waist, geoCache, 0.095, M.joint);

  // Wide at the shoulders, narrow at the waist. The taper is doing most of the
  // work of making a stack of primitives read as a body.
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.155, 0.46, 20, 1), M.shell);
  torso.position.y = 0.27;
  torso.scale.z = 0.72;
  torso.castShadow = true;
  torso.receiveShadow = true;
  waist.add(torso);

  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.19, 0.06), M.trim);
  chestPlate.position.set(0, 0.34, 0.155);
  chestPlate.castShadow = true;
  waist.add(chestPlate);

  const chestLamp = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 18), M.rim);
  chestLamp.rotation.x = 90 * DEG;
  chestLamp.position.set(0, 0.34, 0.19);
  waist.add(chestLamp);

  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.28, 0.1), M.rubber);
  pack.position.set(0, 0.3, -0.17);
  pack.castShadow = true;
  waist.add(pack);

  /* Head. The neck is a visible column rather than an implied joint — without
     the gap the head sinks into the shoulders and the figure loses its
     silhouette at small sizes. */
  const neck = new THREE.Group();
  neck.position.y = 0.5;
  waist.add(neck);
  ball(neck, geoCache, 0.068, M.joint);

  const neckColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.062, 0.1, 14), M.rubber);
  neckColumn.position.y = 0.05;
  neckColumn.castShadow = true;
  neck.add(neckColumn);

  const head = new THREE.Group();
  head.position.y = 0.28;
  neck.add(head);

  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.19, 26, 20), M.skin);
  skull.scale.set(0.95, 1, 0.92);
  skull.castShadow = true;
  head.add(skull);

  const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.198, 26, 20, 0, Math.PI * 2, 0, Math.PI * 0.5),
    M.shell,
  );
  helmet.scale.set(0.98, 1.05, 0.96);
  helmet.position.y = 0.012;
  helmet.castShadow = true;
  head.add(helmet);

  // A narrow wrap-around band, not a face plate: enough to read as a visor at
  // hero size without turning the head into a screen.
  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(0.188, 26, 12, -0.72, 1.44, 0.82, 0.36),
    M.visor,
  );
  visor.rotation.y = Math.PI / 2;
  visor.scale.setScalar(1.03);
  head.add(visor);

  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.05, 0.05), M.trim);
  jaw.position.set(0, -0.115, 0.155);
  head.add(jaw);

  const crest = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.055, 0.24), M.trim);
  crest.position.y = 0.185;
  crest.castShadow = true;
  head.add(crest);

  /* Arms. Mirrored, so one builder runs twice. */
  const arm = (side) => {
    const s = side === 'L' ? 1 : -1;

    const shoulder = new THREE.Group();
    shoulder.position.set(s * 0.3, 0.44, 0);
    waist.add(shoulder);
    ball(shoulder, geoCache, 0.098, M.joint);

    const upper = segment(shoulder, geoCache, { radius: 0.078, length: 0.24, material: M.shell });

    const elbow = new THREE.Group();
    elbow.position.y = upper.userData.end;
    upper.add(elbow);
    ball(elbow, geoCache, 0.082, M.joint);

    const fore = segment(elbow, geoCache, { radius: 0.066, length: 0.22, material: M.trim });

    const wrist = new THREE.Group();
    wrist.position.y = fore.userData.end;
    fore.add(wrist);
    ball(wrist, geoCache, 0.058, M.joint);

    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.13, 0.11), M.skin);
    hand.position.y = -0.085;
    hand.castShadow = true;
    wrist.add(hand);

    return { shoulder, elbow, wrist };
  };

  const armL = arm('L');
  const armR = arm('R');

  /* Legs. */
  const leg = (side) => {
    const s = side === 'L' ? 1 : -1;

    const hip = new THREE.Group();
    hip.position.set(s * 0.115, -0.08, 0);
    pelvis.add(hip);
    ball(hip, geoCache, 0.098, M.joint);

    const thigh = segment(hip, geoCache, { radius: 0.09, length: 0.31, material: M.shell });

    const knee = new THREE.Group();
    knee.position.y = thigh.userData.end;
    thigh.add(knee);
    ball(knee, geoCache, 0.092, M.joint);

    const shin = segment(knee, geoCache, { radius: 0.077, length: 0.29, material: M.trim });

    const ankle = new THREE.Group();
    ankle.position.y = shin.userData.end;
    shin.add(ankle);
    ball(ankle, geoCache, 0.062, M.joint);

    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.075, 0.26), M.rubber);
    foot.position.set(0, -0.055, 0.045);
    foot.castShadow = true;
    foot.receiveShadow = true;
    ankle.add(foot);

    return { hip, knee, ankle };
  };

  const legL = leg('L');
  const legR = leg('R');

  figure.traverse((o) => { if (o.isMesh) parts.push(o); });

  const joints = {
    waist, neck, head,
    shoulderL: armL.shoulder, elbowL: armL.elbow, wristL: armL.wrist,
    shoulderR: armR.shoulder, elbowR: armR.elbow, wristR: armR.wrist,
    hipL: legL.hip, kneeL: legL.knee, ankleL: legL.ankle,
    hipR: legR.hip, kneeR: legR.knee, ankleR: legR.ankle,
  };

  return { figure, joints, parts, geoCache };
}

/* --------------------------------------------------------------------------
   Poses
   --------------------------------------------------------------------------
   Degrees, [x, y, z] per joint. Anything omitted returns to zero, so a pose is
   a complete statement rather than a diff — which keeps them from bleeding
   into each other when you cycle quickly.
   ----------------------------------------------------------------------- */

const POSES = [
  {
    name: 'AT REST',
    joints: {
      shoulderL: [6, 0, 19], elbowL: [-26, 0, 9],
      shoulderR: [6, 0, -19], elbowR: [-26, 0, -9],
      hipL: [-2, 0, 4], kneeL: [6, 0, 0],
      hipR: [-2, 0, -4], kneeR: [6, 0, 0],
      waist: [1, 0, 0],
    },
  },
  {
    name: 'ARTICULATED',
    joints: {
      shoulderL: [0, 0, 92], elbowL: [0, 0, 0],
      shoulderR: [0, 0, -92], elbowR: [0, 0, 0],
      hipL: [0, 0, 6], hipR: [0, 0, -6],
      waist: [0, 0, 0],
    },
  },
  {
    name: 'LAUNCH',
    joints: {
      shoulderL: [-8, 0, 158], elbowL: [-28, 0, 12],
      shoulderR: [26, 0, -26], elbowR: [-62, 0, -14],
      waist: [-6, 18, 0], neck: [-8, -10, 0],
      hipL: [-16, 0, 12], kneeL: [26, 0, 0], ankleL: [-8, 0, 0],
      hipR: [14, 0, -14], kneeR: [10, 0, 0],
    },
  },
  {
    name: 'ON GUARD',
    joints: {
      shoulderL: [-64, 0, 28], elbowL: [-72, 0, 22],
      shoulderR: [-38, 0, -22], elbowR: [-88, 0, -18],
      waist: [4, -22, 0], neck: [0, 16, 0],
      hipL: [22, 0, 16], kneeL: [-34, 0, 0], ankleL: [12, 0, 0],
      hipR: [-24, 0, -14], kneeR: [30, 0, 0], ankleR: [-8, 0, 0],
    },
  },
];

/* --------------------------------------------------------------------------
   Public entry point
   ----------------------------------------------------------------------- */

export function createFigure(canvas, options = {}) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;

  // Two is the point of diminishing returns for a single object at this size;
  // beyond it a 3x phone screen pays a 9x fill cost for no visible gain.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  // PCFSoftShadowMap is deprecated as of r183; PCF plus a radius gives the same
  // softened edge on one figure without the extra taps.
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.ink);
  scene.environment = studioEnvironment(renderer);

  // Dropping the camera below the figure's centre does two things at once: it
  // lifts the figure into the upper part of the frame, clear of the headline,
  // and it gives the slightly-from-below angle that makes a toy look heroic.
  const FRAME_LIFT = -0.42;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
  camera.position.set(0, 0.18 + FRAME_LIFT, 6.2);

  /* --- Lights. The env map carries the reflections; these carry the form. -- */
  const key = new THREE.DirectionalLight(0xffffff, 2.7);
  key.position.set(3.2, 5.2, 3.4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 14;
  key.shadow.camera.left = -2.2;
  key.shadow.camera.right = 2.2;
  key.shadow.camera.top = 2.4;
  key.shadow.camera.bottom = -2.2;
  key.shadow.bias = -0.0012;
  key.shadow.radius = 3;
  scene.add(key);

  const fill = new THREE.DirectionalLight(C.lavender, 0.9);
  fill.position.set(-4.5, 1.6, 2.4);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0x7241ff, 2.6);
  rim.position.set(-1.2, 2.4, -4.5);
  scene.add(rim);

  scene.add(new THREE.AmbientLight(0x1c1c26, 1.4));

  /* --- Turntable ---------------------------------------------------------- */
  const M = makeMaterials();
  // Where the soles land: pelvis (0) − hip drop − thigh − shin − ankle − foot,
  // plus the figure's own 0.05 lift. Deriving it rather than eyeballing it is
  // what keeps the figure standing on the deck instead of hovering over it.
  const FLOOR = -1.06;

  const table = new THREE.Group();
  table.position.y = FLOOR;
  scene.add(table);

  const deck = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.15, 0.07, 64), M.deck);
  deck.position.y = -0.035;
  deck.receiveShadow = true;
  table.add(deck);

  const deckRim = new THREE.Mesh(new THREE.TorusGeometry(1.11, 0.007, 8, 96), M.rim);
  deckRim.rotation.x = 90 * DEG;
  deckRim.position.y = 0.002;
  table.add(deckRim);

  const grid = new THREE.GridHelper(9, 30, 0x2a2a35, 0x1c1c24);
  grid.position.y = -0.045;
  grid.material.transparent = true;
  grid.material.opacity = 0.5;
  table.add(grid);

  /* --- Figure ------------------------------------------------------------- */
  const root = new THREE.Group(); // turntable spin + pointer yaw
  scene.add(root);

  const { figure, joints, parts, geoCache } = buildFigure(M);
  figure.position.y = 0.05;
  root.add(figure);

  /* --- Pose state --------------------------------------------------------- */
  // Each joint carries a target it is damped toward. Pointer and scroll add
  // their own offsets on top so they never overwrite the pose.
  const targets = {};
  for (const name of Object.keys(joints)) targets[name] = new THREE.Euler(0, 0, 0);

  let poseIndex = 0;

  function applyPose(index) {
    poseIndex = ((index % POSES.length) + POSES.length) % POSES.length;
    const pose = POSES[poseIndex];
    for (const name of Object.keys(joints)) {
      const a = pose.joints[name] || [0, 0, 0];
      targets[name].set(a[0] * DEG, a[1] * DEG, a[2] * DEG);
    }
    return pose.name;
  }

  applyPose(0);
  // Start folded into the pose rather than snapping to it on the first frame.
  for (const name of Object.keys(joints)) joints[name].rotation.copy(targets[name]);

  /* --- Assemble-in -------------------------------------------------------- */
  // Every part starts at zero scale and pops in bottom-up, so the figure looks
  // like it is being built on the turntable rather than fading in.
  const order = parts
    .map((mesh) => {
      const world = new THREE.Vector3();
      mesh.getWorldPosition(world);
      return { mesh, y: world.y };
    })
    .sort((a, b) => a.y - b.y);

  order.forEach((entry, i) => {
    entry.delay = 0.06 + i * 0.028;
    entry.base = entry.mesh.scale.clone();
    if (!reduced) entry.mesh.scale.setScalar(0.0001);
  });

  let assembling = false;
  let assembleTime = 0;

  /* --- Input state -------------------------------------------------------- */
  const pointer = { x: 0, y: 0 };
  const smoothed = { x: 0, y: 0 };
  let scroll = 0;      // 0 at the top of the hero, 1 once it has scrolled away
  let spin = 0;        // accumulated turntable rotation
  let running = false;
  let ready = false;

  /* --- Sizing ------------------------------------------------------------- */
  function resize() {
    const host = canvas.parentElement || canvas;
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;

    // Portrait and narrow viewports need the camera further back or the figure
    // grows past the frame; this keeps roughly the same headroom everywhere.
    const wide = Math.min(1, w / 900);
    camera.position.z = 6.2 + (1 - wide) * 2.4;
    camera.fov = 32 + (1 - wide) * 4;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0.02 + FRAME_LIFT, 0);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement || canvas);
  resize();

  /* --- Loop --------------------------------------------------------------- */
  const timer = new THREE.Timer();
  let elapsed = 0; // accumulated from clamped deltas, so a backgrounded tab
                   // resumes where it left off instead of jumping

  const damp = (current, target, lambda, dt) =>
    current + (target - current) * (1 - Math.exp(-lambda * dt));

  function frame(dt, t) {
    if (assembling) {
      assembleTime += dt;
      let done = true;
      for (const entry of order) {
        const p = Math.min(1, Math.max(0, (assembleTime - entry.delay) / 0.42));
        if (p < 1) done = false;
        // Overshoot slightly at the end — the snap a plastic part makes when
        // it seats into its socket.
        const e = p < 1 ? 1 - Math.pow(1 - p, 3) : 1;
        const pop = 1 + Math.sin(p * Math.PI) * 0.16;
        entry.mesh.scale.set(
          entry.base.x * e * pop,
          entry.base.y * e * pop,
          entry.base.z * e * pop,
        );
      }
      if (done) assembling = false;
    }

    // Pointer, damped. `smoothed` lags the raw pointer so the head glides.
    smoothed.x = damp(smoothed.x, pointer.x, 3.5, dt);
    smoothed.y = damp(smoothed.y, pointer.y, 3.5, dt);

    // Joints ease toward the pose, then pointer and breath are layered on.
    const breath = Math.sin(t * 1.15) * 0.5 + 0.5;
    for (const name of Object.keys(joints)) {
      const j = joints[name];
      const tgt = targets[name];
      j.rotation.x = damp(j.rotation.x, tgt.x, 5, dt);
      j.rotation.y = damp(j.rotation.y, tgt.y, 5, dt);
      j.rotation.z = damp(j.rotation.z, tgt.z, 5, dt);
    }

    joints.neck.rotation.y += smoothed.x * 0.42;
    joints.neck.rotation.x += -smoothed.y * 0.26;
    joints.waist.rotation.y += smoothed.x * 0.14;
    joints.waist.rotation.x += 0.012 + breath * 0.014;

    joints.shoulderL.rotation.x += Math.sin(t * 0.9) * 0.03;
    joints.shoulderR.rotation.x += Math.sin(t * 0.9 + 1.2) * 0.03;

    // Turntable: a slow constant spin, nudged by the pointer, plus a half turn
    // spread across the hero's exit so the figure keeps moving as you scroll.
    spin += dt * 0.16;
    root.rotation.y = spin + smoothed.x * 0.5 + scroll * 1.6;
    table.rotation.y = spin * 0.5;

    figure.position.y = 0.05 + Math.sin(t * 1.15) * 0.012 - scroll * 0.25;
    root.position.y = 0;

    camera.position.y = 0.18 + FRAME_LIFT + smoothed.y * 0.16 + scroll * 0.35;
    camera.lookAt(0, 0.02 + FRAME_LIFT - scroll * 0.15, 0);

    renderer.render(scene, camera);
  }

  function loop() {
    if (!running) return;
    requestAnimationFrame(loop);
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05);
    elapsed += dt;
    frame(dt, elapsed);
  }

  /* --- Visibility. Nothing renders while the hero is off screen. ---------- */
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!running && ready && !reduced) {
          running = true;
          timer.update(); // discard the gap so the first frame is not a jump
          loop();
        }
      } else {
        running = false;
      }
    },
    { threshold: 0 },
  );
  io.observe(canvas.parentElement || canvas);

  /* --- Pointer ------------------------------------------------------------ */
  const onPointerMove = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  /* --- Warm-up ------------------------------------------------------------
     Compiling the shaders takes a beat on first render. Doing it here, behind
     the boot overlay, means the wipe never reveals a blank canvas. */
  renderer.compile(scene, camera);
  renderer.render(scene, camera);

  return {
    start() {
      ready = true;
      if (reduced) {
        // One settled frame, no loop. Snap the assemble straight to finished.
        for (const entry of order) entry.mesh.scale.copy(entry.base);
        for (const name of Object.keys(joints)) joints[name].rotation.copy(targets[name]);
        renderer.render(scene, camera);
        return;
      }
      assembling = true;
      assembleTime = 0;
      running = true;
      timer.update();
      loop();
    },

    nextPose() {
      const name = applyPose(poseIndex + 1);
      if (reduced) {
        for (const n of Object.keys(joints)) joints[n].rotation.copy(targets[n]);
        renderer.render(scene, camera);
      }
      return name;
    },

    /** 0 while the hero fills the viewport, 1 once it has scrolled past. */
    setScroll(p) {
      scroll = Math.min(1, Math.max(0, p));
    },

    dispose() {
      running = false;
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      scene.traverse((o) => {
        if (o.isMesh) o.geometry?.dispose();
      });
      Object.values(geoCache).forEach((g) => g.dispose());
      Object.values(M).forEach((m) => m.dispose());
      scene.environment?.dispose();
      renderer.dispose();
    },
  };
}
