'use strict';
(() => {
  const host = document.querySelector('.scene-canvas');
  if (!host || !('IntersectionObserver' in window)) return;
  const machine = host.closest('.business-machine');
  const sceneElement = machine.closest('[data-motion-scene]');
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let started = false;
  const lazy = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting) || started) return;
    started = true;
    lazy.disconnect();
    import('./assets/vendor/three/three.module.min.js').then(initialize).catch(() => {
      host.dataset.sceneState = 'fallback';
    });
  }, { rootMargin: '250px' });
  lazy.observe(sceneElement);

  function initialize(THREE) {
    const canvas = document.createElement('canvas');
    const compact = matchMedia('(max-width: 700px)').matches || navigator.connection?.saveData;
    let context;
    try { context = canvas.getContext('webgl2', { alpha: true, antialias: !compact, powerPreference: 'low-power' }); } catch (_) { /* DOM fallback. */ }
    if (!context) { host.dataset.sceneState = 'fallback'; return; }
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: !compact }); }
    catch (_) { host.dataset.sceneState = 'fallback'; return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, compact ? 1.25 : 1.5));
    renderer.setClearColor(0xf8f9f4, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 50);
    camera.position.set(0, 0, 10.3);
    const world = new THREE.Group();
    scene.add(world);
    scene.add(new THREE.HemisphereLight(0xfaffed, 0x496552, 1.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(-3, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9ee7c1, 1.1);
    rim.position.set(4, -1, 2);
    scene.add(rim);
    const materials = [];
    const geometries = [];
    const textures = [];
    const keepGeometry = value => (geometries.push(value), value);
    const keepMaterial = value => (materials.push(value), value);
    const mint = keepMaterial(new THREE.MeshStandardMaterial({ color: 0x8fba8e, roughness: .3, metalness: .14 }));
    const dark = keepMaterial(new THREE.MeshStandardMaterial({ color: 0x246549, roughness: .32, metalness: .25 }));
    const cream = keepMaterial(new THREE.MeshStandardMaterial({ color: 0xeff1df, roughness: .65, metalness: .03 }));
    function mesh(geometry, material, parent = world) {
      const object = new THREE.Mesh(keepGeometry(geometry), material);
      parent.add(object);
      return object;
    }
    camera.position.set(6.5, 5.5, 8.5);
    camera.lookAt(0, .75, 0);
    const clay = keepMaterial(new THREE.MeshStandardMaterial({ color: 0xc78e69, roughness: .85 }));
    const navy = keepMaterial(new THREE.MeshStandardMaterial({ color: 0x4a6577, roughness: .75 }));
    const gold = keepMaterial(new THREE.MeshStandardMaterial({ color: 0xd2ae63, roughness: .75 }));
    const tyre = keepMaterial(new THREE.MeshStandardMaterial({ color: 0x37463b, roughness: .9 }));
    const wall = keepMaterial(new THREE.MeshStandardMaterial({ color: 0xdce6cb, roughness: .9 }));
    function box(w, h, d, x, y, z, material, parent = world) {
      const object = mesh(new THREE.BoxGeometry(w, h, d), material, parent);
      object.position.set(x, y, z); return object;
    }
    function sphere(r, x, y, z, material, parent) {
      const object = mesh(new THREE.SphereGeometry(r, 14, 10), material, parent);
      object.position.set(x, y, z); return object;
    }
    function label(text, width, height, parent, background = '#f6f3df', color = '#31523a') {
      const surface = document.createElement('canvas'); surface.width = 512; surface.height = 128;
      const pen = surface.getContext('2d'); pen.fillStyle = background; pen.fillRect(0, 0, 512, 128);
      pen.fillStyle = color; pen.textAlign = 'center'; pen.font = 'bold 42px sans-serif'; pen.fillText(text, 256, 80);
      const texture = new THREE.CanvasTexture(surface); texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture);
      return mesh(new THREE.PlaneGeometry(width, height), keepMaterial(new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })), parent);
    }
    // A miniature neighbourhood shop, made from original low-poly geometry.
    const shop = new THREE.Group(); world.add(shop); shop.name = 'shop';
    box(6.1, .18, 4.1, 0, -.21, .2, cream);
    box(3.6, .14, 2.7, -.45, -.05, -.45, wall, shop);
    box(3.6, 2.4, .12, -.45, 1.12, -1.72, wall, shop);
    box(.12, 2.4, 2.6, -2.19, 1.12, -.45, wall, shop);
    box(3.85, .12, 1.08, -.45, 2.43, -1.18, cream, shop);
    for (let i = 0; i < 10; i++) {
      box(.38, .13, 1.1, -2.16 + i * .38, 2.46, -1.18, i % 2 ? cream : dark, shop);
      box(.38, .23, .065, -2.16 + i * .38, 2.31, -.64, i % 2 ? cream : dark, shop);
    }
    const sign = label('STROMULE GENERAL STORE', 2.8, .38, shop);
    box(3.8, .3, .05, -.45, 2.18, -.61, cream, shop);
    sign.position.set(-.45, 2.18, -.575);
    // Shelves and recognizable everyday items: rice sacks, bottles, cartons.
    const shelves = new THREE.Group(); shelves.name = 'inventory'; shop.add(shelves);
    for (let y of [.38, 1.04, 1.66]) box(2.8, .07, .47, -.45, y, -1.28, cream, shelves);
    for (let x of [-1.8, .9]) box(.045, 1.6, .04, x, .88, -1.45, dark, shelves);
    const riceBags = [];
    for (let i = 0; i < 6; i++) {
      const bag = new THREE.Group(); bag.position.set(-1.52 + (i % 3) * .42, .58 + Math.floor(i / 3) * .64, -1.22); shelves.add(bag); riceBags.push(bag);
      const sack = mesh(new THREE.CapsuleGeometry(.115, .19, 3, 10), gold, bag); sack.scale.set(1, 1, .65);
      const band = box(.18, .065, .16, 0, .02, 0, cream, bag);
    }
    for (let i = 0; i < 5; i++) {
      mesh(new THREE.CylinderGeometry(.045, .065, .23, 10), mint, shelves).position.set(.1 + i * .14, 1.21, -1.2);
      mesh(new THREE.CylinderGeometry(.025, .025, .055, 8), dark, shelves).position.set(.1 + i * .14, 1.35, -1.2);
      box(.16, .24, .15, -.8 + i * .28, 1.83, -1.25, i % 2 ? cream : mint, shelves);
    }
    const stockSign = label('RICE · 42 BAGS', 1.2, .2, shop);
    stockSign.position.set(-1.01, .23, -.98);
    const counter = new THREE.Group(); counter.name = 'checkout'; shop.add(counter);
    box(1.7, .72, .62, .05, .3, .11, dark, counter);
    box(1.86, .09, .76, .05, .71, .11, cream, counter);
    box(.35, .22, .27, .55, .85, .05, navy, counter);
    const display = label('₹ 1,180', .32, .13, counter, '#203d30', '#dcefc5');
    display.position.set(.55, .88, .195);
    const counterBrand = label('ONE CONNECTED DAY', 1.2, .2, counter, '#246549', '#f3f5e9'); counterBrand.position.set(.05, .34, .425);
    function person(name, shirt, apron = false) {
      const group = new THREE.Group(); group.name = name;
      const torso = mesh(new THREE.CapsuleGeometry(.135, .27, 4, 10), shirt, group); torso.position.y = .62;
      sphere(.145, 0, .99, 0, clay, group);
      const hair = sphere(.147, 0, 1.04, -.02, tyre, group); hair.scale.set(1, .55, .92);
      for (const x of [-.055, .055]) sphere(.014, x, 1, .129, tyre, group);
      for (const x of [-.085, .085]) { const leg = mesh(new THREE.CapsuleGeometry(.052, .22, 3, 8), navy, group); leg.position.set(x, .22, 0); box(.11, .07, .19, x, .055, .035, tyre, group); }
      const arms = [];
      for (const x of [-.19, .19]) {
        const arm = mesh(new THREE.CapsuleGeometry(.045, .22, 3, 8), shirt, group); arm.position.set(x, .63, .01); arm.rotation.z = x > 0 ? -.18 : .18; arms.push(arm);
        sphere(.05, x, .43, .03, clay, group);
      }
      if (apron) box(.21, .3, .045, 0, .6, .125, cream, group);
      group.userData.arms = arms;
      world.add(group); return group;
    }
    const keeper = person('shopkeeper', dark, true); keeper.position.set(.05, .05, -.47);
    const customer = person('customer', navy); customer.position.set(-2, .02, 1.25); customer.rotation.y = .55;
    const basket = new THREE.Group(); basket.name = 'customer-basket'; customer.add(basket);
    basket.position.set(.25, .42, .23);
    box(.34, .22, .25, 0, 0, 0, gold, basket);
    for (let i = 0; i < 3; i++) box(.35, .025, .27, 0, -.08 + i * .065, 0, cream, basket);
    const handle = mesh(new THREE.TorusGeometry(.14, .012, 4, 18, Math.PI), dark, basket); handle.position.y = .1;
    const supplier = person('supplier', gold); supplier.position.set(2.3, .02, -.6); supplier.rotation.y = -.8;
    const van = new THREE.Group(); van.name = 'supplier-van'; world.add(van);
    van.position.set(2.35, .02, 1.15); van.rotation.y = -.2;
    box(.65, .65, .9, 0, .55, -.15, cream, van);
    box(.64, .48, .48, 0, .44, .51, mint, van);
    box(.57, .2, .035, 0, .64, .765, navy, van);
    for (const x of [-.35, .35]) for (const z of [-.36, .5]) { const wheel = mesh(new THREE.CylinderGeometry(.15, .15, .08, 12), tyre, van); wheel.rotation.z = Math.PI / 2; wheel.position.set(x, .15, z); }
    const vanSign = label('SUPPLY', .58, .18, van); vanSign.position.set(.331, .63, -.1); vanSign.rotation.y = Math.PI / 2;
    const deliveryBoxes = [];
    for (let i = 0; i < 3; i++) { const item = box(.27, .25, .28, 1.9 + (i % 2) * .3, .1 + Math.floor(i / 2) * .25, -.72, gold); item.name = 'delivery-box'; deliveryBoxes.push(item); }
    // A real bill emerges from checkout when the visitor creates the sample sale.
    const billSurface = document.createElement('canvas'); billSurface.width = 384; billSurface.height = 512;
    const ink = billSurface.getContext('2d'); ink.fillStyle = '#fffdf0'; ink.fillRect(0, 0, 384, 512);
    ink.fillStyle = '#31523a'; ink.textAlign = 'center'; ink.font = 'bold 27px monospace'; ink.fillText('STROMULE', 192, 58);
    ink.font = '15px monospace'; ink.fillText('SAMPLE BILL #001', 192, 98);
    ink.font = 'bold 52px sans-serif'; ink.fillText('₹1,180', 192, 200);
    ink.font = '20px monospace'; ink.fillText('Rice · 5 kg × 2', 192, 270);
    ink.font = '15px monospace'; ink.fillText('2 × ₹590 = ₹1,180', 192, 312);
    for (let i = 0; i < 42; i++) { ink.fillRect(44 + i * 7, 367, i % 3 ? 2 : 4, 52); }
    ink.font = '11px monospace'; ink.fillText('ILLUSTRATION · NO REAL SALE', 192, 469);
    const billTexture = new THREE.CanvasTexture(billSurface); billTexture.colorSpace = THREE.SRGBColorSpace; textures.push(billTexture);
    const receipt = mesh(new THREE.PlaneGeometry(.85, 1.14), keepMaterial(new THREE.MeshBasicMaterial({map:billTexture, side:THREE.DoubleSide})));
    receipt.name = 'sample-bill'; receipt.position.set(.45, 1.55, .65); receipt.quaternion.copy(camera.quaternion); receipt.scale.setScalar(.01);
    const soldItems = [];
    for (let i = 0; i < 2; i++) {
      const bag = mesh(new THREE.CapsuleGeometry(.11, .17, 3, 10), gold); bag.name = 'purchased-rice'; bag.scale.z = .7; soldItems.push(bag);
    }
    const routes = [
      [new THREE.Vector3(-2, .65, 1.25), new THREE.Vector3(-.4, 1.35, 1.2), new THREE.Vector3(.05, .9, .15)],
      [new THREE.Vector3(-1.1, 1.2, -1.25), new THREE.Vector3(-.9, 1.8, .1), new THREE.Vector3(-.45, .7, 1)],
      [new THREE.Vector3(.1, .85, .15), new THREE.Vector3(.7, 2.2, .45), new THREE.Vector3(.5, 1.5, .7)],
      [new THREE.Vector3(2.3, .6, 1), new THREE.Vector3(.8, 1.5, -.4), new THREE.Vector3(-1.1, 1.1, -1.25)]
    ].map(points => new THREE.QuadraticBezierCurve3(...points));
    routes.forEach((route, i) => { const path = new THREE.Line(keepGeometry(new THREE.BufferGeometry().setFromPoints(route.getPoints(32))), keepMaterial(new THREE.LineBasicMaterial({color:0x789c68,transparent:true,opacity:.32}))); path.name = `business-route-${i}`; world.add(path); });
    let phase = 0, visible = false, lost = false, disposed = false;
    let pointer = {x:0,y:0,active:false};
    let targetRotation = {x:0,y:0}, scrollTarget = 0;
    let currentStep = Number(machine.dataset.flow) || 0;
    let transition = 1;
    const count = compact ? 60 : 120;
    const particlePositions = new Float32Array(count * 3), velocities = new Float32Array(count * 3);
    const particleGeometry = keepGeometry(new THREE.BufferGeometry());
    particleGeometry.setAttribute('position',new THREE.BufferAttribute(particlePositions,3).setUsage(THREE.DynamicDrawUsage));
    const particleMaterial = keepMaterial(new THREE.PointsMaterial({color:0x558652,size:.035,transparent:true,opacity:.7,depthWrite:false}));
    const particles = new THREE.Points(particleGeometry,particleMaterial); particles.name = 'transaction-trails'; world.add(particles);
    const customerTargets = [new THREE.Vector3(-2,.02,1.25),new THREE.Vector3(-.65,.02,1.05),new THREE.Vector3(-.9,.02,1.4),new THREE.Vector3(-1.9,.02,1.5)];
    const temp = new THREE.Vector3();
    const temp2 = new THREE.Vector3();
    function setStep() {
      const next = Number(machine.dataset.flow) || 0;
      if (next !== currentStep) { currentStep = next; transition = 0; }
      host.dataset.shopStep = String(currentStep);
      const signTexture = stockSign.material.map;
      const pen = signTexture.image.getContext('2d'); pen.fillStyle = '#f6f3df'; pen.fillRect(0,0,512,128); pen.fillStyle = '#31523a'; pen.font = 'bold 42px sans-serif'; pen.textAlign = 'center'; pen.fillText(`RICE · ${[42,42,40,48][currentStep]} BAGS`,256,80); signTexture.needsUpdate = true;
    }
    setStep(); host.append(canvas);
    function paused() { return reduced.matches || root.classList.contains('motion-paused'); }
    function update(dt) {
      phase += dt;
      transition = dt ? Math.min(1,transition + dt * .65) : 1;
      const ease = dt ? Math.min(1,dt * 4) : 1;
      const step = Math.min(dt,.035) * 60;
      world.rotation.y += (targetRotation.y * .5 - world.rotation.y) * ease;
      world.rotation.x += (targetRotation.x * .35 + scrollTarget * .035 - world.rotation.x) * ease;
      customer.position.lerp(customerTargets[currentStep],ease);
      customer.rotation.y += ((currentStep === 0 ? .55 : -.15) - customer.rotation.y) * ease;
      const wave = Math.sin(phase * 2) * .16;
      keeper.userData.arms[1].rotation.x = currentStep === 1 ? -.7 + wave : -.12;
      supplier.userData.arms[0].rotation.x = currentStep === 3 ? -.6 + wave : 0;
      van.position.x += ((currentStep === 3 ? 2.05 : 2.65) - van.position.x) * ease;
      van.position.z += ((currentStep === 3 ? .85 : 1.4) - van.position.z) * ease;
      const billScale = currentStep === 2 ? 1.3 : currentStep === 1 ? .65 : .01;
      receipt.scale.setScalar(THREE.MathUtils.lerp(receipt.scale.x,billScale,ease));
      receipt.position.y += ((currentStep === 2 ? 1.9 : 1.3) - receipt.position.y) * ease;
      receipt.rotation.z = Math.sin(phase * .6) * .025;
      riceBags.forEach((bag,i) => { bag.visible = currentStep < 2 || currentStep === 3 || i < 4; });
      soldItems.forEach((bag,i) => {
        bag.visible = currentStep === 1 || currentStep === 2;
        const amount = currentStep === 1 ? Math.min(1,transition * 2) : 1;
        temp.set(-1.52 + i * .42,.58,-1.22).lerp(temp2.set(customer.position.x + .23 + i * .12,.69,customer.position.z + .23),amount);
        bag.position.copy(temp);
      });
      deliveryBoxes.forEach((item,i) => {
        const amount = currentStep === 3 ? Math.max(0,Math.min(1,transition * 1.5 - i * .16)) : 0;
        const start = temp.set(1.9 + (i % 2) * .3,.1 + Math.floor(i / 2) * .25,-.72);
        const end = temp2.set(-1.6 + i * .4,.6,-1.2);
        item.position.copy(start.lerp(end,amount));
        item.position.y += Math.sin(amount * Math.PI) * .9;
      });
      for (let i=0;i<count;i++) {
        const k=i*3;
        const route = routes[Math.floor(i / (count/4))];
        const t = (i / (count/4) + phase * .14) % 1;
        route.getPoint(t,temp);
        const dx=particlePositions[k]-pointer.x,dy=particlePositions[k+1]-pointer.y;
        const distance=Math.max(.1,dx*dx+dy*dy);
        const force=pointer.active && distance<.7 ? .0015/distance : 0;
        for(let axis=0;axis<3;axis++) {
          const target = axis===0?temp.x:axis===1?temp.y:temp.z;
          velocities[k+axis] += (target-particlePositions[k+axis])*.015*step;
          if(axis===0)velocities[k] += dx*force*step;
          if(axis===1)velocities[k+1] += dy*force*step;
          velocities[k+axis] *= Math.pow(.82,step);
          particlePositions[k+axis] += velocities[k+axis]*step;
          if(!dt)particlePositions[k+axis]=target;
        }
      }
      particleGeometry.attributes.position.needsUpdate=true;
    }
    let frame = 0, last = 0, lastDraw = 0;
    function render(now) {
      frame = 0;
      if (!visible || document.hidden || paused() || lost || disposed) return;
      frame = requestAnimationFrame(render);
      if (compact && now - lastDraw < 32) return;
      const dt = last ? Math.min((now - last) / 1000, .035) : 1 / 60;
      last = now; lastDraw = now;
      update(dt);
      renderer.render(scene, camera);
    }
    function sync() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0; last = 0;
      const running = visible && !document.hidden && !paused() && !lost && !disposed;
      host.dataset.sceneState = lost ? 'fallback' : running ? 'running' : 'paused';
      if (running) frame = requestAnimationFrame(render);
      else if (!lost && !disposed) renderer.render(scene, camera);
    }
    function resize() {
      const { width, height } = machine.getBoundingClientRect();
      if (!width || !height || disposed) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(machine);
    const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: .02 });
    visibility.observe(machine);
    const settings = new MutationObserver(sync); settings.observe(root, { attributes: true, attributeFilter: ['class'] });
    const flowObserver = new MutationObserver(() => { setStep(); if (paused()) { update(0); renderer.render(scene, camera); } });
    flowObserver.observe(machine, { attributes: true, attributeFilter: ['data-flow'] });
    function stir(event) {
      if (paused()) return;
      const rect = machine.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width * 2 - 1;
      const ny = -((event.clientY - rect.top) / rect.height * 2 - 1);
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      pointer = { x: nx * halfHeight * camera.aspect, y: ny * halfHeight, active: true };
      targetRotation = { x: -ny * .1, y: nx * .16 };
    }
    machine.addEventListener('pointermove', stir, { passive: true });
    const raycaster = new THREE.Raycaster();
    const hitPoint = new THREE.Vector2();
    const entitySteps = { customer:0, shopkeeper:1, checkout:2, inventory:2, supplier:3, 'supplier-van':3, 'delivery-box':3, 'purchased-rice':2, 'sample-bill':2 };
    function hitEntity(event) {
      const rect = machine.getBoundingClientRect();
      hitPoint.set((event.clientX-rect.left)/rect.width*2-1,-((event.clientY-rect.top)/rect.height*2-1));
      world.updateMatrixWorld(true);
      raycaster.setFromCamera(hitPoint,camera);
      for (const hit of raycaster.intersectObjects(world.children,true)) {
        if(!hit.object.isMesh)continue;
        let object = hit.object;
        while(object && object!==world) {
          if(Object.prototype.hasOwnProperty.call(entitySteps,object.name)) return entitySteps[object.name];
          object=object.parent;
        }
        return null; // Solid scenery occludes entities behind it.
      }
      return null;
    }
    let press = null;
    machine.addEventListener('pointerdown', event => { press={x:event.clientX,y:event.clientY}; stir(event); }, {passive:true});
    machine.addEventListener('pointermove',event=>{const entity=hitEntity(event);machine.style.cursor=entity===null?'default':'pointer';host.dataset.hoverEntity=entity===null?'':String(entity);},{passive:true});
    machine.addEventListener('pointerleave', () => { pointer.active=false;press=null;targetRotation={x:0,y:0};machine.style.cursor='default'; });
    machine.addEventListener('pointerup', event => {
      if(press && Math.hypot(event.clientX-press.x,event.clientY-press.y)<8) {
        const entity=hitEntity(event);
        if(entity!==null)document.querySelector(`[data-flow-step="${entity}"]`)?.click();
      }
      press=null;
      if(event.pointerType!=='mouse')pointer.active=false;
    });
    machine.addEventListener('pointercancel', () => { pointer.active=false;press=null; });
    function scroll() { if (!visible || document.hidden) return; scrollTarget = Math.max(-1, Math.min(1, -machine.getBoundingClientRect().top / innerHeight)); }
    addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost = true; machine.classList.remove('webgl-ready'); sceneElement.classList.remove('scene-available'); sync(); });
    canvas.addEventListener('webglcontextrestored', () => { lost = false; resize(); machine.classList.add('webgl-ready'); sceneElement.classList.add('scene-available'); sync(); });
    function dispose(event) {
      if (event.persisted) { if (frame) cancelAnimationFrame(frame); frame = 0; return; }
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      visibility.disconnect(); resizeObserver.disconnect(); settings.disconnect(); flowObserver.disconnect();
      document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync); removeEventListener('scroll', scroll);
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); textures.forEach(texture => texture.dispose());
      renderer.dispose();
    }
    addEventListener('pagehide', dispose);
    addEventListener('pageshow', sync);
    update(0); resize();
    machine.classList.add('webgl-ready'); sceneElement.classList.add('scene-available');
    host.dataset.particleCount = String(count);
    sync();
  }
})();
