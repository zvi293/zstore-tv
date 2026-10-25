/* Zstore TV 2.0 - core */
var Z=(function(){
var Z={screens:{},order:[],data:{},cur:null,listeners:[]};
Z.$=function(id){return document.getElementById(id)};
Z.pad=function(n){return (n<10?'0':'')+n};
Z.hhmm=function(d){return Z.pad(d.getHours())+':'+Z.pad(d.getMinutes())};
Z.tm=function(s){if(!s)return '--:--';return Z.hhmm(new Date(s))};
Z.ymd=function(d){return d.getFullYear()+'-'+Z.pad(d.getMonth()+1)+'-'+Z.pad(d.getDate())};
Z.toast=function(t){var e=Z.$('toast');e.textContent=t;e.className='toast on';clearTimeout(Z._tt);Z._tt=setTimeout(function(){e.className='toast'},2600)};
Z.get=function(k,d){try{var v=localStorage.getItem('zt_'+k);return v===null?d:JSON.parse(v)}catch(e){return d}};
Z.set=function(k,v){try{localStorage.setItem('zt_'+k,JSON.stringify(v))}catch(e){}};
Z.on=function(f){Z.listeners.push(f)};
Z.emit=function(){for(var i=0;i<Z.listeners.length;i++)try{Z.listeners[i]()}catch(e){}};
Z.rnd=function(a,b){return a+Math.random()*(b-a)};
/* ---- audio ---- */
var AC=null;
Z.ac=function(){if(!AC){try{var A=window.AudioContext||window.webkitAudioContext;if(A)AC=new A()}catch(e){}}if(AC&&AC.state==='suspended'){try{AC.resume()}catch(e){}}return AC};
Z.noise=function(sec){var a=Z.ac();if(!a)return null;var n=Math.floor(a.sampleRate*sec),b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(var i=0;i<n;i++)d[i]=Math.random()*2-1;return b};
function tone(f,t,dur,type,vol,f2){var a=AC,o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur*.8);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.02)}
Z.sfx=function(type){var a=Z.ac();if(!a)return;try{var t=a.currentTime;
  if(type==='move')tone(880,t,.07,'sine',.03);
  else if(type==='ok'){tone(523,t,.12,'triangle',.06);tone(784,t+.07,.2,'triangle',.06)}
  else if(type==='back')tone(660,t,.16,'sine',.05,330);
  else if(type==='good'){tone(659,t,.15,'triangle',.08);tone(988,t+.1,.3,'triangle',.08)}
  else if(type==='bad')tone(220,t,.35,'sawtooth',.04,140);
  else if(type==='chime'){[523,659,784,1047].forEach(function(f,i){tone(f,t+i*.18,1.6,'sine',.05)})}
  else if(type==='soft')tone(392,t,.9,'sine',.04)}catch(e){}};
/* ---- canvas helpers ---- */
Z.cv=function(cv){cv.width=window.innerWidth;cv.height=window.innerHeight;return cv.getContext('2d')};
Z.loop=function(fn,fps){var id=0,last=0,iv=1000/(fps||30),run=true;function f(t){if(!run)return;id=requestAnimationFrame(f);if(t-last<iv)return;var dt=last?Math.min(120,t-last):16;last=t;fn(t,dt)}id=requestAnimationFrame(f);return function(){run=false;cancelAnimationFrame(id)}};
/* ---- data ---- */
var LAT=32.087,LON=34.887,LL='latitude='+LAT+'&longitude='+LON+'&tzid=Asia/Jerusalem';
function getJSON(u,cb){try{var x=new XMLHttpRequest();x.open('GET',u);x.timeout=15000;x.onload=function(){try{cb(JSON.parse(x.responseText))}catch(e){}};x.send()}catch(e){}}
Z.load=function(){
  getJSON('https://api.open-meteo.com/v1/forecast?latitude='+LAT+'&longitude='+LON+'&current=temperature_2m,weather_code,is_day,cloud_cover,precipitation,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=Asia%2FJerusalem&forecast_days=4',function(j){Z.data.wx=j;Z.emit()});
  getJSON('https://www.hebcal.com/zmanim?cfg=json&'+LL,function(j){Z.data.zm=j.times;Z.emit()});
  var s=new Date(Date.now()-2*864e5),e=new Date(Date.now()+150*864e5);
  getJSON('https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&s=on&i=on&c=on&lg=he&start='+Z.ymd(s)+'&end='+Z.ymd(e)+'&'+LL,function(j){Z.data.hol=j.items||[];Z.emit()});
};
Z.WX={0:['☀️','בהיר'],1:['🌤️','בהיר ברובו'],2:['⛅','מעונן חלקית'],3:['☁️','מעונן'],45:['🌫️','ערפל'],48:['🌫️','ערפל'],51:['🌦️','טפטוף'],53:['🌦️','טפטוף'],55:['🌦️','טפטוף'],61:['🌧️','גשם קל'],63:['🌧️','גשם'],65:['🌧️','גשם חזק'],80:['🌦️','ממטרים'],81:['🌧️','ממטרים'],82:['⛈️','ממטרים חזקים'],95:['⛈️','סופת רעמים'],96:['⛈️','סופת רעמים'],99:['⛈️','סופת רעמים']};
Z.wx=function(c){return Z.WX[c]||['🌡️','']};
Z.isRain=function(){var w=Z.data.wx;if(!w)return false;var c=w.current.weather_code;return w.current.precipitation>0||(c>=51&&c<=67)||(c>=80&&c<=99)};
function items(cat){var h=Z.data.hol||[],r=[];for(var i=0;i<h.length;i++)if(h[i].category===cat)r.push(h[i]);return r}
Z.parasha=function(){var p=items('parashat'),now=Z.ymd(new Date());for(var i=0;i<p.length;i++)if(p[i].date>=now)return p[i].hebrew||p[i].title;return ''};
Z.nextCandles=function(){var c=items('candles'),n=Date.now();for(var i=0;i<c.length;i++){var t=new Date(c[i].date).getTime();if(t>n)return c[i]}return null};
Z.inShabbat=function(){var c=items('candles'),h=items('havdalah'),n=Date.now(),lc=null,i;
  for(i=0;i<c.length;i++){var t=new Date(c[i].date).getTime();if(t<=n)lc=t}
  if(!lc)return null;for(i=0;i<h.length;i++){var th=new Date(h[i].date).getTime();if(th>lc){return th>n?h[i]:null}}return null};
