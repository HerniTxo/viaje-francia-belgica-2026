/* Guía del viaje: páginas por lugar, sin dependencias de interfaz. */
"use strict";
(() => {
 const $ = s => document.querySelector(s);
 const escape = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const currency = n => new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
 let data, currentPage, mapEpoch = 0, mapsPromise, returnFocus;
 const menu = $('#sidebar'), content = $('#contenido');
 const mode = m => ({driving:'Coche',walking:'A pie',transit:'Transporte público'}[m]);
 const status = s => s ? `<span class="status ${escape(s)}">${s==='confirmado'?'Confirmado':'Propuesta'}</span>` : '';
 const anchor = (url,label,cls='',detail='') => {
  const internal = url.startsWith('#/'), phone=url.startsWith('tel:');
  return `<a class="${escape(cls)}" href="${escape(url)}"${internal||phone?'':' target="_blank" rel="noopener noreferrer"'}><span>${escape(label)}${detail?`<small>${escape(detail)}</small>`:''}</span><span class="arrow" aria-hidden="true">${phone?'':internal?'→':'↗'}</span></a>`;
 };
 function directions(r) {
  const q = new URLSearchParams({api:'1',origin:r.origin,destination:r.destination,travelmode:r.mode});
  if(r.stops.length && r.mode!=='transit') q.set('waypoints',r.stops.join('|'));
  return 'https://www.google.com/maps/dir/?'+q;
 }
 const search = p => 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.address || p.name+', '+p.city);
 const findRoute = id => data.routes.find(r=>r.id===id);
 const routeButton = id => {const r=findRoute(id);return r?anchor(directions(r),'Abrir tramo en Maps','inline-action'):''};
 function routeCard(id) {
  const r=findRoute(id); if(!r)return '';
  return `<article class="route-card"><span class="route-mode">${escape(mode(r.mode))}</span><h2>${escape(r.name)}</h2>${r.note?`<p>${escape(r.note)}</p>`:''}${routeButton(id)}</article>`;
 }
 function hotel(id) {
  const h=data.stays.find(s=>s.id===id);
  return `<section><h2 class="hotel-title">${escape(h.name)}</h2><p class="hotel-address">${escape(h.address)}</p>${status(h.status)}<div class="actions">${anchor(search(h),'Cómo llegar','button')}${anchor('tel:'+h.phone.replaceAll(' ',''),'Llamar al hotel','button secondary')}</div></section>`+
    block({type:'facts',title:'Estancia',items:[{label:'Entrada',value:h.checkin},{label:'Salida',value:h.checkout},{label:'Total reserva',value:currency(h.price)+' · impuestos incluidos; pago no comprobado.'},{label:'Aparcamiento',value:h.parking}]})+
    block({type:'note',title:'Datos de la reserva',text:h.conditions});
 }
 function placeCards(ids) {
  return '<section class="place-cards" aria-label="Fichas de lugares">'+ids.map(id=>{
   const p=data.places.find(x=>x.id===id);if(!p)return '';
   const maps=search(p);
   const info=p.url?anchor(p.url,'Ficha oficial','inline-action'):'';
   return '<article class="place-card" id="lugar-'+escape(p.id)+'"><div class="place-card-head"><h2>'+escape(p.name)+'</h2>'+status(p.status)+'</div><p>'+escape(p.description||'Lugar de interés para visitar durante el viaje.')+'</p><div class="actions">'+anchor(maps,'Ver en Google Maps','button secondary')+info+'</div></article>';
  }).join('')+'</section>';
 }
 function block(b) {
  switch(b.type){
   case 'place-cards':return placeCards(b.ids);
   case 'park-guide':return '<div class="park-guide" id="park-guide"></div>';
   case 'timeline': return `<ol class="timeline">${b.items.map(i=>`<li><span class="time">${escape(i.time)}</span><h2>${escape(i.title)}</h2>${status(i.status)}${i.text?`<p>${escape(i.text)}</p>`:''}${i.route?routeButton(i.route):''}${i.link?anchor(i.link,'Ver esta etapa','inline-action'):''}</li>`).join('')}</ol>`;
   case 'note':return `<section class="note ${escape(b.tone||'')}"><h2>${escape(b.title)}</h2><p>${escape(b.text)}</p>${b.url?anchor(b.url,'Consultar fuente','inline-action'):''}</section>`;
   case 'links':return `<section class="links"><h2>${escape(b.title)}</h2>${b.items.map(i=>anchor(i.url,i.label,'link-row',i.text)).join('')}</section>`;
   case 'facts':return `<section class="facts"><h2>${escape(b.title)}</h2><dl>${b.items.map(i=>`<div><dt>${i.placeId?`<button type="button" class="place-term" data-poi="${escape(i.placeId)}" aria-haspopup="dialog" aria-label="Ver ficha y mapa de ${escape(i.label)}">${escape(i.label)}</button>`:i.url?anchor(i.url,i.label):escape(i.label)}</dt><dd>${escape(i.value)}</dd></div>`).join('')}</dl></section>`;
   case 'routes':return `<section class="route-stack" aria-label="Rutas">${b.ids.map(routeCard).join('')}</section>`;
   case 'details':return `<details${b.open?' open':''}><summary>${escape(b.title)}</summary><div class="details-content">${b.blocks.map(block).join('')}</div></details>`;
   case 'hotel':return hotel(b.id);
   case 'phrases':return `<section class="phrase-list ${b.compact?'phrase-compact':''}" aria-label="Frases en francés">${b.items.map(i=>`<article class="phrase-card"><h2>${escape(i.es)}</h2><p class="phrase-french" lang="fr">${escape(i.fr)}</p>${i.address?`<p class="phrase-address">${escape(i.address)}</p>`:''}<p class="phrase-phonetic"><span>Suena:</span> ${escape(i.phonetic)}</p><button type="button" class="phrase-play" data-say="${escape(i.fr)}" data-audio="${escape(i.audio)}" data-spanish="${escape(i.es)}" aria-label="Escuchar en francés: ${escape(i.es)}" aria-pressed="false">▶ Escuchar</button>${i.mapQuery?anchor('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(i.mapQuery),'Ver destino en Maps','inline-action'):''}${i.source?anchor(i.source,'Fuente de la dirección','phrase-source'):''}</article>`).join('')}</section>`;
   case 'image':return `<section class="image-card"><h2>${escape(b.title)}</h2><p>${escape(b.text)}</p><a href="${escape(b.src)}" target="_blank" rel="noopener noreferrer" aria-label="Ampliar ${escape(b.title)}"><img src="${escape(b.src)}" alt="${escape(b.title)}: atracciones numeradas y recorrido propuesto por zonas" loading="lazy" width="2024" height="1432"></a>${anchor(b.src,'Ampliar plano','inline-action')}</section>`;
   case 'map':return `<section aria-label="Mapa de ${escape(currentPage.title)}"><div class="map-box" id="place-map"><p>Cargando mapa…</p></div><p class="map-caption">Ubicaciones de referencia. Toca un punto o abre el lugar en Maps. Las rutas se consultan por tramos, en su modo de transporte.</p><details><summary>Ver lugares y estaciones en Maps</summary><div class="places-list details-content">${currentPage.points.map(id=>data.places.find(p=>p.id===id)).filter(Boolean).map(p=>anchor(search(p),p.name,'link-row')).join('')}</div></details></section>`;
   default:return '';
  }
 }
 function toggleMenu(open,restore=true) {
  if(open) returnFocus=document.activeElement;
  menu.classList.toggle('open',open); $('#scrim').hidden=!open;
  $('#menu-button').setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);
  if(open){content.inert=true;$('#close-menu').focus();}
  else{content.inert=false;if(restore&&returnFocus?.isConnected)returnFocus.focus();}
 }
 function nav(){
  const dates={'torcy-paris':'8','disney':'9–10','gante':'11–12','brujas':'12','bruselas':'12','nantes':'13–14','burdeos':'14','saint-emilion':'15','bilbao':'15'};
  $('#navigation').innerHTML=`<a class="nav-link" href="#/inicio" data-page="inicio">El viaje<span aria-hidden="true">↗</span></a><div class="nav-caption">Lugares</div>`+data.pages.filter(p=>!p.utility).map(p=>`<a class="nav-link ${['brujas','bruselas'].includes(p.id)?'nav-sub':''}" href="#/${escape(p.id)}" data-page="${escape(p.id)}"><span>${escape(p.title)}</span><small>${escape(dates[p.id])} nov.</small></a>`).join('')+'<div class="nav-caption">Práctico</div>'+data.pages.filter(p=>p.utility).map(p=>`<a class="nav-link" href="#/${escape(p.id)}" data-page="${escape(p.id)}">${escape(p.title)}</a>`).join('');
 }
 function home(){
  currentPage=null;
  content.innerHTML=`<header class="page-head"><span class="eyebrow">8–15 NOVIEMBRE 2026</span><h1>El viaje</h1><p class="intro">Elige el lugar para consultar su plan, rutas y mapas.</p></header><section class="days" aria-label="Itinerario del 8 al 15 de noviembre">${data.days.map(d=>`<article class="day"><div class="day-number">${d.day}<small>${escape(d.weekday)}</small></div><div><h2>${escape(d.title)}</h2><p>${escape(d.text)}</p><div class="day-links">${d.links.map(l=>anchor(l[1],l[0])).join('')}</div></div></article>`).join('')}</section>`;
  document.title='El viaje · Francia y Bélgica';
 }
 function render(){
  if(!data)return;
  stopPhraseAudio();
  mapEpoch++;
  const [id='inicio',paneId]=location.hash.replace(/^#\/?/,'').split('/');
  const p=data.pages.find(p=>p.id===id);
  if(!p){home();}
  else{
   currentPage=p; const selected=p.panes.find(t=>t.id===paneId)||p.panes[0];
   content.innerHTML=`<a class="page-back" href="#/inicio">← El viaje</a><header class="page-head"><span class="eyebrow">${escape(p.date)}</span><h1>${escape(p.title)}</h1><p class="intro">${escape(p.intro)}</p></header><nav class="panes" aria-label="Secciones de ${escape(p.title)}">${p.panes.map(t=>`<a class="pane-link" href="#/${escape(p.id)}/${escape(t.id)}"${t.id===selected.id?' aria-current="page"':''}>${escape(t.label)}</a>`).join('')}</nav><div class="panel">${selected.blocks.map(block).join('')}</div><footer class="page-end"><a href="#/inicio">← Ver el viaje</a>${p.next?anchor('#/'+p.next,'Siguiente: '+data.pages.find(q=>q.id===p.next).title):''}</footer>`;
   document.title=p.title+' · '+selected.label+' · Guía del viaje';
   if(p.id==='frances'){
    $('.panes').insertAdjacentHTML('beforebegin','<details class="pronunciation-help"><summary>Cómo leer la pronunciación</summary><p>Es una aproximación para hispanohablantes, no una transcripción exacta. «zh»: como una sh con voz; «ü»: labios de u al decir i; «(n)»: vocal nasal, sin marcar la n. La r francesa se hace en la garganta. Para aprender el sonido, escucha la frase.</p><p>El audio es una grabación en francés. Necesitas conexión para cargar cada frase. En Gante y Brujas el idioma local es el neerlandés; estas frases están pensadas principalmente para las etapas de Francia.</p></details><p id="speech-status" class="speech-status" role="status" aria-live="polite"></p>');
   }
   if(selected.id==='tiempo')showWeather(p,mapEpoch);
   if(selected.blocks.some(b=>b.type==='park-guide'))void window.TripParkGuide.mount($('#park-guide'));
   if(selected.blocks.some(b=>b.type==='map'))void drawMap(p,mapEpoch);
  }
  document.querySelectorAll('[data-page]').forEach(a=>a.removeAttribute('aria-current'));
  const active=$(`[data-page="${p?p.id:'inicio'}"]`);if(active)active.setAttribute('aria-current','page');
  content.setAttribute('aria-busy','false');toggleMenu(false,false);window.scrollTo({top:0,behavior:'instant'});
 }
 let audioButton=null, activeAudio=null;
 function stopPhraseAudio(){
  if(activeAudio){activeAudio.pause();activeAudio.remove();activeAudio=null;}
  if(audioButton){audioButton.textContent='▶ Escuchar';audioButton.setAttribute('aria-pressed','false');audioButton.setAttribute('aria-label','Escuchar en francés: '+audioButton.dataset.spanish);audioButton=null;}
 }
 content.addEventListener('click',e=>{
  const button=e.target.closest('[data-audio]');if(!button)return;
  const same=audioButton===button;stopPhraseAudio();if(same)return;
  const message=$('#speech-status');if(message)message.textContent='';
  const audio=document.createElement('audio');audio.id='phrase-player';audio.preload='none';audio.src=button.dataset.audio;
  content.append(audio);activeAudio=audio;audioButton=button;
  button.textContent='■ Parar';button.setAttribute('aria-pressed','true');button.setAttribute('aria-label','Parar audio');
  audio.onended=()=>{if(activeAudio===audio)stopPhraseAudio();};
  const failed=()=>{if(activeAudio!==audio)return;stopPhraseAudio();if(message)message.textContent='No se ha podido cargar el audio. Comprueba la conexión y vuelve a tocar Escuchar.';};
  audio.onerror=failed;
  try{const result=audio.play();if(result)result.catch(failed);}catch{failed();}
 });
 window.addEventListener('pagehide',stopPhraseAudio);
 const weatherVisits={
  'torcy-paris':[{name:'Torcy',lat:48.841,lng:2.656,days:[8,9,10,11]},{name:'París · noche',lat:48.857,lng:2.34,days:[8],night:true}],
  disney:[{name:'Disney',lat:48.87,lng:2.78,days:[9,10]}],gante:[{name:'Gante',lat:51.054,lng:3.726,days:[11,12,13]}],
  brujas:[{name:'Brujas',lat:51.209,lng:3.224,days:[12]}],bruselas:[{name:'Bruselas',lat:50.847,lng:4.352,days:[12]}],
  nantes:[{name:'Nantes',lat:47.216,lng:-1.55,days:[13,14]}],burdeos:[{name:'Burdeos',lat:44.838,lng:-.579,days:[14,15]}],
  'saint-emilion':[{name:'Saint-Émilion',lat:44.894,lng:-.156,days:[15]}],bilbao:[{name:'Bilbao',lat:43.263,lng:-2.935,days:[15]}]
 };
 const weatherCache=new Map();
 async function forecast(v,refresh=false){
  const key=v.lat+','+v.lng,cached=weatherCache.get(key);
  if(!refresh&&cached&&Date.now()-cached.time<900000)return cached;
  const q=new URLSearchParams({key:window.TRIP_MAPS_KEY,'location.latitude':v.lat,'location.longitude':v.lng,days:'10',pageSize:'10',unitsSystem:'METRIC',languageCode:'es'});
  let rows=[],token;
  do{
   if(token)q.set('pageToken',token);
   const response=await fetch('https://weather.googleapis.com/v1/forecast/days:lookup?'+q,{signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw new Error('Weather no disponible');
   const body=await response.json();rows.push(...(body.forecastDays||[]));token=body.nextPageToken;
  }while(token&&rows.length<10);
  const result={rows,time:Date.now()};weatherCache.set(key,result);return result;
 }
 async function showWeather(p,epoch,refresh=false){
  let el=$('#weather');
  if(!el){el=document.createElement('section');el.id='weather';el.className='weather note';el.setAttribute('aria-live','polite');$('.panel').append(el);}
  el.innerHTML='<h2>Tiempo en las fechas de visita</h2><p>Consultando el pronóstico…</p>';
  const visits=weatherVisits[p.id]||[];
  const results=await Promise.allSettled(visits.map(v=>forecast(v,refresh)));
  if(epoch!==mapEpoch)return;
  const temperature=t=>Number.isFinite(t?.degrees)?Math.round(t.degrees)+' °C':'—';
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  el.innerHTML='<h2>Tiempo en las fechas de visita</h2>'+visits.map((v,i)=>{
   const result=results[i];
   return '<div class="weather-place"><strong>'+escape(v.name)+'</strong>'+v.days.map(day=>{
    const date='2026-11-'+String(day).padStart(2,'0');
    const d=result.status==='fulfilled'?result.value.rows.find(x=>x.displayDate?.year===2026&&x.displayDate?.month===11&&x.displayDate?.day===day):null;
    if(!d)return '<p>'+day+' nov. · '+(date<today?'Fecha pasada; sin pronóstico.':result.status==='rejected'?'No se ha podido consultar el tiempo.':'Todavía fuera del alcance del pronóstico.')+'</p>';
    const f=v.night?d.nighttimeForecast:d.daytimeForecast,prob=f?.precipitation?.probability?.percent;
    return '<p><b>'+day+' nov.</b> · '+escape(f?.weatherCondition?.description?.text||'Sin descripción')+' · '+temperature(d.minTemperature)+' / '+temperature(d.maxTemperature)+(Number.isFinite(prob)?' · Precipitación '+prob+' %':'')+'</p>';
   }).join('')+'</div>';
  }).join('')+'<div class="weather-footer"><small>Google Weather · Consulta '+new Intl.DateTimeFormat('es-ES',{timeZone:'Europe/Madrid',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date())+' · mín./máx. diaria</small><button type="button" class="weather-refresh">Actualizar</button></div>';
  el.querySelector('button').addEventListener('click',()=>void showWeather(p,epoch,true));
 }
 function loadMaps(){
  if(window.TripInteractiveMaps)return window.TripInteractiveMaps.load();
  if(window.google?.maps?.Map)return Promise.resolve();
  if(mapsPromise)return mapsPromise;
  mapsPromise=new Promise((resolve,reject)=>{
   let settled=false;
   const fail=()=>{if(!settled){settled=true;reject(new Error('Mapa no disponible'));}};
   const timer=setTimeout(fail,14000);
   window.tripMapsReady=()=>{clearTimeout(timer);if(!settled){settled=true;resolve();}};
   window.gm_authFailure=()=>{clearTimeout(timer);fail();const el=$('#place-map');if(el)el.innerHTML='<div class="map-fail">El mapa integrado no está disponible aquí. Puedes abrir todos los lugares con los enlaces de debajo.</div>';};
   const script=document.createElement('script');script.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(window.TRIP_MAPS_KEY)+'&callback=tripMapsReady&loading=async&language=es';script.async=true;script.onerror=()=>{clearTimeout(timer);fail();};document.head.append(script);
  });
  return mapsPromise;
 }
 async function drawMap(p,epoch){
  try{
   await loadMaps();if(epoch!==mapEpoch)return;
   const el=$('#place-map');if(!el)return;
   const points=p.points.map(id=>data.places.find(x=>x.id===id)).filter(Boolean);
   const map=new google.maps.Map(el,{center:{lat:points[0].lat,lng:points[0].lng},zoom:14,mapTypeControl:false,streetViewControl:false,fullscreenControl:true,gestureHandling:'cooperative'});
   const bounds=new google.maps.LatLngBounds(),info=new google.maps.InfoWindow();
   points.forEach(pt=>{
    const pos={lat:pt.lat,lng:pt.lng};bounds.extend(pos);
    const marker=new google.maps.Marker({position:pos,map,title:pt.name});
    marker.addListener('click',()=>{info.setContent(`<div class="map-popup"><strong>${escape(pt.name)}</strong>${anchor(search(pt),'Abrir en Google Maps')}</div>`);info.open({anchor:marker,map});});
   });
   if(points.length>1){map.fitBounds(bounds,30);google.maps.event.addListenerOnce(map,'idle',()=>{if(map.getZoom()>16)map.setZoom(16);});}
  }catch{
   if(epoch!==mapEpoch)return;
   const el=$('#place-map');if(el)el.innerHTML='<div class="map-fail">No se ha podido cargar el mapa integrado. Abre los lugares en Google Maps con los enlaces de debajo.</div>';
  }
 }
 $('#menu-button').addEventListener('click',()=>toggleMenu(!menu.classList.contains('open')));
 $('#close-menu').addEventListener('click',()=>toggleMenu(false));$('#scrim').addEventListener('click',()=>toggleMenu(false));
 document.addEventListener('keydown',e=>{
  if(!menu.classList.contains('open'))return;
  if(e.key==='Escape'){e.preventDefault();toggleMenu(false);}
  if(e.key==='Tab'){
   const focusable=Array.from(menu.querySelectorAll('a,button')).filter(x=>x.getClientRects().length);
   const first=focusable[0],last=focusable.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
 });
 menu.addEventListener('click',e=>{if(e.target.closest('a'))toggleMenu(false,false);});
 const viewport=matchMedia('(min-width:761px)');viewport.addEventListener('change',()=>toggleMenu(false,false));
 $('.skip').addEventListener('click',e=>{e.preventDefault();content.focus({preventScroll:true});});
 window.addEventListener('hashchange',()=>{render();content.focus({preventScroll:true});});
 async function init(){
  try{
   const response=await fetch('data/trip.json?v=2.6');if(!response.ok)throw new Error('No hay datos');data=await response.json();nav();
   const day=new URLSearchParams(location.search).get('dia');
   if(!location.hash.startsWith('#/')&&day){const d=data.days.find(d=>'2026-11-'+String(d.day).padStart(2,'0')===day);if(d)history.replaceState(null,'',location.pathname+location.search+d.links[0][1]);}
   render();
  }catch{
   content.setAttribute('aria-busy','false');content.innerHTML='<section class="error"><h1>No se ha podido cargar la guía</h1><p>Comprueba la conexión y vuelve a intentarlo.</p><button class="button" id="retry">Volver a cargar</button></section>';$('#retry').addEventListener('click',init);
  }
 }
 void init();
})();

