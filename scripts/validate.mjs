import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const data=JSON.parse(fs.readFileSync('docs/data/trip.json','utf8'));
assert.deepEqual(data.days.map(d=>d.day),[8,9,10,11,12,13,14,15]);
assert.equal(data.meta.party,3);
assert.deepEqual(data.pages.map(p=>p.id),['torcy-paris','disney','gante','brujas','bruselas','nantes','burdeos','saint-emilion','bilbao','frances','documentos']);
const pages=new Map(data.pages.map(p=>[p.id,p]));
const routes=new Map(data.routes.map(r=>[r.id,r]));
const places=new Map(data.places.map(p=>[p.id,p]));
const stays=new Set(data.stays.map(s=>s.id));
assert.equal(routes.size,data.routes.length);
assert.equal(places.size,data.places.length);
function checkURL(url){
 if(url.startsWith('#/')){
  const [id,pane]=url.slice(2).split('/');
  if(id==='inicio')return;
  assert(pages.has(id),'Página inexistente: '+url);
  if(pane)assert(pages.get(id).panes.some(p=>p.id===(pages.get(id).paneAliases?.[pane]||pane)),'Pestaña inexistente: '+url);
 }else if(url.startsWith('assets/'))assert(fs.existsSync(path.join('docs',url)),'Archivo inexistente: '+url);
 else assert.equal(new URL(url).protocol,'https:','Enlace externo inseguro: '+url);
}
function checkBlock(b){
 assert(['timeline','note','links','facts','routes','details','hotel','image','map','phrases','park-guide','official-plan'].includes(b.type));
 if(b.type==='phrases')for(const i of b.items){
  assert(i.fr?.trim()&&i.es?.trim()&&i.phonetic?.trim(),'Frase incompleta');
  const digest=createHash('sha256').update(i.fr).digest('hex').slice(0,16);
  assert.equal(i.audio,'assets/francais/'+digest+'.mp3','Regenerar audio tras cambiar el francés');
  checkURL(i.audio);
  assert(fs.statSync(path.join('docs',i.audio)).size>1000,'Audio vacío');
 }
 if(b.type==='timeline')for(const i of b.items){if(i.route)assert(routes.has(i.route),'Tramo inexistente: '+i.route);if(i.link)checkURL(i.link);assert(['confirmado','propuesta'].includes(i.status));}
 if(b.type==='routes')for(const id of b.ids)assert(routes.has(id),'Ruta inexistente: '+id);
 if(b.type==='links')for(const l of b.items)checkURL(l.url);
 if(b.type==='note'&&b.url)checkURL(b.url);
 if(b.type==='details')b.blocks.forEach(checkBlock);
 if(b.type==='hotel')assert(stays.has(b.id));
 if(b.type==='image')checkURL(b.src);
 if(b.type==='official-plan')checkURL(b.url);
 if(b.type==='map'){for(const id of b.ids||[])assert(places.has(id),'Punto de mapa inexistente: '+id);for(const id of b.walkRoutes||[]){assert(routes.has(id),'Paseo inexistente: '+id);const r=routes.get(id);assert(r.walkPath?.length>1,'Falta trazado: '+id);assert(r.pointIds.every(p=>b.ids.includes(p)),'Extremos fuera del mapa: '+id);}}
 if(b.type==='facts')for(const i of b.items){if(i.placeId)assert(places.has(i.placeId),'Ficha inexistente: '+i.placeId);if(i.url)checkURL(i.url);}
}
for(const page of data.pages){
 assert(page.panes.length>0);
 assert.equal(new Set(page.panes.map(p=>p.id)).size,page.panes.length);
 for(const pane of page.panes)pane.blocks.forEach(checkBlock);
 for(const id of page.points)assert(places.has(id),'Punto inexistente: '+id);
 if(page.next)assert(pages.has(page.next));
}
for(const day of data.days)day.links.forEach(l=>checkURL(l[1]));
for(const route of data.routes){
 assert(['walking','driving','transit'].includes(route.mode));
 assert(route.origin&&route.destination);
 assert(route.stops.length<=3,'Exceso de paradas para Maps móvil: '+route.id);
 if(route.walkPath)for(const [lat,lng] of route.walkPath)assert(Number.isFinite(lat)&&Number.isFinite(lng)&&Math.abs(lat)<=90&&Math.abs(lng)<=180,'Coordenada de paseo inválida');
}
for(const p of data.places){if(p.lat==null&&p.lng==null){assert(p.address?.trim(),'Falta dirección para ubicar '+p.id);}else{assert(Number.isFinite(p.lat)&&p.lat>=-90&&p.lat<=90);assert(Number.isFinite(p.lng)&&p.lng>=-180&&p.lng<=180);}}
assert.equal(Math.round(data.stays.reduce((a,s)=>a+s.price,0)*100),71322);
assert(data.routes.some(r=>r.id==='road15a'&&r.destination.includes('Saint')));
assert(data.routes.some(r=>r.id==='road15b'&&r.destination.includes('Bilbao')));
const publicFiles=['docs/index.html','docs/app.js','docs/data/trip.json','docs/styles.css'].map(f=>fs.readFileSync(f,'utf8')).join('\n');
for(const phrase of ['35785105','Janire','Igor Martinez','Hernández Perrino','localizador','b64_string'])assert(!publicFiles.includes(phrase),'Posible dato privado: '+phrase);
assert(!data.pages.some(p=>p.id==='presupuesto'),'No añadir la página del simulador retirado');
for(const file of ['docs/index.html','docs/app.js','docs/maps-config.js','docs/styles.css','docs/assets/favicon.svg'])assert(fs.existsSync(file));
console.log(`Correcto: 8 días, ${data.pages.length} páginas, ${data.routes.length} rutas; referencias, archivos, fechas y privacidad verificados.`);


