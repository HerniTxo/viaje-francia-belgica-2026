/* One shared Google Maps loader. Maps are requested only when opened. */
(()=>{'use strict';let promise;
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
function frame(el,p){
 const q=Number.isFinite(p.lat)&&Number.isFinite(p.lng)?p.lat+','+p.lng:(p.mapQuery||p.query||p.name);
 const f=document.createElement('iframe');f.title='Mapa interactivo de '+p.name;f.src='https://maps.google.com/maps?q='+encodeURIComponent(q)+'&z=17&output=embed';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.allowFullscreen=true;f.className='poi-map';el.replaceChildren(f);
}
async function group(el,points,onSelect){
 el.innerHTML='<p class="pg-map-message">Abriendo el mapa de tus favoritos…</p>';
 await load();if(!el.isConnected)return;
 const canvas=document.createElement('div');canvas.className='pg-map-canvas';el.replaceChildren(canvas);
 const map=new google.maps.Map(canvas,{center:{lat:48.869,lng:2.778},zoom:16,mapTypeControl:true,streetViewControl:false,fullscreenControl:true,gestureHandling:'cooperative'});
 const bounds=new google.maps.LatLngBounds();let count=0;const failed=[],groups=new Map();
 points.forEach((p,i)=>{if(!Number.isFinite(p.lat)||!Number.isFinite(p.lng)){failed.push(p);return;}const pos={lat:p.lat,lng:p.lng};bounds.extend(pos);count++;const key=p.lat+','+p.lng;if(!groups.has(key))groups.set(key,{pos,items:[]});groups.get(key).items.push({p,index:i+1});});
 const info=new google.maps.InfoWindow();
 for(const g of groups.values()){
  const first=g.items[0],multiple=g.items.length>1;
  const marker=new google.maps.Marker({map,position:g.pos,title:g.items.map(x=>x.p.name).join(' · '),label:{text:String(first.index)+(multiple?'+':''),color:'#fff'},icon:{path:google.maps.SymbolPath.CIRCLE,scale:15,fillColor:first.p.park===1?'#17614f':'#785199',fillOpacity:1,strokeColor:'#fff',strokeWeight:2}});
  marker.addListener('click',()=>{if(!multiple){onSelect(first.p);return;}const box=document.createElement('div');box.className='pg-map-choices';const title=document.createElement('p');title.textContent='Favoritos en esta zona';box.append(title);g.items.forEach(({p,index})=>{const button=document.createElement('button');button.className='place-term';button.textContent=index+'. '+p.name;button.style.display='block';button.style.marginBottom='12px';button.onclick=()=>{info.close();onSelect(p);};box.append(button,document.createElement('br'));});info.setContent(box);info.open({anchor:marker,map});});
 }
 if(count){map.fitBounds(bounds,44);google.maps.event.addListenerOnce(map,'idle',()=>{if(map.getZoom()>18)map.setZoom(18);});}
 const message=document.createElement('p');message.className='pg-map-message';message.setAttribute('role','status');message.textContent=count+' de '+points.length+' favoritos situados. Toca un número para abrir su ficha; + agrupa varios favoritos en la misma zona.';
 if(failed.length)message.textContent+=' No se ha podido localizar: '+failed.map(p=>p.name).join(', ')+'. Sus enlaces de ubicación siguen disponibles en la lista.';
 el.append(message);return {map,count,failed};
}
window.TripInteractiveMaps={load,frame,group};
})();
