/* One shared Google Maps loader. Maps are requested only when opened. */
(()=>{'use strict';let promise;const cache=new Map();
function load(){
 if(window.google?.maps?.Map)return Promise.resolve();
 if(promise)return promise;
 promise=new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(Error('Tiempo de carga agotado')),18000);
  window.tripInteractiveReady=()=>{clearTimeout(timer);resolve();};
  const s=document.createElement('script');s.async=true;
  s.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(window.TRIP_MAPS_KEY||'')+'&callback=tripInteractiveReady&loading=async&language=es';
  s.onerror=()=>{clearTimeout(timer);reject(Error('No se ha podido cargar Maps'));};document.head.append(s);
 });return promise;
}
async function locate(p){
 if(Number.isFinite(p.lat)&&Number.isFinite(p.lng))return {lat:p.lat,lng:p.lng};
 const query=p.mapQuery||p.query||p.name+', Disneyland Paris';
 if(cache.has(query))return cache.get(query);
 const attempt=(async()=>{
  let result;
  try{const r=await new google.maps.Geocoder().geocode({address:query,region:'fr',bounds:{south:48.85,west:2.75,north:48.89,east:2.81}});result=r.results?.[0]?.geometry.location;}catch{}
  if(!result){try{const {Place}=await google.maps.importLibrary('places');const r=await Place.searchByText({textQuery:query,fields:['location','displayName'],locationBias:{lat:48.869,lng:2.778},maxResultCount:1});result=r.places?.[0]?.location;}catch{}}
  if(!result)throw Error('No se ha podido localizar '+p.name);
  const pos={lat:result.lat(),lng:result.lng()};
  if(pos.lat<48.85||pos.lat>48.89||pos.lng<2.75||pos.lng>2.81)throw Error('Resultado fuera del complejo Disney');
  return pos;
 })();cache.set(query,attempt);try{return await attempt;}catch(e){cache.delete(query);throw e;}
}
function frame(el,p){
 const q=p.mapQuery||p.query||p.name;
 const f=document.createElement('iframe');f.title='Mapa interactivo de '+p.name;f.src='https://maps.google.com/maps?q='+encodeURIComponent(q)+'&z=17&output=embed';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.allowFullscreen=true;f.className='poi-map';el.replaceChildren(f);
}
async function group(el,points,onSelect){
 el.innerHTML='<p class="pg-map-message">Localizando tus favoritos…</p>';
 await load();if(!el.isConnected)return;
 const canvas=document.createElement('div');canvas.className='pg-map-canvas';el.replaceChildren(canvas);
 const map=new google.maps.Map(canvas,{center:{lat:48.869,lng:2.778},zoom:16,mapTypeControl:true,streetViewControl:false,fullscreenControl:true,gestureHandling:'cooperative'});
 const bounds=new google.maps.LatLngBounds();let count=0;const failed=[];
 // Bounded batches avoid a burst of geocoding requests for long lists.
 for(let start=0;start<points.length;start+=3){
  if(!el.isConnected)return;
  const batch=points.slice(start,start+3);const located=await Promise.allSettled(batch.map(locate));
  located.forEach((r,i)=>{const p=batch[i];if(r.status==='rejected'){failed.push(p);return;}bounds.extend(r.value);count++;
   const marker=new google.maps.Marker({map,position:r.value,title:p.name,label:{text:String(points.indexOf(p)+1),color:'#fff'},icon:{path:google.maps.SymbolPath.CIRCLE,scale:14,fillColor:p.park===1?'#17614f':'#785199',fillOpacity:1,strokeColor:'#fff',strokeWeight:2}});
   marker.addListener('click',()=>onSelect(p));
  });
 }
 if(count){map.fitBounds(bounds,44);google.maps.event.addListenerOnce(map,'idle',()=>{if(map.getZoom()>18)map.setZoom(18);});}
 const message=document.createElement('p');message.className='pg-map-message';message.setAttribute('role','status');message.textContent=count+' de '+points.length+' favoritos situados. Toca un número para abrir su ficha.';
 if(failed.length)message.textContent+=' No se ha podido localizar: '+failed.map(p=>p.name).join(', ')+'. Sus enlaces de ubicación siguen disponibles en la lista.';
 el.append(message);return {map,count,failed};
}
window.TripInteractiveMaps={load,frame,group};
})();