// Only the five explicitly requested restricted Drive documents may be linked publicly.
const allowedDriveIds=new Set('10_CDm2Thzb0Ya04OvduSRs06TzGsVdw1 1LUP_S52Rqo-gaHrFzJ-if9V23NoqdKlH 181KSH2uVfGxIrJPQfS7z3ghuH08LCZT1 1a_2vZXIloG2RY-BCmmzUfBCDjJc0v0Xc 1zaymKDgrEAQlagDbEoo7TXra_JzaJUug'.split(' '));
const driveLinks=[...publicFiles.matchAll(/https:\/\/drive\.google\.com\/file\/d\/([^/"\s]+)\/view/g)];
assert.equal(driveLinks.length,10,'Cada documento debe aparecer en el índice y en su destino');
for(const [,id] of driveLinks)assert(allowedDriveIds.has(id),'Documento Drive no autorizado');
for(const id of allowedDriveIds)assert.equal(driveLinks.filter(m=>m[1]===id).length,2);

// Audit every explicit internal reference, including nested metadata and legacy aliases.
function auditInternal(value){
 if(typeof value==='string'&&value.startsWith('#/'))checkURL(value);
 else if(Array.isArray(value))value.forEach(auditInternal);
 else if(value&&typeof value==='object')Object.values(value).forEach(auditInternal);
}
auditInternal(data);
for(const page of data.pages)for(const target of Object.values(page.paneAliases||{}))assert(page.panes.some(p=>p.id===target),'Alias sin destino: '+page.id+'/'+target);
const cityScript=fs.readFileSync('docs/places-info.js','utf8');
const destinationSection=cityScript.split('const destinationLinks=[')[1].split('].flatMap')[0];
for(const [,id] of destinationSection.matchAll(/\['([^']+)',\[/g))assert(pages.has(id),'Destino de texto inexistente: '+id);
console.log('Enlaces de destinos, metadatos y alias internos verificados.');
