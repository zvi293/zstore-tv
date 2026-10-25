/* Zstore TV 2.0 - modes A: morning, clock, shabbat */
(function(){
function wday(d){return ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'][d.getDay()]}
function bl(l,v){return '<div class="bl"><span>'+l+'</span><b>'+v+'</b></div>'}
Z.add({id:'morning',name:'בוקר',icon:'🌅',sb:'זריחה + סיכום יום',row:2,
 html:'<div class="ov" id="mSky" style="background:#000"></div><div class="center" id="mSun"><div class="big sh" id="mClk" style="opacity:0"></div><div class="sub" id="mSub"></div></div><div class="brief" id="mBrief"></div><div class="cap" id="mCap"></div>',
 start:function(s,cv,arg){var self=this,min=Z.get('sunMin',15),t0=Date.now(),dur=min*60000;Z.$('mBrief').className='brief';Z.$('mSun').style.display='';
  Z.$('mSub').textContent='זריחה של '+min+' דקות · OK = לדלג לסיכום';Z.$('mCap').textContent='';
  function step(){var k=Math.min(1,(Date.now()-t0)/dur),e=k*k*(3-2*k),sky=Z.$('mSky');
   var top='hsl('+(230-200*e)+','+(40+40*e)+'%,'+(2+50*e)+'%)',mid='hsl('+(260-235*e)+','+(50+40*e)+'%,'+(3+48*e)+'%)',bot='hsl('+(20+22*e)+',95%,'+(4+60*e)+'%)';
   sky.style.background='radial-gradient(ellipse at 50% '+(118-38*e)+'%,'+bot+' 0%,'+mid+' 38%,'+top+' 78%)';
   var c=Z.$('mClk');c.textContent=Z.hhmm(new Date());c.style.opacity=(.12+.8*e).toFixed(2);
   if(k>=1){self._brief()}else self._t=setTimeout(step,1000)}
  this._brief=function(){clearTimeout(self._t);Z.$('mSky').style.background='radial-gradient(ellipse at 50% 80%,#ffd29a 0%,#f08a5d 35%,#5a8fd6 80%)';Z.$('mSun').style.display='none';
   var b=Z.$('mBrief');b.innerHTML=self._html();setTimeout(function(){b.className='brief on'},50);Z.sfx('chime');Z.$('mCap').textContent='חזור = מסך הבית'};
  this._html=function(){var d=new Date(),w=Z.data.wx,zm=Z.data.zm||{},h='<div class="bgrid">';
   h+='<div class="bcol panel"><div class="bh">היום</div><div style="font-size:3.2vw;font-weight:800">'+Z.greet(d.getHours())+' ☀️</div><div style="font-size:1.6vw;margin:.4vw 0 1vw">'+Z.greg(d)+'<br><span style="color:#ffd9a8">'+Z.heb(d)+'</span></div>';
   if(w){var c=w.current,dl=w.daily;h+=bl('עכשיו',Math.round(c.temperature_2m)+'° '+Z.wx(c.weather_code)[0])+bl('מקסימום / מינימום',Math.round(dl.temperature_2m_max[0])+'° / '+Math.round(dl.temperature_2m_min[0])+'°')+bl('סיכוי לגשם',(dl.precipitation_probability_max[0]||0)+'%')}
   h+='</div><div class="bcol panel"><div class="bh">זמני היום</div>'+bl('עלות השחר',Z.tm(zm.alotHaShachar))+bl('זריחה',Z.tm(zm.sunrise))+bl('סוף זמן ק״ש (גר״א)',Z.tm(zm.sofZmanShma))+bl('חצות היום',Z.tm(zm.chatzot))+bl('שקיעה',Z.tm(zm.sunset))+bl('צאת הכוכבים',Z.tm(zm.tzeit7083deg))+'</div>';
   h+='<div class="bcol panel"><div class="bh">השבוע</div>';var p=Z.parasha();if(p)h+=bl('פרשת השבוע',p.replace('פרשת ',''));var nc=Z.nextCandles();if(nc){var cd=new Date(nc.date);h+=bl('הדלקת נרות','יום '+wday(cd)+' '+Z.hhmm(cd))}
   Z.holidays().slice(0,3).forEach(function(x){var n=Z.daysTo(x.date);h+=bl(x.name,n===0?'היום!':n===1?'מחר':'בעוד '+n+' ימים')});return h+'</div></div>'};
  if(arg==='brief')this._brief();else step()},
 stop:function(){clearTimeout(this._t)},key:function(k){if(k===13){this._brief();return true}if(k===38||k===40){var m=Z.get('sunMin',15);m=k===38?Math.min(40,m+5):Math.max(5,m-5);Z.set('sunMin',m);Z.toast('זמן זריחה: '+m+' דק׳');return true}}});

Z.add({id:'clock',name:'שעון',icon:'🕰️',sb:'מסך שקט',row:2,html:'<div class="ov" style="background:#000"></div><div class="center" id="clW"><div class="big" id="clT" style="font-size:19vw;color:#d9d6cf"></div><div class="sub" id="clD" style="font-size:2vw"></div><div class="sub" id="clZ"></div></div>',
 start:function(){function tk(){var d=new Date();Z.$('clT').textContent=Z.hhmm(d);Z.$('clD').textContent=Z.greg(d)+'  ·  '+Z.heb(d);var zm=Z.data.zm||{},p=Z.parasha();
   Z.$('clZ').textContent='זריחה '+Z.tm(zm.sunrise)+'  ·  שקיעה '+Z.tm(zm.sunset)+(p?'  ·  '+p:'');if(d.getSeconds()===0){Z.$('clW').style.transform='translate('+Z.rnd(-20,20)+'px,'+Z.rnd(-15,15)+'px)'}}
  tk();this._iv=setInterval(tk,1000)},stop:function(){clearInterval(this._iv)}});

Z.add({id:'shabbat',row:0,canvas:1,html:'<div class="center"><div class="ttl sh" style="font-size:7vw;margin-top:-16vw">שבת שלום</div><div class="sub" id="shP" style="font-size:2.2vw;color:#ffd9a8"></div></div><div class="cap" id="shH"></div>',
 start:function(s,cv){var g=Z.cv(cv),W=cv.width,H=cv.height,hv=Z.inShabbat();Z.$('shP').textContent=Z.parasha()||'';Z.$('shH').textContent=hv?'הבדלה: '+Z.tm(hv.date):'';
  this._s=Z.loop(function(t){var bg=g.createRadialGradient(W/2,H*.75,0,W/2,H*.75,H);bg.addColorStop(0,'#3a2412');bg.addColorStop(1,'#07050a');g.fillStyle=bg;g.fillRect(0,0,W,H);
   [-1,1].forEach(function(sd){var x=W/2+sd*W*.08,base=H*.92,top=H*.6,f=1+Math.sin(t/80+sd)*.06+Math.random()*.05;
    var gl=g.createRadialGradient(x,top-H*.04,0,x,top-H*.04,H*.28*f);gl.addColorStop(0,'rgba(255,190,90,.45)');gl.addColorStop(1,'rgba(255,150,50,0)');g.fillStyle=gl;g.fillRect(x-H*.3,top-H*.34,H*.6,H*.6);
    g.fillStyle='#f2ece0';g.fillRect(x-W*.012,top,W*.024,base-top);g.fillStyle='#caa45a';g.fillRect(x-W*.03,base,W*.06,H*.02);
    g.save();g.translate(x,top-H*.005);g.scale(1,f);var fg=g.createRadialGradient(0,-H*.03,0,0,-H*.03,H*.05);fg.addColorStop(0,'#fff6d8');fg.addColorStop(.4,'#ffc04d');fg.addColorStop(1,'rgba(255,120,20,0)');g.fillStyle=fg;
    g.beginPath();g.moveTo(0,-H*.085);g.quadraticCurveTo(W*.014,-H*.03,0,0);g.quadraticCurveTo(-W*.014,-H*.03,0,-H*.085);g.fill();g.restore()})},30)},
 stop:function(){if(this._s)this._s()}});
})();