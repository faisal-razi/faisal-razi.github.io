import * as THREE from 'three';

// A slowly rotating constellation of learners (points) wired to course hubs (lines).
// Scroll progress morphs it into a graduation cap, then it dissolves into the grid.
export function network3d(canvas, { gsap, ScrollTrigger }) {
  const N = 560, HUBS = 14;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const rnd = (a, b) => a + Math.random() * (b - a);
  // --- shape A: scattered network (sphere shell + noise)
  const A = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const u = Math.random(), v = Math.random();
    const th = u * Math.PI * 2, ph = Math.acos(2 * v - 1);
    const r = i < HUBS ? rnd(1.2, 2.4) : rnd(2.4, 3.8);
    A.set([r * Math.sin(ph) * Math.cos(th) * 1.25, r * Math.cos(ph) * 0.8, r * Math.sin(ph) * Math.sin(th)], i * 3);
  }
  // --- shape B: graduation cap (rhombus board + skull cap + tassel)
  const B = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    let p;
    const t = i / N;
    if (t < 0.55) { // board: square rotated 45°, slight thickness
      const a = rnd(-1, 1), b = rnd(-1, 1);
      const edge = Math.random() < 0.45;
      const s = 2.7;
      const [ea, eb] = edge ? (Math.random() < 0.5 ? [Math.sign(a), b] : [a, Math.sign(b)]) : [a, b];
      p = [(ea - eb) * s * 0.7, 0.9 + rnd(-0.05, 0.05), (ea + eb) * s * 0.42];
    } else if (t < 0.9) { // cap: truncated cylinder under the board
      const th = rnd(0, Math.PI * 2), y = rnd(-0.6, 0.85);
      const r = 1.45 + (0.85 - y) * 0.05;
      p = [Math.cos(th) * r, y, Math.sin(th) * r * 0.6];
    } else { // tassel: from centre to the front corner and down
      const k = (t - 0.9) / 0.1;
      p = k < 0.5 ? [k * 2 * 1.9, 0.95, k * 2 * 0.2] : [1.9 + rnd(-0.06, 0.06), 0.95 - (k - 0.5) * 2 * 1.9, 0.2 + rnd(-0.06, 0.06)];
    }
    B.set(p, i * 3);
  }
  // --- shape C: flat grid (dissolve into the blueprint)
  const C = new Float32Array(N * 3);
  const cols = 28;
  for (let i = 0; i < N; i++) C.set([((i % cols) / (cols - 1) - 0.5) * 12, -3.2, (Math.floor(i / cols) / (N / cols) - 0.5) * 8], i * 3);

  const pos = new Float32Array(A);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const sizes = new Float32Array(N).map((_, i) => (i < HUBS ? 7 : rnd(2, 4)));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const colorA = new THREE.Color('#FF8F66'), colorB = new THREE.Color('#D9A441');
  const pmat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: colorA.clone() }, uHub: { value: colorB }, uPR: { value: renderer.getPixelRatio() }, uAlpha: { value: 1 } },
    vertexShader: `attribute float size; varying float vHub; uniform float uPR;
      void main(){ vHub = size > 6.0 ? 1.0 : 0.0; vec4 mv = modelViewMatrix * vec4(position,1.0);
      gl_PointSize = size * uPR * (7.0 / -mv.z); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform vec3 uHub; uniform float uAlpha; varying float vHub;
      void main(){ float d = length(gl_PointCoord - 0.5); if(d>0.5) discard;
      float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(mix(uColor, uHub, vHub), a * uAlpha); }`,
  });
  const points = new THREE.Points(geo, pmat);

  // edges: each learner → nearest hub, plus a few learner↔learner links
  const pairs = [];
  for (let i = HUBS; i < N; i++) {
    let best = 0, bd = 1e9;
    for (let h = 0; h < HUBS; h++) {
      const dx = A[i * 3] - A[h * 3], dy = A[i * 3 + 1] - A[h * 3 + 1], dz = A[i * 3 + 2] - A[h * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bd) { bd = d; best = h; }
    }
    if (Math.random() < 0.55) pairs.push(i, best);
    if (Math.random() < 0.18) pairs.push(i, HUBS + Math.floor(Math.random() * (N - HUBS)));
  }
  const lpos = new Float32Array(pairs.length * 3);
  const lgeo = new THREE.BufferGeometry();
  lgeo.setAttribute('position', new THREE.BufferAttribute(lpos, 3));
  const lmat = new THREE.LineBasicMaterial({ color: '#E2552D', transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false });
  const lines = new THREE.LineSegments(lgeo, lmat);

  const group = new THREE.Group();
  group.add(points, lines);
  scene.add(group);

  // light theme: darker ink
  const theme = () => {
    const light = document.documentElement.dataset.theme === 'light';
    pmat.uniforms.uColor.value.set(light ? '#B8401F' : '#FF8F66');
    pmat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    lmat.color.set(light ? '#B8401F' : '#E2552D');
    lmat.blending = pmat.blending;
    lmat.opacity = light ? 0.22 : 0.18;
    pmat.needsUpdate = lmat.needsUpdate = true;
  };
  theme();
  new MutationObserver(theme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const state = { morph: 0, dissolve: 0, mx: 0, my: 0 };
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 700 ? 12 : 9;
    group.position.x = w < 900 ? 0 : 2.4;
    camera.updateProjectionMatrix();
  };
  resize();
  addEventListener('resize', resize);
  addEventListener('pointermove', (e) => { state.mx = e.clientX / innerWidth - 0.5; state.my = e.clientY / innerHeight - 0.5; }, { passive: true });

  ScrollTrigger.create({
    trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6,
    onUpdate: (st) => {
      const p = st.progress;
      state.morph = gsap.utils.clamp(0, 1, p / 0.55);
      state.dissolve = gsap.utils.clamp(0, 1, (p - 0.6) / 0.4);
    },
  });

  let visible = true, t = 0;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
  const ease = (x) => x * x * (3 - 2 * x);
  const tick = () => {
    if (!visible || document.hidden) return;
    t += 0.0035;
    const m = ease(state.morph), d = ease(state.dissolve);
    for (let i = 0; i < N * 3; i++) {
      const ab = A[i] + (B[i] - A[i]) * m;
      pos[i] = ab + (C[i] - ab) * d;
    }
    // breathing wobble while still a network
    if (m < 1) for (let i = 0; i < N; i++) pos[i * 3 + 1] += Math.sin(t * 6 + i) * 0.02 * (1 - m);
    geo.attributes.position.needsUpdate = true;
    for (let k = 0; k < pairs.length; k++) { const s = pairs[k] * 3; lpos[k * 3] = pos[s]; lpos[k * 3 + 1] = pos[s + 1]; lpos[k * 3 + 2] = pos[s + 2]; }
    lgeo.attributes.position.needsUpdate = true;
    lmat.opacity = (document.documentElement.dataset.theme === 'light' ? 0.22 : 0.18) * (1 - d * 0.9);
    group.rotation.y = t * (1 - m * 0.85) + m * -0.5 + state.mx * 0.5;
    group.rotation.x = 0.15 + state.my * 0.3 + m * 0.35 - d * 0.2;
    renderer.render(scene, camera);
  };
  gsap.ticker.add(tick);
  return () => { gsap.ticker.remove(tick); renderer.dispose(); };
}
