/* Francia & Bélgica 2026 — cliente estático, sin API ni datos privados */
"use strict";
(function(){
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const esc=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const euro=n=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(Number(n)||0);
const localGet=(key,fallback)=>{try{let s=localStorage.getItem(key);return s===null?fallback:JSON.parse(s);}catch{return fallback}};
const localSet=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
const mapSearch=p=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent((D&&D.stays.find(s=>s.id===p.id)?.address)||p.address||p.name+", "+p.city);
const hotelMap=s=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(s.name+", "+s.address);
const routeURL=(r)=>{const s=new URLSearchParams({api:"1",origin:r.from,destination:r.to,travelmode:r.type==="coche"?"driving":r.type==="pie"?"walking":"transit"});if(r.stops&&r.stops.length&&r.type!=="transporte")s.set("waypoints",r.stops.join("|"));return "https://www.google.com/maps/dir/?"+s.toString()};
const tag=status=>'<span class="pill '+(status==="confirmado"?"confirmed":"proposal")+'">'+(status==="confirmado"?"✓ Confirmado":"◌ Propuesta")+"</span>";
const icon=category=>({alojamiento:"🛏️",atraccion:"✦",transporte:"🚉"})[category]||"📍";
const external=(url,text)=>'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(text)+" ↗</a>";
let D=null,activeDay=null,selectedZone="Todos",category="todos",search="",routeFilter="todos",map=null,markers={},overview=null;
let toastHandle;
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("visible");clearTimeout(toastHandle);toastHandle=setTimeout(()=>el.classList.remove("visible"),3000)}
function todayISO(){const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Madrid",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());const x={};parts.forEach(p=>x[p.type]=p.value);return x.year+"-"+x.month+"-"+x.day}
function initNav(){
 const saved=localGet("trip_theme_v1","light");document.documentElement.dataset.theme=saved;
 $("#theme-button").addEventListener("click",()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;localSet("trip_theme_v1",next)});
 $("#menu-button").addEventListener("click",()=>{const open=$("#main-nav").classList.toggle("open");$("#menu-button").setAttribute("aria-expanded",String(open));$("#menu-button").textContent=open?"×":"☰"});
 $$("#main-nav a").forEach(a=>a.addEventListener("click",()=>{$("#main-nav").classList.remove("open");$("#menu-button").setAttribute("aria-expanded","false");$("#menu-button").textContent="☰"}));
}
function renderDayTabs(){
 $("#day-tabs").innerHTML=D.days.map(d=>'<button role="tab" class="day-tab" data-day="'+esc(d.date)+'" aria-selected="false"><strong>'+esc(d.short)+'</strong><small>'+esc(d.place)+'</small></button>').join("");
 $("#day-tabs").addEventListener("click",e=>{const b=e.target.closest("[data-day]");if(b)selectDay(b.dataset.day,true)});
 const requested=new URLSearchParams(location.search).get("dia");const now=todayISO();
 selectDay(D.days.some(d=>d.date===requested)?requested:(D.days.some(d=>d.date===now)?now:"2026-11-08"),false);
 $("#today-button").addEventListener("click",()=>{const day=D.days.some(d=>d.date===todayISO())?todayISO():"2026-11-08";selectDay(day,true);$("#day-tabs").scrollIntoView({behavior:"smooth",block:"center"});if(day==="2026-11-08"&&todayISO()<day)toast("Mostrando el primer día del viaje")});
 $("#share-day-button").addEventListener("click",async()=>{const url=new URL(location.href);url.searchParams.set("dia",activeDay);url.hash="itinerario";try{if(navigator.share){await navigator.share({title:"Día del viaje",url:url.toString()})}else if(navigator.clipboard){await navigator.clipboard.writeText(url.toString());toast("Enlace del día copiado")}else{toast("Copia el enlace de la barra de direcciones")}}catch{}});
}
function selectDay(date,updateURL){
 const d=D.days.find(x=>x.date===date)||D.days[1];activeDay=d.date;
 $$("#day-tabs [data-day]").forEach(b=>{let yes=b.dataset.day===d.date;b.setAttribute("aria-selected",String(yes));if(yes)b.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})});
 const n=Number(d.date.slice(-2));
 let events=d.events.map(e=>{const p=D.places.find(x=>x.id===e.place);return '<article class="timeline-item"><div class="timeline-time">'+esc(e.time)+'</div><div class="timeline-node"></div><div class="timeline-info"><h4>'+esc(e.title)+'</h4><p>'+esc(e.description)+'</p><div class="timeline-actions">'+tag(e.type)+(p?external(mapSearch(p),"Ver lugar"):"")+'</div></div></article>'}).join("");
 $("#day-detail").innerHTML='<aside class="day-aside"><small>2026 · NOVIEMBRE</small><div class="day-number">'+n+'</div><h3>'+esc(d.headline)+'</h3><p>'+esc(d.summary)+'</p><div class="aside-bottom">'+tag(d.status)+'<button id="day-map">Abrir mapa ↗</button></div></aside><div class="timeline"><h3>'+esc(d.place)+'</h3>'+events+'</div>';
 $("#day-map").addEventListener("click",()=>{const first=d.events.find(e=>D.places.some(p=>p.id===e.place));if(first){const p=D.places.find(x=>x.id===first.place);selectedZone=p.city;$("#map-city").value=p.city;mapDay="todos";$("#map-day").value="todos";filterPlaces();fitMap();}location.hash="mapa"});
 if(updateURL){const url=new URL(location.href);url.searchParams.set("dia",d.date);history.replaceState(null,"",url.pathname+url.search+url.hash)}
}

