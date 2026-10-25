/* Zstore TV 2.0 - scenes B: aurora, space, sleep */
(function(){
function ck(id){var e=Z.$(id+'k');if(e)e.textContent=Z.hhmm(new Date())}
Z.add({id:'aurora',name:'זוהר צפוני',icon:'🌌',sb:'לילה בצפון',row:1,canvas:1,html:'<div class="corner" id="aurorak"></div>',
 start:function(s,cv){var g=Z.cv(cv),W=cv.width,H=cv.height,stars=[],i,mt=[];
  for(i=0;i<300;i++)stars.push({x:Math.random()*W,y:Math.random()*H*.7,r:Math.random()*1.5+.3,p:Math.random()*6});
  for(i=0;i<=W;i+=40)mt.push(H*(.78+.08*Math.sin(i*.004)+.04*Math.sin(i*.013+1)+.02*Math.sin(i*.04)));
  var L=[{c:'80,255,170',y:.28,a:.0003,h:.32},{c:'120,200,255',y:.22,a:.0004,h:.26},{c:'200,120,255',y:.33,a:.00025,h:.2}];
  this._s=Z.loop(function(t){var gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#01030a');gr.addColorStop(1,'#0a1a2a');g.fillStyle=gr;g.fillRect(0,0,W,H);
   stars.forEach(function(s){g.fillStyle='rgba(255,255,255,'+(.4+.5*Math.sin(t/800+s.p)).toFixed(2)+')';g.fillRect(s.x,s.y,s.r,s.r)});
   g.globalCompositeOperation='lighter';
   L.forEach(function(l,li){var top=[],x;for(x=0;x<=W;x+=20)top.push(H*l.y+Math.sin(x*.0025+t*l.a)*H*.09+Math.sin(x*.009-t*l.a*1.7+li)*H*.035);
    var ag=g.createLinearGradient(0,H*(l.y-.12),0,H*(l.y+l.h+.1));ag.addColorStop(0,'rgba('+l.c+',0)');ag.addColorStop(.25,'rgba('+l.c+',.32)');ag.addColorStop(.6,'rgba('+l.c+',.1)');ag.addColorStop(1,'rgba('+l.c+',0)');
    g.fillStyle=ag;g.beginPath();g.moveTo(0,top[0]);for(x=1;x<top.length;x++)g.lineTo(x*20,top[x]);for(x=top.length-1;x>=0;x--)g.lineTo(x*20,top[x]+H*l.h*(.7+.3*Math.sin(x*.3+t*.001)));g.closePath();g.fill()});
   g.globalCompositeOperation='source-over';g.fillStyle='#02060a';g.beginPath();g.moveTo(0,H);for(i=0;i<mt.length;i++)g.lineTo(i*40,mt[i]);g.lineTo(W,H);g.fill();
   ck('aurora')},30)},stop:function(){if(this._s)this._s()}});

Z.add({id:'space',name:'מסע בחלל',icon:'🚀',sb:'מהירות האור',row:1,canvas:1,html:'<div class="corner" id="spacek"></div>',
 start:function(s,cv){var g=Z.cv(cv),W=cv.width,H=cv.height,cx=W/2,cy=H/2,S=[],i,sp=1;
  for(i=0;i<500;i++)S.push({x:Z.rnd(-W,W),y:Z.rnd(-H,H),z:Math.random()*W,pz:0});
  this._s=Z.loop(function(t){sp=1.2+Math.sin(t/6000)*1;g.fillStyle='rgba(2,2,10,.55)';g.fillRect(0,0,W,H);
   g.globalCompositeOperation='lighter';var nb=[[ '255,60,150',.3],['60,140,255',.7]];
   nb.forEach(function(n,j){var nx=cx+Math.sin(t/9000+j*3)*W*.3,ny=cy+Math.cos(t/11000+j)*H*.25,r=H*.7,ng=g.createRadialGradient(nx,ny,0,nx,ny,r);ng.addColorStop(0,'rgba('+n[0]+',.06)');ng.addColorStop(1,'rgba('+n[0]+',0)');g.fillStyle=ng;g.fillRect(nx-r,ny-r,r*2,r*2)});
   g.strokeStyle='rgba(220,230,255,.9)';g.lineCap='round';
   for(var i=0;i<S.length;i++){var s=S[i];s.pz=s.z;s.z-=sp*9;if(s.z<1){s.x=Z.rnd(-W,W);s.y=Z.rnd(-H,H);s.z=W;s.pz=W}
    var x=cx+s.x/s.z*W*.5,y=cy+s.y/s.z*H*.5,px=cx+s.x/s.pz*W*.5,py=cy+s.y/s.pz*H*.5;g.lineWidth=Math.max(.5,(1-s.z/W)*3.2);g.beginPath();g.moveTo(px,py);g.lineTo(x,y);g.stroke()}
   g.globalCompositeOperation='source-over';
   var plx=W*.82,ply=H*.72,pr=H*.13,pg=g.createRadialGradient(plx-pr*.4,ply-pr*.4,pr*.1,plx,ply,pr);pg.addColorStop(0,'#f6c28b');pg.addColorStop(1,'#5a2a1a');
   g.save();g.translate(plx,ply);g.rotate(-.35);g.strokeStyle='rgba(240,210,170,.55)';g.lineWidth=6;g.beginPath();g.ellipse(0,0,pr*1.9,pr*.45,0,Math.PI,6.283);g.stroke();g.restore();
   g.fillStyle=pg;g.beginPath();g.arc(plx,ply,pr,0,6.283);g.fill();
   g.save();g.translate(plx,ply);g.rotate(-.35);g.strokeStyle='rgba(240,210,170,.7)';g.lineWidth=6;g.beginPath();g.ellipse(0,0,pr*1.9,pr*.45,0,0,Math.PI);g.stroke();g.restore();
   ck('space')},30)},stop:function(){if(this._s)this._s()}});

var SLEEP_KEY='sleepMin';
Z.add({id:'sleep',name:'הירדמות',icon:'🌧️',sb:'גשם שנעלם לאט',row:2,canvas:1,html:'<div class="ov" id="slVeil" style="background:#000;opacity:0"></div><div class="cap" id="slInfo"></div>',
 start:function(s,cv){var g=Z.cv(cv),W=cv.width,H=cv.height,D=[],i,self=this,min=Z.get(SLEEP_KEY,30),t0=Date.now();
  for(i=0;i<450;i++)D.push({x:Math.random()*W,y:Math.random()*H,l:10+Math.random()*28,v:8+Math.random()*14});
  var a=Z.ac(),gn=null;if(a){try{var src=a.createBufferSource(),n=Math.floor(a.sampleRate*4),b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0),l=0;for(i=0;i<n;i++){var w=Math.random()*2-1;l=(l+.02*w)/1.02;d[i]=l*3.5}
   src.buffer=b;src.loop=true;var f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=1100;gn=a.createGain();gn.gain.value=.5;src.connect(f);f.connect(gn);gn.connect(a.destination);src.start();self._src=src}catch(e){}}
  function info(){var left=Math.max(0,Math.ceil(min-(Date.now()-t0)/60000));Z.$('slInfo').textContent=left>0?'נרדם בעוד '+left+' דק׳ · ▲▼ שינוי זמן':'לילה טוב 🌙'}
  this._set=function(m){min=m;t0=Date.now();Z.set(SLEEP_KEY,m);Z.toast('טיימר שינה: '+m+' דק׳');info()};this._min=function(){return min};
  info();this._iv=setInterval(function(){var k=Math.min(1,(Date.now()-t0)/(min*60000));Z.$('slVeil').style.opacity=(k*.98).toFixed(2);if(gn)gn.gain.value=.5*(1-k);info()},4000);
  this._s=Z.loop(function(){g.fillStyle='rgba(6,10,22,.45)';g.fillRect(0,0,W,H);g.strokeStyle='rgba(160,190,255,.33)';g.lineWidth=1.4;g.beginPath();
   for(var i=0;i<D.length;i++){var d=D[i];g.moveTo(d.x,d.y);g.lineTo(d.x-2,d.y+d.l);d.y+=d.v;d.x-=.6;if(d.y>H){d.y=-d.l;d.x=Math.random()*W}}g.stroke()},30)},
 stop:function(){if(this._s)this._s();clearInterval(this._iv);Z.$('slVeil').style.opacity=0;if(this._src){try{this._src.stop()}catch(e){}this._src=null}},
 key:function(k){if(k===38){this._set(Math.min(120,this._min()+10));return true}if(k===40){this._set(Math.max(10,this._min()-10));return true}}});
})();