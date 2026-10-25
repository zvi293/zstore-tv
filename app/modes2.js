/* Zstore TV 2.0 - modes B: focus + generative lofi, breathing, holidays */
(function(){
/* generative lofi engine */
var L=null;
function mtof(m){return 440*Math.pow(2,(m-69)/12)}
Z.lofi={on:function(){return !!L},start:function(){var a=Z.ac();if(!a||L)return;L={};var M=a.createGain();M.gain.setValueAtTime(.0001,a.currentTime);M.gain.exponentialRampToValueAtTime(.55,a.currentTime+2.5);M.connect(a.destination);L.M=M;
  var lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1600;lp.connect(M);
  var n=a.sampleRate*2,b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(var i=0;i<n;i++)d[i]=Math.random()<.0009?(Math.random()*2-1)*.5:(Math.random()*2-1)*.01;
  var cr=a.createBufferSource();cr.buffer=b;cr.loop=true;cr.connect(M);cr.start();L.cr=cr;var nb=Z.noise(.4);
  var CH=[[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]],SC=[72,74,76,79,81,84],beat=60/74,step=0,next=a.currentTime+.15;
  function note(f,t,dur,type,vol){var o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.06);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(lp);o.start(t);o.stop(t+dur+.05)}
  function perc(t,ft,fq,v,dur){var s=a.createBufferSource();s.buffer=nb;var f=a.createBiquadFilter();f.type=ft;f.frequency.value=fq;var g=a.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(M);s.start(t);s.stop(t+dur+.02)}
  function kick(t){var o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(42,t+.14);g.gain.setValueAtTime(.55,t);g.gain.exponentialRampToValueAtTime(.001,t+.32);o.connect(g);g.connect(M);o.start(t);o.stop(t+.33)}
  L.iv=setInterval(function(){while(next<a.currentTime+.35){var bar=Math.floor(step/8)%4,pos=step%8,t=next+(pos%2?beat*.06:0);
    if(pos===0){CH[bar].forEach(function(m){note(mtof(m),t,beat*4.3,'triangle',.045)});note(mtof(CH[bar][0]-12),t,beat*3.6,'sine',.13)}
    if(pos===0||pos===5)kick(t);if(pos===2||pos===6)perc(t,'bandpass',1700,.22,.16);perc(t,'highpass',7000,pos%2?.035:.06,.05);
    if(pos%2===0&&Math.random()<.4)note(mtof(SC[Math.floor(Math.random()*SC.length)]),t,beat*1.3,'sine',.035);
    step++;next+=beat/2}},90)},
 stop:function(){if(!L)return;var a=Z.ac(),l=L;L=null;clearInterval(l.iv);try{l.M.gain.cancelScheduledValues(a.currentTime);l.M.gain.setValueAtTime(l.M.gain.value,a.currentTime);l.M.gain.exponentialRampToValueAtTime(.0001,a.currentTime+1.2)}catch(e){}
  setTimeout(function(){try{l.cr.stop()}catch(e){}try{l.M.disconnect()}catch(e){}},1400)}};

var F={work:25,brk:5,ph:'work',left:1500,run:false,iv:null};
function fp(){var tot=(F.ph==='work'?F.work:F.brk)*60;Z.$('fT').textContent=Z.pad(Math.floor(F.left/60))+':'+Z.pad(F.left%60);var r=Z.$('fR');r.setAttribute('stroke-dashoffset',(565.5*(1-F.left/tot)).toFixed(1));r.setAttribute('stroke',F.ph==='work'?'#ff7a45':'#06d6a0');
 Z.$('fS').textContent=(F.ph==='work'?'זמן עבודה':'הפסקה')+' · '+(F.run?'OK להשהיה':'OK להתחלה');Z.$('fM').textContent='▲ מוזיקת לו-פיי: '+(Z.lofi.on()?'פועלת 🎵':'כבויה')+'   ·   ▼ איפוס'}
function ft(){F.run=!F.run;clearInterval(F.iv);if(F.run)F.iv=setInterval(function(){F.left--;if(F.left<=0){Z.sfx('chime');F.ph=F.ph==='work'?'brk':'work';F.left=(F.ph==='work'?F.work:F.brk)*60;Z.toast(F.ph==='work'?'חוזרים לעבודה 💪':'הפסקה ☕')}fp()},1000);fp()}
Z.add({id:'focus',name:'פוקוס לו-פיי',icon:'🎧',sb:'פומודורו + מוזיקה',row:2,canvas:1,
 html:'<div class="center"><svg class="ring" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,.08)"/><circle id="fR" cx="100" cy="100" r="90" stroke="#ff7a45" stroke-linecap="round" transform="rotate(-90 100 100)" stroke-dasharray="565.5" stroke-dashoffset="0"/></svg><div style="position:absolute;text-align:center"><div class="big" id="fT" style="font-size:7vw">25:00</div><div class="sub" id="fS"></div></div></div><div class="cap" id="fM"></div>',
 start:function(s,cv){var g=Z.cv(cv),W=cv.width,H=cv.height,D=[];for(var i=0;i<90;i++)D.push({x:Math.random(),y:Math.random(),v:.004+Math.random()*.006});fp();
  this._s=Z.loop(function(t){var bg=g.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#1a1330');bg.addColorStop(1,'#0b0a16');g.fillStyle=bg;g.fillRect(0,0,W,H);
   var wx=W*.06,wy=H*.12,ww=W*.2,wh=H*.42;g.fillStyle='#0f1a33';g.fillRect(wx,wy,ww,wh);g.strokeStyle='rgba(170,200,255,.4)';g.lineWidth=1.2;g.beginPath();D.forEach(function(d){d.y+=d.v;if(d.y>1)d.y=0;g.moveTo(wx+d.x*ww,wy+d.y*wh);g.lineTo(wx+d.x*ww-2,wy+d.y*wh+12)});g.stroke();
   g.strokeStyle='#2c2445';g.lineWidth=10;g.strokeRect(wx,wy,ww,wh);g.beginPath();g.moveTo(wx+ww/2,wy);g.lineTo(wx+ww/2,wy+wh);g.stroke();
   var lx=W*.86,ly=H*.55,pl=.8+Math.sin(t/1500)*.08,lg=g.createRadialGradient(lx,ly,0,lx,ly,H*.5*pl);lg.addColorStop(0,'rgba(255,190,110,.32)');lg.addColorStop(1,'rgba(255,190,110,0)');g.fillStyle=lg;g.fillRect(lx-H*.5,ly-H*.5,H,H);
   g.fillStyle='#ffcf8a';g.beginPath();g.moveTo(lx-W*.03,ly);g.lineTo(lx+W*.03,ly);g.lineTo(lx+W*.018,ly-H*.07);g.lineTo(lx-W*.018,ly-H*.07);g.fill();g.fillStyle='#2c2445';g.fillRect(lx-3,ly,6,H*.25)},20)},
 stop:function(){if(this._s)this._s()},
 key:function(k){if(k===13||k===10252){ft();return true}if(k===38){if(Z.lofi.on())Z.lofi.stop();else Z.lofi.start();setTimeout(fp,50);return true}
  if(k===40){F.run=false;clearInterval(F.iv);F.ph='work';F.left=F.work*60;fp();return true}}});

var PH=[['שאיפה',4,'#7bdff2'],['החזקה',7,'#b2f7ef'],['נשיפה',8,'#cdb4db']];
Z.add({id:'breathe',name:'נשימה',icon:'🫧',sb:'4-7-8 להירגעות',row:2,canvas:1,html:'<div class="center"><div class="ttl sh" id="brT"></div><div class="sub" id="brS"></div></div><div class="cap">OK = התחל מחדש</div>',
 start:function(s,cv){var g=Z.cv(cv),W=cv.width,H=cv.height,t0=Date.now(),last=-1,cyc=0,self=this;this._r=function(){t0=Date.now();last=-1;cyc=0};
  this._s=Z.loop(function(){var el=(Date.now()-t0)/1000,c=19,inC=el%c,ci=Math.floor(el/c),p=inC<4?0:inC<11?1:2,pt=p===0?inC/4:p===1?1:1-(inC-11)/8;
   if(p!==last){last=p;Z.sfx('soft');if(p===0&&ci>0){cyc=ci;if(cyc===8)Z.toast('כל הכבוד, 8 מחזורים 🌙')}}
   var bg=g.createRadialGradient(W/2,H/2,0,W/2,H/2,H);bg.addColorStop(0,'#0d2a35');bg.addColorStop(1,'#04070d');g.fillStyle=bg;g.fillRect(0,0,W,H);
   var e=pt*pt*(3-2*pt),R=H*(.13+.2*e),gr=g.createRadialGradient(W/2,H/2,R*.2,W/2,H/2,R*1.4);gr.addColorStop(0,PH[p][2]+'66');gr.addColorStop(.7,PH[p][2]+'22');gr.addColorStop(1,PH[p][2]+'00');
   g.fillStyle=gr;g.beginPath();g.arc(W/2,H/2,R*1.4,0,6.283);g.fill();g.strokeStyle=PH[p][2];g.lineWidth=3;g.beginPath();g.arc(W/2,H/2,R,0,6.283);g.stroke();
   Z.$('brT').textContent=PH[p][0];Z.$('brS').textContent=Math.ceil(p===0?4-inC:p===1?11-inC:19-inC)+' · מחזור '+(ci+1)},30)},
 stop:function(){if(this._s)this._s()},key:function(k){if(k===13){this._r();return true}}});

function menorah(g,W,H,t,n){var bx=W/2,by=H*.8,sp=W*.075,i;g.strokeStyle='#d4a940';g.lineWidth=H*.012;g.lineCap='round';
 g.beginPath();g.moveTo(bx,by);g.lineTo(bx,H*.42);g.stroke();for(i=1;i<=4;i++){var r=i*sp;g.beginPath();g.moveTo(bx-r,H*.46);g.quadraticCurveTo(bx-r,by-H*.02,bx,by-H*.02);g.moveTo(bx+r,H*.46);g.quadraticCurveTo(bx+r,by-H*.02,bx,by-H*.02);g.stroke()}
 g.fillStyle='#b8902f';g.fillRect(bx-W*.08,by,W*.16,H*.03);
 var pos=[];for(i=4;i>=1;i--)pos.push(bx+i*sp);for(i=1;i<=4;i++)pos.push(bx-i*sp);
 function flame(x,y,ph){var f=1+Math.sin(t/70+ph)*.07+Math.random()*.06,gl=g.createRadialGradient(x,y-H*.03,0,x,y-H*.03,H*.11*f);gl.addColorStop(0,'rgba(255,200,100,.5)');gl.addColorStop(1,'rgba(255,150,50,0)');g.fillStyle=gl;g.fillRect(x-H*.12,y-H*.15,H*.24,H*.24);
  g.save();g.translate(x,y);g.scale(1,f);var fg=g.createRadialGradient(0,-H*.02,0,0,-H*.02,H*.035);fg.addColorStop(0,'#fff7da');fg.addColorStop(.45,'#ffc24d');fg.addColorStop(1,'rgba(255,110,20,0)');g.fillStyle=fg;g.beginPath();g.moveTo(0,-H*.06);g.quadraticCurveTo(W*.009,-H*.02,0,0);g.quadraticCurveTo(-W*.009,-H*.02,0,-H*.06);g.fill();g.restore()}
 function candle(x,y,lit,ph){g.fillStyle=lit?'#f5efe2':'rgba(245,239,226,.25)';g.fillRect(x-W*.007,y-H*.08,W*.014,H*.08);if(lit)flame(x,y-H*.08,ph)}
 candle(bx,H*.4,true,9);for(i=0;i<8;i++)candle(pos[i],H*.46,i<n,i)}
Z.add({id:'hag',name:'חגים',icon:'🕎',sb:'ספירה לאחור',row:2,canvas:1,html:'<div class="center" id="hgC"></div><div class="cap" id="hgCap"></div>',
 start:function(s,cv){var g=Z.cv(cv),W=cv.width,H=cv.height,self=this;self._n=Z.chanukahTonight();self._prev=false;
  function txt(){var n=self._prev?8:self._n,c=Z.$('hgC');
   if(n){c.innerHTML='<div class="ttl sh" style="margin-top:-38vw;color:#ffd9a8">חנוכה שמח</div><div class="sub">'+(self._prev?'תצוגה מקדימה · 8 נרות':'הלילה מדליקים '+n+' נרות')+'</div>';Z.$('hgCap').textContent=self._prev?'OK = חזרה':'';return}
   var hs=Z.holidays(),x=hs[0];if(!x){c.innerHTML='<div class="sub">טוען לוח חגים…</div>';return}var d=Z.daysTo(x.date),h='<div class="sub" style="font-size:2vw">החג הבא</div><div class="ttl sh" style="font-size:6vw">'+x.name+'</div><div class="big sh" style="font-size:10vw">'+(d<=0?'היום!':d)+'</div><div class="sub">'+(d>0?'ימים':'')+'</div><div class="panel" style="margin-top:2vw;min-width:40vw">';
   hs.slice(1,6).forEach(function(y){var dd=Z.daysTo(y.date);h+='<div class="bl"><span>'+y.name+'</span><b>'+(dd===1?'מחר':dd+' ימים')+'</b></div>'});c.innerHTML=h+'</div>';Z.$('hgCap').textContent='OK = תצוגה מקדימה של החנוכייה'}
  this._txt=txt;txt();Z.on(function(){if(Z.cur==='hag'){self._n=Z.chanukahTonight();txt()}});
  this._s=Z.loop(function(t){var n=self._prev?8:self._n,bg=g.createRadialGradient(W/2,H*.7,0,W/2,H*.7,H);bg.addColorStop(0,n?'#2a1a3a':'#14183a');bg.addColorStop(1,'#05060b');g.fillStyle=bg;g.fillRect(0,0,W,H);if(n)menorah(g,W,H,t,n)},30)},
 stop:function(){if(this._s)this._s()},key:function(k){if(k===13){this._prev=!this._prev;this._txt();Z.sfx('ok');return true}}});
})();