/* Google Maps JavaScript API · solo navegador, sin backend.
   La clave pública se debe proteger desde Cloud Console mediante referrers y restricciones de API. */
const GOOGLE_MAPS_BROWSER_KEY="AIzaSyByWwbIlgi_zgJY0dx3aP8O7K6SE5UUNEw";
let mapRequest=null,infoWindow=null,mapDay="todos",mapFailed=false;

function loadGoogleMaps(){
 if(window.google && window.google.maps && window.google.maps.Map)return Promise.resolve();
 if(mapRequest)return mapRequest;
 mapRequest=new Promise((resolve,reject)=>{
   const script=document.createElement("script");
   const timeout=setTimeout(()=>reject(new Error("Google Maps tarda demasiado en responder")),18000);
   window.__tripGoogleReady=()=>{clearTimeout(timeout);resolve()};
   window.gm_authFailure=()=>{clearTimeout(timeout);reject(new Error("No autorizado por Google Maps: revisar clave, facturación y dominio permitido"))};
   script.async=true;
   script.onerror=()=>{clearTimeout(timeout);reject(new Error("No se pudo descargar Google Maps"))};
   const qs=new URLSearchParams({key:GOOGLE_MAPS_BROWSER_KEY,callback:"__tripGoogleReady",loading:"async",v:"weekly",language:"es",region:"ES"});
   script.src="https://maps.googleapis.com/maps/api/js?"+qs.toString();
   document.head.appendChild(script);
 });
 return mapRequest;
}
function mapBounds(points){
 if(!map||!points.length)return;
 if(points.length===1){map.setCenter({lat:points[0].lat,lng:points[0].lng});map.setZoom(14);return}
 const bounds=new google.maps.LatLngBounds();
 points.forEach(p=>bounds.extend({lat:p.lat,lng:p.lng}));
 map.fitBounds(bounds,55);
 google.maps.event.addListenerOnce(map,"idle",()=>{if(map.getZoom()>14)map.setZoom(14)});
}
function currentlyVisible(){
 const dayIds=mapDay==="todos"?null:new Set((D.days.find(d=>d.date===mapDay)?.events||[]).map(e=>e.place));
 return D.places.filter(p=>(selectedZone==="Todos"||p.city===selectedZone)&&(category==="todos"||p.category===category)&&(!dayIds||dayIds.has(p.id))&&(p.name+" "+p.description+" "+p.city).toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es")));
}
function fitMap(){
 if(!map)return;
 const points=currentlyVisible();
 if(points.length)mapBounds(points);
 else mapBounds(D.places);
}
function fallbackMap(message){
 mapFailed=true;
 $("#travel-map").innerHTML='<div class="map-fallback"><strong>El mapa de Google no ha podido cargarse.</strong><p>'+esc(message)+'</p><p>Puedes seguir usando la lista de lugares y abrirlos en Google Maps.</p><a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Abrir Google Maps ↗</a></div>';
}
async function createMap(){
 try{
   await loadGoogleMaps();
   if(mapFailed)return;
   map=new google.maps.Map($("#travel-map"),{
     center:{lat:48.5,lng:0.0},zoom:6,
     clickableIcons:true,fullscreenControl:true,streetViewControl:true,mapTypeControl:false,
     gestureHandling:"cooperative",
     zoomControl:true,
     styles:document.documentElement.dataset.theme==="dark"?[{elementType:"geometry",stylers:[{color:"#203a43"}]},{elementType:"labels.text.fill",stylers:[{color:"#b6cfd0"}]},{elementType:"labels.text.stroke",stylers:[{color:"#102c34"}]}]:[]
   });
   infoWindow=new google.maps.InfoWindow({maxWidth:280});
   const icons={alojamiento:["#207a68","H"],atraccion:["#dc8154","★"],transporte:["#315e91","T"]};
   for(const p of D.places){
     const cfg=icons[p.category]||icons.atraccion;
     const svg='<svg xmlns="http://www.w3.org/2000/svg" width="42" height="52" viewBox="0 0 42 52"><path d="M21 2C10 2 2 10 2 21c0 15 19 29 19 29s19-14 19-29C40 10 32 2 21 2z" fill="'+cfg[0]+'" stroke="white" stroke-width="2"/><circle cx="21" cy="20" r="12" fill="white" fill-opacity=".16"/><text x="21" y="25" fill="white" text-anchor="middle" font-size="15" font-family="Arial" font-weight="bold">'+cfg[1]+'</text></svg>';
     const marker=new google.maps.Marker({
       position:{lat:p.lat,lng:p.lng},map:null,title:p.name,
       icon:{url:"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg),scaledSize:new google.maps.Size(34,42),anchor:new google.maps.Point(17,40)}
     });
     marker.addListener("click",()=>showPlace(p.id));
     markers[p.id]=marker;
   }
   filterPlaces();
   fitMap();
 }catch(error){
   console.error("Google Maps:",error);
   fallbackMap(error.message||"Revisar la configuración de la clave");
 }
}
function showPlace(id){
 const p=D.places.find(x=>x.id===id);
 if(!p)return;
 const directions="https://www.google.com/maps/dir/?"+new URLSearchParams({api:"1",destination:p.lat+","+p.lng,travelmode:"driving"});
 const detail='<div class="gmap-popup"><b>'+esc(p.name)+'</b><p>'+esc(p.description)+'</p>'+tag(p.status)+'<div class="gmap-popup-links">'+external(mapSearch(p),"Ver ficha en Google Maps")+external(directions,"Cómo llegar")+(p.url?external(p.url,"Web oficial"):"")+'</div></div>';
 if(!map||!markers[id]){window.open(mapSearch(p),"_blank","noopener,noreferrer");return}
 infoWindow.setContent(detail);
 infoWindow.open({map,anchor:markers[id],shouldFocus:false});
}
function filterPlaces(){
 const visible=currentlyVisible();
 if(map)Object.entries(markers).forEach(([id,marker])=>{const shown=visible.some(p=>p.id===id);marker.setMap(shown?map:null)});
 $("#places-count").textContent=visible.length+" lugares";
 $("#places-list").innerHTML=visible.length?visible.map(p=>'<div class="place-row"><button class="place-item" data-place="'+esc(p.id)+'"><span class="place-icon">'+icon(p.category)+'</span><span><b>'+esc(p.name)+'</b><small>'+esc(p.city)+' · '+(p.status==="confirmado"?"Confirmado":"Propuesta")+'</small></span></button><a class="place-directions" href="'+esc(mapSearch(p))+'" target="_blank" rel="noopener noreferrer">Abrir ↗</a></div>').join(""):'<p class="empty-message">No hay lugares para los filtros elegidos.</p>';
}
function focusPlace(id){
 const p=D.places.find(x=>x.id===id);
 if(!p)return;
 if(!map){window.open(mapSearch(p),"_blank","noopener,noreferrer");return}
 map.panTo({lat:p.lat,lng:p.lng});
 map.setZoom(15);
 if(infoWindow)showPlace(id);
 $("#travel-map").scrollIntoView({behavior:"smooth",block:"center"});
}
function renderMap(){
 const daySelect=$("#map-day");
 daySelect.innerHTML='<option value="todos">Todos los días</option>'+D.days.map(d=>'<option value="'+esc(d.date)+'">'+esc(d.short+' · '+d.place)+'</option>').join("");
 $("#map-city").addEventListener("change",e=>{selectedZone=e.target.value;mapDay="todos";daySelect.value="todos";filterPlaces();fitMap()});
 daySelect.addEventListener("change",e=>{mapDay=e.target.value;selectedZone="Todos";$("#map-city").value="Todos";filterPlaces();fitMap()});
 $("#place-search").addEventListener("input",e=>{search=e.target.value.trim();filterPlaces()});
 $("#map-categories").addEventListener("click",e=>{const b=e.target.closest("[data-map-category]");if(!b)return;category=b.dataset.mapCategory;$$("#map-categories .chip").forEach(x=>x.classList.toggle("active",x===b));filterPlaces();fitMap()});
 $("#places-list").addEventListener("click",e=>{const b=e.target.closest("[data-place]");if(b)focusPlace(b.dataset.place)});
 document.querySelectorAll('a[href="#mapa"]').forEach(a=>a.addEventListener("click",()=>setTimeout(fitMap,220)));
 createMap();
}
function zoneLink(zone){return '<button type="button" data-go-zone="'+esc(zone)+'">Ver mapa ↗</button>'}
function renderDestinations(){
 const cards=[
 {name:"París & Torcy",zone:"París",flag:"🇫🇷",icon:"🗼",gradient:"linear-gradient(135deg,#dfaa83,#9e6f75)",dates:"8–11 nov.",description:"Nuestro campamento base junto al RER A. Dos planes alternativos para una posible noche en París.",stay:D.stays[0],extras:"Torre Eiffel · Trocadéro · Notre-Dame"},
 {name:"Disneyland Paris",zone:"Disney",flag:"✨",icon:"🏰",gradient:"linear-gradient(135deg,#8975aa,#d898a4)",dates:"9–10 nov.",description:"Dos días con acceso confirmado a ambos parques. Atracciones y espectáculos todavía en planificación.",stay:null,extras:"Big Thunder · Tower of Terror · espectáculos"},
 {name:"Gante",zone:"Gante",flag:"🇧🇪",icon:"⛪",gradient:"linear-gradient(135deg,#c8a16e,#567d83)",dates:"11–13 nov.",description:"Canales, fachadas medievales y una jornada completa para explorar su centro histórico.",stay:D.stays[1],extras:"Gravensteen · Graslei · Belfort"},
 {name:"Nantes",zone:"Nantes",flag:"🇫🇷",icon:"🐘",gradient:"linear-gradient(135deg,#6f9992,#c8a574)",dates:"13–14 nov.",description:"Una noche de paso y la opción de descubrir las increíbles Máquinas de la Isla.",stay:D.stays[2],extras:"Máquinas · Castillo · Bouffay"},
 {name:"Burdeos",zone:"Burdeos",flag:"🇫🇷",icon:"🏛️",gradient:"linear-gradient(135deg,#bc806e,#946b94)",dates:"14–15 nov.",description:"Arquitectura, barrios históricos y un posible paseo vespertino por el centro.",stay:D.stays[3],extras:"Place de la Bourse · Porte Cailhau"},
 {name:"En carretera",zone:"Bilbao",flag:"🚗",icon:"🛣️",gradient:"linear-gradient(135deg,#5e8d94,#39566d)",dates:"7–15 nov.",description:"Bilbao–Torcy por la ruta A, etapas intermedias y regreso con Avis antes de las 20:00.",stay:null,extras:"Peajes · combustible · desplazamientos"}
 ];
 $("#destination-grid").innerHTML=cards.map(c=>'<article class="destination-card"><div class="destination-art" style="background:'+c.gradient+'"><span class="art-country">'+esc(c.flag+" · "+c.dates)+'</span><span class="art-emoji">'+c.icon+'</span></div><div class="destination-body"><h3>'+esc(c.name)+'</h3><p>'+esc(c.description)+'</p><div class="destination-meta"><span>'+esc(c.extras)+'</span>'+(c.stay?'<span>🛏️ Alojamiento confirmado</span>':'')+'</div><div class="destination-actions">'+zoneLink(c.zone)+(c.stay?'<a href="'+esc(hotelMap(c.stay))+'" target="_blank" rel="noopener noreferrer">Cómo llegar al hotel ↗</a>':'')+'<a href="#rutas">Ver rutas ↗</a></div></div></article>').join("");
 $("#destination-grid").addEventListener("click",e=>{const b=e.target.closest("[data-go-zone]");if(!b)return;selectedZone=b.dataset.goZone;$("#map-city").value=selectedZone;mapDay="todos";$("#map-day").value="todos";filterPlaces();fitMap();location.hash="mapa"});
}
function renderRoutes(){
 const routes=D.routes.filter(r=>routeFilter==="todos"||r.type===routeFilter);
 $("#route-list").innerHTML=routes.map(r=>'<article class="route-card"><div class="route-card-top"><span class="route-icon">'+({coche:"🚗",transporte:"🚉",pie:"🚶"})[r.type]+'</span>'+tag(r.status)+'</div><h3>'+esc(r.name)+'</h3><p class="route-points">'+esc(r.from)+' → '+esc(r.to)+'</p><p>'+esc(r.note)+'</p><div class="route-card-bottom">'+external(routeURL(r),"Abrir ruta en Google Maps")+(r.stops.length?'<span class="muted small">'+r.stops.length+' paradas intermedias</span>':"")+'</div></article>').join("");
}
function initRoutes(){renderRoutes();$("#route-filters").addEventListener("click",e=>{const b=e.target.closest("[data-route-filter]");if(!b)return;routeFilter=b.dataset.routeFilter;$$("#route-filters .chip").forEach(x=>x.classList.toggle("active",x===b));renderRoutes()})}
function renderBudget(){
 const lines=D.costs.reserved;
 const reserved=lines.reduce((n,x)=>n+x.cost,0);
 $("#budget-reserved").textContent=euro(reserved);
 $("#reserved-items").innerHTML=lines.map(x=>'<div class="budget-item"><span>'+esc(x.name)+'</span><strong>'+euro(x.cost)+'</strong></div>').join("");
 const lodging=D.stays.reduce((n,x)=>n+x.price,0), tickets=D.tickets.total, car=D.rental.price;
 const p1=100*lodging/reserved,p2=100*(lodging+tickets)/reserved;
 $("#budget-donut").style.background="conic-gradient(#287969 0 "+p1.toFixed(2)+"%,#e6a47e "+p1.toFixed(2)+"% "+p2.toFixed(2)+"%,#8f9fc5 "+p2.toFixed(2)+"% 100%)";
 const inputs=["travel-mode","extra-food","extra-parking","extra-other"];
 let saved=localGet("trip_budget_v1",{});
 inputs.forEach(id=>{const el=$("#"+id);if(saved[id]!==undefined)el.value=saved[id];el.addEventListener("input",updateBudget);el.addEventListener("change",updateBudget)});
 $("#reset-budget").addEventListener("click",()=>{inputs.forEach(id=>$("#"+id).value=id==="travel-mode"?"coche":"0");updateBudget()});
 function updateBudget(){
  let mode=$("#travel-mode").value;
  const road=D.costs.roadEstimate.fuel+D.costs.roadEstimate.tolls;
  const disneyCar=D.costs.roadEstimate.segments.find(x=>x.name.includes("Disney")).fuel;
  const transport=road+(mode==="rer"?D.costs.rer.disneyTwoDaysGroup-disneyCar:0);
  const extra=["extra-food","extra-parking","extra-other"].reduce((n,id)=>n+Math.max(0,Math.min(10000,Number($("#"+id).value)||0)),0);
  $("#estimate-road").textContent=euro(transport);
  $("#estimate-total").textContent=euro(reserved+transport+extra);
  $("#estimate-person").textContent=euro((reserved+transport+extra)/D.meta.party);
  const state={};inputs.forEach(id=>state[id]=$("#"+id).value);localSet("trip_budget_v1",state);
 }
 updateBudget();
 $("#road-costs").innerHTML='<table><thead><tr><th>Tramo</th><th>Km</th><th>Gasolina</th><th>Peajes</th><th>Total</th></tr></thead><tbody>'+D.costs.roadEstimate.segments.map(s=>'<tr><td>'+esc(s.name)+'</td><td>'+s.km+'</td><td>'+euro(s.fuel)+'</td><td>'+euro(s.tolls)+'</td><td><b>'+euro(s.fuel+s.tolls)+'</b></td></tr>').join("")+'<tr><td><b>Escenario base</b></td><td><b>'+D.costs.roadEstimate.km+'</b></td><td><b>'+euro(D.costs.roadEstimate.fuel)+'</b></td><td><b>'+euro(D.costs.roadEstimate.tolls)+'</b></td><td><b>'+euro(D.costs.roadEstimate.fuel+D.costs.roadEstimate.tolls)+'</b></td></tr></tbody></table><p class="muted small" style="padding:0 16px 16px">'+esc(D.costs.roadEstimate.assumptions)+"</p>";
}
function renderUseful(){
 $("#alerts-list").innerHTML=D.alerts.map(a=>'<article class="alert-item"><h4>'+esc(a.title)+'</h4><p>'+esc(a.description)+'</p>'+(a.url?external(a.url,"Fuente / comprobar"):"")+'</article>').join("");
 const items=["Documentación de identidad de los 3 viajeros","Permisos de conducir y condiciones del coche","Entradas Disney disponibles en privado (no en esta web)","Comprobar aparcamientos de Nantes y Burdeos","Revisar ZBE/LEZ de Gante con matrícula del alquiler","Consultar RER A y cierre de línea 6 el domingo 8","Revisar horarios oficiales y reservas pendientes","Cargadores, batería externa y ropa de abrigo","Plan de paradas, combustible y peajes"];
 let checks=localGet("trip_checks_v1",{});
 $("#checklist").innerHTML=items.map((s,i)=>'<label class="check-item"><input type="checkbox" data-check="'+i+'" '+(checks[i]?"checked":"")+'><span>'+esc(s)+'</span></label>').join("");
 $("#checklist").addEventListener("change",e=>{if(e.target.matches("[data-check]")){checks[e.target.dataset.check]=e.target.checked;localSet("trip_checks_v1",checks)}});
 $("#clear-checklist").addEventListener("click",()=>{checks={};localSet("trip_checks_v1",checks);$$("#checklist input").forEach(x=>x.checked=false);toast("Lista reiniciada")});
 $("#resource-list").innerHTML=D.resources.map(r=>'<a class="resource-link" href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer"><small>'+esc(r.category)+'</small>'+esc(r.name)+' ↗</a>').join("");
 $("#last-update").textContent=new Date(D.meta.updated+"T12:00:00").toLocaleDateString("es-ES",{day:"numeric",month:"long",year:"numeric"});
 $("#site-version").textContent=D.meta.version;
}
async function start(){
 initNav();
 try{const response=await fetch("data/trip.json?v=1.1",{cache:"no-store"});if(!response.ok)throw Error("HTTP "+response.status);D=await response.json();renderDayTabs();renderMap();renderDestinations();initRoutes();renderBudget();renderUseful()}
 catch(err){console.error("No se han podido cargar los datos del viaje:",err);$("#day-detail").innerHTML='<div class="empty-message">No se ha podido cargar la agenda. Recarga la página para volver a intentarlo.</div>';$("#travel-map").innerHTML='<div class="empty-message">El mapa está temporalmente no disponible. Prueba de nuevo más tarde.</div>';toast("No se pudieron cargar los datos del viaje")}
}
start();
})();