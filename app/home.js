/* Zstore TV 2.0 - home + startup */
(function(){
var rows=[[],[]],fr=0,fc=0;
Z.add({id:'home',start:function(s,cv){Z.sky.start(cv);paint()},stop:function(){Z.sky.stop()}});
function tileHtml(t,n){return '<div class="tile" id="t_'+t.id+'"><div class="ic">'+t.icon+'</div><div><div class="nm">'+t.name+'</div><div class="sb">'+(n<=9?n+' · ':'')+(t.sb||'')+'</div></div></div>'}
function buildTiles(){rows=[[{id:'yt',icon:'▶️',name:'יוטיוב',sb:'בלי פרסומות',yt:1}],[]];
  Z.order.forEach(function(id){var s=Z.screens[id];if(s.row===1)rows[0].push(s);else if(s.row===2)rows[1].push(s)});
  var n=1;['row1','row2'].forEach(function(rid,ri){var h='';rows[ri].forEach(function(t){h+=tileHtml(t,n++)});Z.$(rid).innerHTML=h})}
function paint(){for(var r=0;r<2;r++)for(var c=0;c<rows[r].length;c++){var e=Z.$('t_'+rows[r][c].id);if(e)e.className='tile'+(r===fr&&c===fc?' f':'')}}
function move(dr,dc){fr=Math.max(0,Math.min(1,fr+dr));fc=Math.max(0,Math.min(rows[fr].length-1,fc+dc));paint();Z.sfx('move')}
function open(t){if(!t)return;Z.sfx('ok');if(t.yt){Z.launchModule('tizentube');return}Z.show(t.id)}
function flat(i){var a=rows[0].concat(rows[1]);return a[i]}
function tick(){var d=new Date();Z.$('hClock').innerHTML=Z.hhmm(d);Z.$('greet').textContent=Z.greet(d.getHours());Z.$('hHeb').textContent=Z.heb(d);Z.$('hGreg').textContent=Z.greg(d)}
function wday(d){return ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'][d.getDay()]}
function data(){var w=Z.data.wx,zm=Z.data.zm,h;
  if(w){var c=w.current,x=Z.wx(c.weather_code);Z.$('wxNow').innerHTML=Math.round(c.temperature_2m)+'°<i>'+x[0]+'</i>';Z.$('wxDesc').textContent='פתח תקווה · '+x[1]+' · לחות '+c.relative_humidity_2m+'%';
   h='';for(var i=1;i<4;i++){var dt=new Date(w.daily.time[i]+'T12:00');h+='<div class="wx-d">'+wday(dt)+'<b>'+Z.wx(w.daily.weather_code[i])[0]+'</b>'+Math.round(w.daily.temperature_2m_max[i])+'°/'+Math.round(w.daily.temperature_2m_min[i])+'°</div>'}Z.$('wxDays').innerHTML=h}
  h='';if(zm)h+='<div class="chip">🌅 זריחה <b>'+Z.tm(zm.sunrise)+'</b></div><div class="chip">🌇 שקיעה <b>'+Z.tm(zm.sunset)+'</b></div>';
  var p=Z.parasha();if(p)h+='<div class="chip">📖 <b>'+p+'</b></div>';
  var nc=Z.nextCandles();if(nc){var cd=new Date(nc.date),ms=cd-Date.now();h+=ms<12*3600000?'<div class="chip">🕯️ כניסת שבת בעוד <b>'+Math.floor(ms/3600000)+':'+Z.pad(Math.floor(ms%3600000/60000))+'</b></div>':'<div class="chip">🕯️ הדלקת נרות <b>'+wday(cd)+' '+Z.hhmm(cd)+'</b></div>'}
  var ch=Z.chanukahTonight();if(ch)h+='<div class="chip">🕎 הלילה <b>נר '+ch+'</b> של חנוכה</div>';
  var hs=Z.holidays();if(hs[0]){var dd=Z.daysTo(hs[0].date);h+='<div class="chip">🎉 '+hs[0].name+' <b>'+(dd<=0?'היום':dd===1?'מחר':'בעוד '+dd+' ימים')+'</b></div>'}
  Z.$('chips').innerHTML=h;checkShabbat()}
function checkShabbat(){var hv=Z.inShabbat();if(hv&&Z.cur==='home'&&Z.get('shDone','')!==hv.date){Z.set('shDone',hv.date);Z.show('shabbat')}}
document.addEventListener('keydown',function(e){var k=e.keyCode;Z.idle=Date.now();Z.ac();
  if(Z.cur!=='home'){var s=Z.screens[Z.cur],r=false;if(s&&s.key){try{r=s.key(k)}catch(x){}}if(r){e.preventDefault();return}
   if(k===10009||k===27||k===8||k===48){Z.sfx('back');Z.show('home');e.preventDefault()}return}
  if(k===37)move(0,1);else if(k===39)move(0,-1);else if(k===38)move(-1,0);else if(k===40)move(1,0);else if(k===13)open(rows[fr][fc]);else if(k>=49&&k<=57)open(flat(k-49));else return;e.preventDefault()});
Z.init=function(){if(!Z.$('s_home')){var hw=document.createElement('div');hw.innerHTML='<section class="screen on" id="s_home"><canvas class="full" id="c_home"></canvas>  <div class="brand">ZSTORE <b>TV</b></div>  <div class="h-top sh">    <div><div class="greet" id="greet"></div><div class="clock" id="hClock">--:--</div><div class="dates"><span class="hd" id="hHeb"></span> · <span id="hGreg"></span></div><div class="chips" id="chips"></div></div>    <div class="wx"><div class="wx-now" id="wxNow">--°</div><div class="wx-desc" id="wxDesc">פתח תקווה</div><div class="wx-days" id="wxDays"></div></div>  </div>  <div class="grid"><div class="rt">צפייה ואווירה</div><div class="row" id="row1"></div><div class="rt">החדר שלי</div><div class="row" id="row2"></div></div>  <div class="hint">חיצים לבחירה · OK לפתיחה · מספרים לקיצור · חזור = בית</div></section>';document.body.insertBefore(hw.firstChild,Z.$('screens'))}try{if(window.tizen&&tizen.tvinputdevice)['0','1','2','3','4','5','6','7','8','9','ColorF0Red','ColorF1Green','ColorF2Yellow','ColorF3Blue','MediaPlayPause'].forEach(function(k){try{tizen.tvinputdevice.registerKey(k)}catch(x){}})}catch(x){}
  Z.build();buildTiles();paint();tick();setInterval(tick,1000);Z.on(data);Z.load();setInterval(Z.load,30*60000);setInterval(function(){data();if(Z.cur==='home'&&Date.now()-Z.idle>15*60000)Z.show('gallery')},30000);
  var m=/[?&]mode=(\w+)/.exec(location.search),d=new Date(),today=Z.ymd(d);
  if(m&&Z.screens[m[1]])Z.show(m[1]);else Z.show('home');
  setTimeout(function(){Z.$('boot').className='gone'},2700)};
})();