Z.holidays=function(){var h=items('holiday'),now=Z.ymd(new Date()),r=[],seen={};
  for(var i=0;i<h.length;i++){var x=h[i];if(x.date.substr(0,10)<now)continue;if(x.subcat==='shabbat'||/Katan|Banot|Selichot|Leil /.test(x.title_orig||''))continue;if(x.subcat==='modern'&&!/Yom Ha|Yom Yerushalayim/.test(x.title_orig||''))continue;var nm=(x.hebrew||x.title).replace(/\u05BE/g,'-').replace(/[\u0591-\u05C7]/g,'');var base=nm.split(':')[0].replace(/ (א|ב|ג|ד|ה|ו|ז|ח)׳.*$/,'').replace(/^ערב /,'');
    if(/חנוכה/.test(nm))base='חנוכה';if(seen[base])continue;seen[base]=1;r.push({name:base,full:nm,date:x.date.substr(0,10),orig:x.title_orig||''})}return r};
Z.chanukahTonight=function(){var h=items('holiday'),now=Z.ymd(new Date());for(var i=0;i<h.length;i++){var m=/Chanukah: (\d) Candle/.exec(h[i].title_orig||'');if(m&&h[i].date.substr(0,10)===now)return +m[1]}return 0};
Z.daysTo=function(ymd){var a=new Date(Z.ymd(new Date())+'T00:00'),b=new Date(ymd+'T00:00');return Math.round((b-a)/864e5)};
var hebFmt=null;try{hebFmt=new Intl.DateTimeFormat('he-IL-u-ca-hebrew',{day:'numeric',month:'long',year:'numeric'})}catch(e){}
var gregFmt=new Intl.DateTimeFormat('he-IL',{weekday:'long',day:'numeric',month:'long'});
Z.heb=function(d){try{return hebFmt?hebFmt.format(d):''}catch(e){return ''}};
Z.greg=function(d){return gregFmt.format(d)};
Z.greet=function(h){return h<5?'לילה טוב':h<12?'בוקר טוב':h<17?'צהריים טובים':h<21?'ערב טוב':'לילה טוב'};
/* ---- TizenBrew bridge: launch another module (TizenTube) ---- */
Z.launchModule=function(match){try{var ws=new WebSocket('ws://127.0.0.1:8081'),done=false;
  ws.onopen=function(){ws.send(JSON.stringify({type:4,payload:false}))};
  ws.onmessage=function(ev){var m;try{m=JSON.parse(ev.data)}catch(e){return}if(m.type!==4||!m.payload||done)return;var md=null;
    for(var i=0;i<m.payload.length;i++){var x=m.payload[i],n=((x.fullName||'')+' '+(x.appName||'')).toLowerCase();if(n.indexOf(match)>=0){md=x;break}}
    if(!md){Z.toast('המודול לא נמצא ב-TizenBrew');return}done=true;
    try{(md.keys||[]).forEach(function(k){try{tizen.tvinputdevice.registerKey(k)}catch(e){}})}catch(e){}
    ws.send(JSON.stringify({type:5,payload:md}));Z.toast('פותח '+(md.appName||'')+'…');
    setTimeout(function(){location.href=md.appPath},md.evaluateScriptOnDocumentStart?3500:400)};
  ws.onerror=function(){Z.toast('אין חיבור ל-TizenBrew')}}catch(e){Z.toast('אין חיבור ל-TizenBrew')}};
Z.launchApp=function(id){try{tizen.application.launch(id,function(){},function(){Z.toast('לא הצלחתי לפתוח')})}catch(e){Z.toast('זמין רק בטלוויזיה')}};
/* ---- screens ---- */
Z.add=function(s){Z.screens[s.id]=s;Z.order.push(s.id)};
Z.show=function(id,arg){var o=Z.screens[Z.cur];if(o&&o.stop){try{o.stop()}catch(e){}}
  var ss=document.querySelectorAll('.screen');for(var i=0;i<ss.length;i++)ss[i].className='screen'+(ss[i].id==='s_'+id?' on':'');
  Z.cur=id;Z.idle=Date.now();var s=Z.screens[id];if(s&&s.start){try{s.start(Z.$('s_'+id),Z.$('c_'+id),arg)}catch(e){if(window.console)console.error(e)}}};
Z.build=function(){var host=Z.$('screens');Z.order.forEach(function(id){var s=Z.screens[id];if(id==='home')return;var sec=document.createElement('section');sec.className='screen';sec.id='s_'+id;
  sec.innerHTML=(s.canvas?'<canvas class="full" id="c_'+id+'"></canvas>':'')+(s.html||'');host.appendChild(sec)})};
return Z})();