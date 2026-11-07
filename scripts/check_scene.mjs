import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import * as Three from '../assets/vendor/three/three.module.min.js';
const rootPath=new URL('..',import.meta.url).pathname;
function element() {const events=new Map();return {dataset:{},style:{},classList:{items:new Set(),add(...v){v.forEach(x=>this.items.add(x));},remove(...v){v.forEach(x=>this.items.delete(x));},contains(x){return this.items.has(x);}},addEventListener(n,f){events.set(n,f);},removeEventListener(n){events.delete(n);},emit(n,event={}){events.get(n)?.(event);},setAttribute(n,v){this[n]=v;},append(){},firstChild:{textContent:''},getBoundingClientRect(){return {width:600,height:540,left:0,top:0};}};}
async function setup({noContext=false,reducedMotion=false}={}) {
 const root=element(),host=element(),machine=element(),sceneElement=element(),pulse=element(),fold=element(),doc=element();
 host.closest=()=>machine;machine.closest=()=>sceneElement;machine.dataset.flow='0';
 const canvas=element();const drawing={fillRect(){},fillText(){},setLineDash(){},beginPath(){},moveTo(){},lineTo(){},stroke(){}};
 canvas.getContext=type=>type==='2d'?drawing:noContext?null:{};
 doc.documentElement=root;doc.hidden=false;doc.createElement=()=>canvas;
 doc.querySelector=s=>{
   const step=s.match(/data-flow-step="(\d)"/);
   if(step)return {click(){machine.dataset.flow=step[1];mutations[1].cb();}};
   return {'.scene-canvas':host,'.scene-pulse':pulse,'.scene-fold':fold}[s];
 };
 const observers=[],mutations=[],frames=new Map();let frameId=0,capturedScene,capturedCamera,renderCount=0;
 class Observer{constructor(cb){this.cb=cb;observers.push(this);}observe(){}disconnect(){}}
 class Mutation{constructor(cb){this.cb=cb;mutations.push(this);}observe(){}disconnect(){}}
 class Renderer{setPixelRatio(){}setClearColor(){}setSize(){}render(s,c){capturedScene=s;capturedCamera=c;c.updateMatrixWorld(true);s.updateMatrixWorld(true);renderCount++;}dispose(){}}
 const preference={matches:reducedMotion,addEventListener(){},removeEventListener(){}};
 const globalEvents=element();
 const ctx={console,document:doc,IntersectionObserver:Observer,ResizeObserver:class{observe(){}disconnect(){}},MutationObserver:Mutation,matchMedia:q=>q.includes('reduced-motion')?preference:{matches:false},navigator:{},devicePixelRatio:2,innerHeight:1000,Float32Array,Math,Promise,THREE_TEST:{...Three,WebGLRenderer:Renderer},requestAnimationFrame:f=>{frames.set(++frameId,f);return frameId;},cancelAnimationFrame:id=>frames.delete(id),addEventListener:globalEvents.addEventListener.bind(globalEvents),removeEventListener:globalEvents.removeEventListener.bind(globalEvents)};
 ctx.window=ctx;
 vm.runInNewContext(fs.readFileSync(rootPath+'/scene.js','utf8').replace("import('./assets/vendor/three/three.module.min.js')",'Promise.resolve(THREE_TEST)'),ctx);
 observers[0].cb([{isIntersecting:true}]);await new Promise(resolve=>setImmediate(resolve));
 if(noContext)return {host,machine};
 observers[1].cb([{isIntersecting:true}]);
 function tick(time){const batch=[...frames.values()];frames.clear();batch.forEach(f=>f(time));}
 return {host,machine,root,pulse,fold,canvas,doc,mutations,observers,tick,frames,scene:()=>capturedScene,camera:()=>capturedCamera,renders:()=>renderCount};
}
const run=await setup();
assert.equal(run.host.dataset.sceneState,'running');
run.machine.dataset.flow='2';run.mutations[1].cb();
run.machine.emit('pointermove',{clientX:300,clientY:270});
for(let i=1;i<=600;i++)run.tick(i*16.67);
const points=run.scene().children.find(x=>x.type==='Group').children.find(x=>x.type==='Points');
const positions=points.geometry.attributes.position.array;
assert.ok([...positions].every(Number.isFinite),'Particle positions must remain finite');
assert.ok(Math.max(...positions.map(Math.abs))<8,'Spring particles must remain within safe scene bounds');
const world=run.scene().children.find(x=>x.type==='Group');
for (const name of ['shop','shopkeeper','customer','supplier','supplier-van','sample-bill']) assert.ok(world.getObjectByName(name),`Missing ${name}`);
const receipt=world.getObjectByName('sample-bill');assert.ok(receipt.scale.x>1.2,'The sample bill should appear in step 2');
const inventory=world.getObjectByName('inventory');
assert.equal(inventory.children.filter(x=>x.type==='Group'&&x.visible).length,4,'Two rice bags should leave the shelf');
run.machine.dataset.flow='3';run.mutations[1].cb();for(let i=601;i<=900;i++)run.tick(i*16.67);
assert.equal(run.host.dataset.shopStep,'3');
assert.equal(inventory.children.filter(x=>x.type==='Group'&&x.visible).length,6,'Receiving should replenish the shelf illustration');
assert.ok(world.getObjectByName('supplier-van').position.x<2.1,'Supplier van should approach the store');
assert.ok(world.children.filter(x=>x.name==='delivery-box').every(x=>x.position.x<0),'Delivered boxes should reach the stockroom');
run.machine.dataset.flow='0';run.mutations[1].cb();for(let i=901;i<=1080;i++)run.tick(i*16.67);
assert.ok(receipt.scale.x<.02,'Reset should hide the completed bill');
assert.ok(world.getObjectByName('customer').position.x<-1.9,'Reset should bring the customer back to browsing');
// Raycast against the real Three.js geometry, not a mocked entity result.
world.updateMatrixWorld(true);
const supplier=world.getObjectByName('supplier');
const projected=supplier.localToWorld(new Three.Vector3(0,.8,0)).project(run.camera());
const point={clientX:(projected.x+1)*300,clientY:(1-projected.y)*270,pointerType:'mouse'};
run.machine.emit('pointerdown',point);run.machine.emit('pointerup',point);
assert.equal(run.machine.dataset.flow,'3','Clicking the supplier model should select the supplier step');
run.machine.dataset.flow='0';run.mutations[1].cb();
run.machine.emit('pointerdown',point);run.machine.emit('pointerup',{...point,clientY:point.clientY+30});
assert.equal(run.machine.dataset.flow,'0','A scrolling gesture must not select an entity');
run.observers[1].cb([{isIntersecting:false}]);assert.equal(run.frames.size,0);assert.equal(run.host.dataset.sceneState,'paused');
run.observers[1].cb([{isIntersecting:true}]);run.root.classList.add('motion-paused');run.mutations[0].cb();assert.equal(run.frames.size,0);
run.root.classList.remove('motion-paused');run.mutations[0].cb();assert.ok(run.frames.size>0);
run.doc.hidden=true;run.doc.emit('visibilitychange');assert.equal(run.frames.size,0);
run.doc.hidden=false;run.doc.emit('visibilitychange');assert.ok(run.frames.size>0);
run.canvas.emit('webglcontextlost',{preventDefault(){}});assert.equal(run.frames.size,0);assert.equal(run.host.dataset.sceneState,'fallback');
const fallback=await setup({noContext:true});assert.equal(fallback.host.dataset.sceneState,'fallback');assert.equal(fallback.machine.classList.contains('webgl-ready'),false);
const reduced=await setup({reducedMotion:true});assert.equal(reduced.frames.size,0);assert.equal(reduced.host.dataset.sceneState,'paused');
console.log('Passed: finite transaction particles, shop entities, bill creation, stock deduction, supplier delivery, reset, real-geometry raycasting, scroll-gesture rejection, offscreen/hidden/pause lifecycle, context loss, no-WebGL fallback and reduced motion.');
