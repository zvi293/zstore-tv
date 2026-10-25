/* Zstore TV 2.0 - scenes A: gallery, aquarium, fireplace */
(function(){
var CLK='<div class="corner" id="#ID#k"></div>';
function clockTick(id){var e=Z.$(id+'k');if(e)e.textContent=Z.hhmm(new Date())}
var PALS=[['#ff7a45','#7c5cff','#0b0f1f','#ffd166'],['#06d6a0','#118ab2','#062c3a','#ffd166'],['#ef476f','#ffd166','#1d3557','#06d6a0'],['#f4a261','#e76f51','#1b2f36','#2a9d8f'],['#c77dff','#7b2cbf','#10002b','#e0aaff'],['#ff006e','#3a86ff','#0b0b1e','#ffbe0b']];
Z.add({id:'gallery',name:'גלריה',icon:'🎨',sb:'אמנות חיה',row:1,canvas:1,html:CLK.replace('#ID#','gallery'),
 start:function(s,cv){var g=Z.cv(cv),W=cv.width,H=cv.height,t0=Date.now(),pal,orbs,last,style=0;
  function seed(){pal=PALS[Math.floor(Math.random()*PALS.length)];orbs=[];for(var i=0;i<8;i++)orbs.push({x:Math.random(),y:Math.random(),r:.22+Math.random()*.35,s:.00004+Math.random()*.00008,p:Math.random()*6.28,c:pal[i%4]});last=Date.now();style=(style+1)%2}
  seed();this._k=seed;
  this._s=Z.loop(function(t){var tt=Date.now()-t0;if(Date.now()-last>40000){seed();Z.toast('יצירה חדשה ✨')}
   g.globalCompositeOperation='source-over';g.fillStyle=pal[2];g.fillRect(0,0,W,H);g.globalCompositeOperation='lighter';
   if(style===0){orbs.forEach(function(o){var x=(o.x+Math.sin(tt*o.s+o.p)*.25)*W,y=(o.y+Math.cos(tt*o.s*1.3+o.p)*.22)*H,r=o.r*Math.max(W,H),gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,o.c+'aa');gr.addColorStop(1,o.c+'00');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,6.283);g.fill()})}
   else{g.lineWidth=3;for(var l=0;l<26;l++){var c=pal[l%4];g.strokeStyle=c+'55';g.beginPath();for(var x=0;x<=W;x+=24){var y=H*(.15+l*.028)+Math.sin(x*.004+tt*.0004+l*.4)*H*.08+Math.sin(x*.011-tt*.0006+l)*H*.025;if(x===0)g.moveTo(x,y);else g.lineTo(x,y)}g.stroke()}}
   clockTick('gallery')},30)},
 stop:function(){if(this._s)this._s()},key:function(k){if(k===13){this._k();Z.sfx('ok');return true}}});

Z.add({id:'aqua',name:'אקווריום',icon:'🐠',sb:'עולם תת-ימי',row:1,canvas:1,html:CLK.replace('#ID#','aqua'),
 start:function(s,cv){var g=Z.cv(cv),W=cv.width,H=cv.height,fish=[],bub=[],weed=[],i,cols=['#ff8c42','#ffd23f','#3bceac','#ee4266','#7b8cff','#f9f9f9','#ff5d8f'];
  for(i=0;i<16;i++)fish.push({x:Math.random()*W,y:H*(.12+Math.random()*.62),v:(.5+Math.random()*1.4)*(Math.random()<.5?-1:1),z:16+Math.random()*36,c:cols[i%cols.length],p:Math.random()*6});
  for(i=0;i<70;i++)bub.push({x:Math.random()*W,y:Math.random()*H,r:1+Math.random()*4,v:.4+Math.random()*1.2});
  for(i=0;i<22;i++)weed.push({x:Math.random()*W,h:H*(.12+Math.random()*.28),p:Math.random()*6,c:Math.random()<.5?'#1f7a5c':'#2fae7a'});
  this._s=Z.loop(function(t){var gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#0b5c8f');gr.addColorStop(.6,'#06315a');gr.addColorStop(1,'#021226');g.fillStyle=gr;g.fillRect(0,0,W,H);
   g.globalCompositeOperation='lighter';for(var r=0;r<6;r++){var x=(r*.18+.04)*W+Math.sin(t/4000+r)*70;g.fillStyle='rgba(140,210,255,0.04)';g.beginPath();g.moveTo(x,0);g.lineTo(x+110,0);g.lineTo(x+420,H);g.lineTo(x+200,H);g.fill()}g.globalCompositeOperation='source-over';
   g.fillStyle='#b89a5e';g.beginPath();g.moveTo(0,H);for(var sx=0;sx<=W;sx+=60)g.lineTo(sx,H*.9+Math.sin(sx/170)*12);g.lineTo(W,H);g.fill();
   g.lineCap='round';weed.forEach(function(w){g.strokeStyle=w.c;g.lineWidth=9;g.beginPath();g.moveTo(w.x,H*.92);for(var k=1;k<=10;k++)g.lineTo(w.x+Math.sin(t/900+w.p+k*.5)*k*2.4,H*.92-w.h*k/10);g.stroke()});
   fish.forEach(function(f){f.x+=f.v*1.6;if(f.x>W+90)f.x=-90;if(f.x<-90)f.x=W+90;var y=f.y+Math.sin(t/700+f.p)*12,d=f.v>0?1:-1,wg=Math.sin(t/110+f.p)*f.z*.18;
    g.save();g.translate(f.x,y);g.scale(d,1);g.fillStyle=f.c;g.beginPath();g.moveTo(-f.z*.75,0);g.lineTo(-f.z*1.5,-f.z*.48+wg);g.lineTo(-f.z*1.5,f.z*.48+wg);g.fill();
    g.beginPath();g.ellipse(0,0,f.z,f.z*.5,0,0,6.283);g.fill();g.fillStyle='rgba(255,255,255,.25)';g.beginPath();g.ellipse(f.z*.1,-f.z*.18,f.z*.55,f.z*.16,0,0,6.283);g.fill();
    g.fillStyle='#fff';g.beginPath();g.arc(f.z*.52,-f.z*.1,f.z*.12,0,6.283);g.fill();g.fillStyle='#111';g.beginPath();g.arc(f.z*.56,-f.z*.1,f.z*.06,0,6.283);g.fill();g.restore()});
   g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1.5;bub.forEach(function(b){b.y-=b.v;b.x+=Math.sin(t/500+b.r)*.5;if(b.y<-10){b.y=H+10;b.x=Math.random()*W}g.beginPath();g.arc(b.x,b.y,b.r,0,6.283);g.stroke()});
   clockTick('aqua')},30)},
 stop:function(){if(this._s)this._s()}});

