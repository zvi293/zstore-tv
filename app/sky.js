/* Zstore TV 2.0 - live sky (home background) */
(function(){
function lerp(a,b,k){return a+(b-a)*k}
function hex(h){return [parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)]}
function mix(c1,c2,k){var a=hex(c1),b=hex(c2);return 'rgb('+Math.round(lerp(a[0],b[0],k))+','+Math.round(lerp(a[1],b[1],k))+','+Math.round(lerp(a[2],b[2],k))+')'}
function mix3(c,k){return [mix(c[0][0],c[1][0],k),mix(c[0][1],c[1][1],k),mix(c[0][2],c[1][2],k)]}
var P={night:['#03050f','#0a1030','#141a45'],dawn:['#1f2556','#8a4a7a','#ff9a62'],day:['#1d6fd1','#4f9be6','#a8d8f5'],dusk:['#2a1f52','#a3426a','#ff7a3d']};
function skyState(){var now=Date.now(),w=Z.data.wx,sr,ss;
  if(w&&w.daily){sr=new Date(w.daily.sunrise[0]).getTime();ss=new Date(w.daily.sunset[0]).getTime()}else{var d=new Date();d.setHours(6,0,0,0);sr=d.getTime();d.setHours(17,30,0,0);ss=d.getTime()}
  var T=45*60000,r={elev:0,night:0,cols:null,sunX:.5};
  if(now>=sr&&now<=ss){var s=(now-sr)/(ss-sr);r.elev=Math.sin(Math.PI*s);r.sunX=.12+.76*s;
    var k=Math.min(1,r.elev/.3);r.cols=s<.5?[mix(P.dawn[0],P.day[0],k),mix(P.dawn[1],P.day[1],k),mix(P.dawn[2],P.day[2],k)]:[mix(P.dusk[0],P.day[0],k),mix(P.dusk[1],P.day[1],k),mix(P.dusk[2],P.day[2],k)]}
  else if(now<sr&&now>sr-T){var k2=(sr-now)/T;r.night=k2;r.cols=[mix(P.dawn[0],P.night[0],k2),mix(P.dawn[1],P.night[1],k2),mix(P.dawn[2],P.night[2],k2)]}
  else if(now>ss&&now<ss+T){var k3=(now-ss)/T;r.night=k3;r.cols=[mix(P.dusk[0],P.night[0],k3),mix(P.dusk[1],P.night[1],k3),mix(P.dusk[2],P.night[2],k3)]}
  else{r.night=1;r.cols=P.night.slice()}
  var cc=w?w.current.cloud_cover/100:0;if(cc>.4){var g=cc*.45;r.cols=r.cols.map(function(c){var m=/rgb\((\d+),(\d+),(\d+)\)/.exec(c);if(!m)m=[0].concat(hex(c));var gr=(+m[1]+ +m[2]+ +m[3])/3;return 'rgb('+Math.round(lerp(+m[1],gr*.85,g))+','+Math.round(lerp(+m[2],gr*.85,g))+','+Math.round(lerp(+m[3],gr*.9,g))+')'})}
  r.cloud=cc;r.rain=Z.isRain();r.storm=w&&w.current.weather_code>=95;r.fog=w&&(w.current.weather_code===45||w.current.weather_code===48);return r}
var stopFn=null;
Z.sky={start:function(cv){var g=Z.cv(cv),W=cv.width,H=cv.height,i,stars=[],clouds=[],drops=[],flash=0;
  for(i=0;i<260;i++)stars.push({x:Math.random()*W,y:Math.random()*H*.75,r:Math.random()*1.6+.3,p:Math.random()*6.28});
  for(i=0;i<9;i++)clouds.push({x:Math.random()*W,y:H*(.06+Math.random()*.4),s:.15+Math.random()*.35,w:W*(.12+Math.random()*.16)});
  for(i=0;i<300;i++)drops.push({x:Math.random()*W,y:Math.random()*H,l:12+Math.random()*22,v:10+Math.random()*10});
  var sk=document.createElement('canvas');sk.width=W;sk.height=H;var sg=sk.getContext('2d'),bx=0,blds=[];
  while(bx<W){var bw=40+Math.random()*110,bh=H*(.06+Math.random()*.17);blds.push({x:bx,w:bw,h:bh});bx+=bw+2}
  function drawSkyline(night){sg.clearRect(0,0,W,H);sg.fillStyle=night>.5?'#05060c':'rgba(12,14,28,.92)';
    blds.forEach(function(b){sg.fillRect(b.x,H-b.h,b.w,b.h)});
    if(night>.3){for(var j=0;j<blds.length;j++){var b=blds[j];for(var wy=H-b.h+10;wy<H-8;wy+=16)for(var wx=b.x+6;wx<b.x+b.w-8;wx+=14)if(Math.random()<.22){sg.fillStyle='rgba(255,'+(190+Math.floor(Math.random()*50))+',120,'+(.35+Math.random()*.5)*night+')';sg.fillRect(wx,wy,6,8)}}}}
  var st=skyState(),lastS=0;drawSkyline(st.night);
  stopFn=Z.loop(function(t){if(t-lastS>60000){st=skyState();drawSkyline(st.night);lastS=t}
    var gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,st.cols[0]);gr.addColorStop(.55,st.cols[1]);gr.addColorStop(1,st.cols[2]);g.fillStyle=gr;g.fillRect(0,0,W,H);
    if(st.night>0){for(var i=0;i<stars.length;i++){var s=stars[i],a=(.45+.55*Math.sin(t/900+s.p))*st.night*(1-st.cloud*.8);if(a<=0)continue;g.fillStyle='rgba(255,255,255,'+a.toFixed(2)+')';g.fillRect(s.x,s.y,s.r,s.r)}
      var mx=W*.78,my=H*.2,mg=g.createRadialGradient(mx,my,0,mx,my,H*.14);mg.addColorStop(0,'rgba(255,250,230,'+(.35*st.night)+')');mg.addColorStop(1,'rgba(255,250,230,0)');g.fillStyle=mg;g.fillRect(mx-H*.15,my-H*.15,H*.3,H*.3);
      g.fillStyle='rgba(250,246,230,'+(.95*st.night)+')';g.beginPath();g.arc(mx,my,H*.035,0,6.283);g.fill();g.fillStyle=st.cols[0];g.beginPath();g.arc(mx+H*.014,my-H*.008,H*.032,0,6.283);g.fill()}
    if(st.elev>0){var sx=W*(1-st.sunX),sy=H*.82-st.elev*H*.62,R=H*(.05+.03*(1-st.elev)),sgd=g.createRadialGradient(sx,sy,0,sx,sy,R*6);
      sgd.addColorStop(0,'rgba(255,240,200,'+(.9-st.cloud*.6)+')');sgd.addColorStop(.18,'rgba(255,200,120,'+(.35-st.cloud*.25)+')');sgd.addColorStop(1,'rgba(255,170,90,0)');g.fillStyle=sgd;g.fillRect(sx-R*6,sy-R*6,R*12,R*12);
      g.fillStyle='rgba(255,247,225,'+(1-st.cloud*.7)+')';g.beginPath();g.arc(sx,sy,R,0,6.283);g.fill()}
    var nc=Math.round(st.cloud*clouds.length),cl=st.night>.5?'rgba(70,78,110,':'rgba(255,255,255,';
    for(i=0;i<nc;i++){var c=clouds[i];c.x+=c.s;if(c.x-c.w>W)c.x=-c.w;for(var p=0;p<5;p++){var px=c.x+(p-2)*c.w*.22,py=c.y+Math.sin(p*1.7)*c.w*.05,pr=c.w*(.18+.06*Math.sin(p*2.3)),cg=g.createRadialGradient(px,py,0,px,py,pr);
      cg.addColorStop(0,cl+(.42*(.6+st.cloud*.4))+')');cg.addColorStop(1,cl+'0)');g.fillStyle=cg;g.fillRect(px-pr,py-pr,pr*2,pr*2)}}
    if(st.fog){g.fillStyle='rgba(200,205,215,.25)';g.fillRect(0,H*.5,W,H*.5)}
    g.drawImage(sk,0,0);
    if(st.rain){g.strokeStyle='rgba(190,210,255,.35)';g.lineWidth=1.3;g.beginPath();for(i=0;i<drops.length;i++){var d=drops[i];g.moveTo(d.x,d.y);g.lineTo(d.x-3,d.y+d.l);d.y+=d.v;d.x-=1;if(d.y>H){d.y=-20;d.x=Math.random()*W*1.1}}g.stroke()}
    if(st.storm){if(flash<=0&&Math.random()<.004)flash=1;if(flash>0){g.fillStyle='rgba(230,235,255,'+(flash*.5)+')';g.fillRect(0,0,W,H);flash-=.08}}
  },30)},stop:function(){if(stopFn)stopFn();stopFn=null}};
})();