Z.add({id:'fire',name:'אח בוערת',icon:'🔥',sb:'חום ופצפוצים',row:1,canvas:1,html:CLK.replace('#ID#','fire'),
 start:function(s,cv){var g=Z.cv(cv),W=cv.width,H=cv.height,P=[],E=[],cx=W/2,by=H*.78,self=this;
  var a=Z.ac();if(a){try{var m=a.createGain();m.gain.value=.0001;m.gain.exponentialRampToValueAtTime(.6,a.currentTime+2);m.connect(a.destination);
   var src=a.createBufferSource();src.buffer=Z.noise(3);src.loop=true;var lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=500;var rg=a.createGain();rg.gain.value=.18;src.connect(lp);lp.connect(rg);rg.connect(m);src.start();
   self._a={m:m,src:src,iv:setInterval(function(){if(Math.random()<.6){var t=a.currentTime,b=a.createBufferSource();b.buffer=Z.noise(.05);var f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=1500+Math.random()*2500;var gg=a.createGain();gg.gain.setValueAtTime(.3+Math.random()*.5,t);gg.gain.exponentialRampToValueAtTime(.001,t+.04);b.connect(f);f.connect(gg);gg.connect(m);b.start(t)}},140)}}catch(e){}}
  this._s=Z.loop(function(t){var fl=.85+Math.sin(t/90)*.05+Math.random()*.08;g.fillStyle='#120806';g.fillRect(0,0,W,H);
   var gl=g.createRadialGradient(cx,by,0,cx,by,H*.9*fl);gl.addColorStop(0,'rgba(255,120,40,.45)');gl.addColorStop(.4,'rgba(160,50,10,.18)');gl.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gl;g.fillRect(0,0,W,H);
   g.fillStyle='#1c0f0b';g.fillRect(cx-W*.3,by+H*.05,W*.6,H*.2);
   for(var i=0;i<14;i++)P.push({x:cx+Z.rnd(-W*.13,W*.13),y:by,vx:Z.rnd(-.6,.6),vy:Z.rnd(-5.5,-2.5),l:1,r:Z.rnd(18,46)});
   if(Math.random()<.35)E.push({x:cx+Z.rnd(-W*.1,W*.1),y:by-H*.1,vx:Z.rnd(-1,1),vy:Z.rnd(-3,-1.2),l:1});
   g.globalCompositeOperation='lighter';
   for(i=P.length-1;i>=0;i--){var p=P[i];p.x+=p.vx+Math.sin(t/200+p.y*.02)*.6;p.y+=p.vy;p.l-=.018;p.vx+=(cx-p.x)*.0008;if(p.l<=0){P.splice(i,1);continue}
    var r=p.r*p.l,fg=g.createRadialGradient(p.x,p.y,0,p.x,p.y,r);fg.addColorStop(0,'hsla('+(20+40*p.l)+',100%,'+(45+25*p.l)+'%,'+(.55*p.l)+')');fg.addColorStop(1,'hsla(10,100%,40%,0)');g.fillStyle=fg;g.fillRect(p.x-r,p.y-r,r*2,r*2)}
   for(i=E.length-1;i>=0;i--){var e=E[i];e.x+=e.vx+Math.sin(t/300+i)*.5;e.y+=e.vy;e.l-=.006;if(e.l<=0){E.splice(i,1);continue}g.fillStyle='rgba(255,'+Math.floor(150+90*e.l)+',80,'+e.l+')';g.fillRect(e.x,e.y,3,3)}
   g.globalCompositeOperation='source-over';
   g.fillStyle='#3b2416';g.save();g.translate(cx,by+H*.03);g.rotate(.12);g.fillRect(-W*.16,-H*.025,W*.32,H*.05);g.restore();g.save();g.translate(cx,by+H*.045);g.rotate(-.1);g.fillStyle='#4a2c1a';g.fillRect(-W*.15,-H*.025,W*.3,H*.05);g.restore();
   clockTick('fire')},30)},
 stop:function(){if(this._s)this._s();if(this._a){clearInterval(this._a.iv);try{this._a.src.stop()}catch(e){}try{this._a.m.disconnect()}catch(e){}this._a=null}}});
})();