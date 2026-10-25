/* Zstore TV 2.0 - trivia */
(function(){
var Q=[["מהי בירת אוסטרליה?","קנברה","סידני","מלבורן","פרת׳"],["כמה רגליים יש לעכביש?","8","6","10","12"],["מהו כוכב הלכת הגדול במערכת השמש?","צדק","שבתאי","נפטון","כדור הארץ"],
["מי צייר את המונה ליזה?","לאונרדו דה וינצ׳י","מיכלאנג׳לו","רפאל","ון גוך"],["כמה ימים יש בשנה מעוברת לועזית?","366","365","364","360"],["באיזו שנה הוכרזה מדינת ישראל?","1948","1947","1949","1956"],
["מהו הנהר הארוך ביותר בישראל?","הירדן","הירקון","הקישון","נחל שורק"],["איזה יסוד כימי מסומן באות O?","חמצן","זהב","אוסמיום","כסף"],["כמה שחקנים יש לקבוצת כדורגל על המגרש?","11","10","9","12"],
["מהו ההר הגבוה בעולם?","האוורסט","K2","קילימנג׳רו","מון בלאן"],["כמה צלעות יש למשושה?","6","5","8","7"],["מהו היונק הגדול בעולם?","לווייתן כחול","פיל אפריקני","ג׳ירפה","היפופוטם"],
["באיזו עיר נמצא מגדל אייפל?","פריז","לונדון","רומא","ברלין"],["מהי בירת יפן?","טוקיו","קיוטו","אוסקה","סיאול"],["כמה דקות יש ביממה?","1440","1240","1600","1340"],
["מי היה ראש הממשלה הראשון של ישראל?","דוד בן-גוריון","גולדה מאיר","מנחם בגין","לוי אשכול"],["איזו שפת תכנות הדפדפן מריץ באופן מובנה?","JavaScript","Python","C++","Java"],
["כמה נרות דולקים בלילה האחרון של חנוכה, כולל השמש?","9","8","7","10"],["איזה צבע מתקבל מערבוב כחול וצהוב?","ירוק","סגול","כתום","חום"],["מהי היבשת הגדולה בעולם?","אסיה","אפריקה","אמריקה הצפונית","אירופה"],
["כמה מיתרים יש לגיטרה רגילה?","6","4","5","7"],["איזה גז הצמחים קולטים מהאוויר לפוטוסינתזה?","פחמן דו-חמצני","חמצן","חנקן","הליום"],["מהי המדינה הגדולה בעולם בשטחה?","רוסיה","קנדה","סין","ארה״ב"],
["כמה חומשים יש בתורה?","5","4","6","7"],["באיזה חודש עברי חל ראש השנה?","תשרי","ניסן","אלול","חשוון"],["כמה שבטים היו לעם ישראל?","12","10","7","13"],
["איזה כוכב לכת מכונה ׳הכוכב האדום׳?","מאדים","נוגה","צדק","כוכב חמה"],["מהי בירת איטליה?","רומא","מילאנו","ונציה","נאפולי"],["כמה שניות יש בשעה?","3600","6000","360","1800"],
["מי כתב את מילות ׳התקווה׳?","נפתלי הרץ אימבר","חיים נחמן ביאליק","נתן אלתרמן","רחל המשוררת"],["מהי העיר הגדולה בישראל באוכלוסייתה?","ירושלים","תל אביב-יפו","חיפה","ראשון לציון"],
["כמה עצמות יש בגוף של אדם בוגר?","206","186","226","300"],["מהו האוקיינוס הגדול בעולם?","השקט","האטלנטי","ההודי","הארקטי"],["כמה צבעים יש בקשת בענן?","7","5","6","8"]];
var G={};
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function render(){var q=G.qs[G.i],h='<div class="tscore">⭐ '+G.score+' / '+G.qs.length+'</div><div class="tq"><div class="qn">שאלה '+(G.i+1)+' מתוך '+G.qs.length+'</div><div class="qt">'+q.q+'</div><div class="tbar"><i id="tvB"></i></div></div><div class="topts">';
 q.o.forEach(function(o,i){h+='<div class="topt" id="tvO'+i+'"><b>'+(i+1)+'</b>'+o+'</div>'});Z.$('tvW').innerHTML=h+'</div>';G.f=0;paint();G.t0=Date.now();G.lock=false}
function paint(){for(var i=0;i<4;i++){var e=Z.$('tvO'+i);if(e&&!G.lock)e.className='topt'+(i===G.f?' f':'')}}
function answer(i){if(G.lock)return;G.lock=true;var q=G.qs[G.i],ok=i===q.a;for(var j=0;j<4;j++){var e=Z.$('tvO'+j);e.className='topt'+(j===q.a?' ok':(j===i?' no':''))}
 if(ok){G.score++;Z.sfx('good')}else Z.sfx('bad');setTimeout(function(){G.i++;if(G.i>=G.qs.length)end();else render()},1700)}
function end(){G.done=true;var p=G.score/G.qs.length,m=p===1?'מושלם! 🏆':p>=.7?'מצוין! 🔥':p>=.4?'לא רע בכלל 👏':'בפעם הבאה 😉';var best=Z.get('trBest',0);if(G.score>best){Z.set('trBest',G.score);best=G.score}
 Z.$('tvW').innerHTML='<div class="center"><div class="ttl sh">'+m+'</div><div class="big sh" style="font-size:10vw">'+G.score+'/'+G.qs.length+'</div><div class="sub">שיא: '+best+' · OK = משחק חדש</div></div>';Z.sfx('chime')}
function newGame(){var pool=shuffle(Q.slice()).slice(0,10);G={i:0,score:0,done:false,qs:pool.map(function(r){var o=shuffle([r[1],r[2],r[3],r[4]]);return {q:r[0],o:o,a:o.indexOf(r[1])}})};render()}
Z.add({id:'trivia',name:'טריוויה',icon:'🧠',sb:'10 שאלות, 20 שניות',row:2,canvas:1,html:'<div class="ov" id="tvW"></div>',
 start:function(s,cv){var g=Z.cv(cv),W=cv.width,H=cv.height;newGame();
  this._s=Z.loop(function(t){var bg=g.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#1b1440');bg.addColorStop(1,'#3a1030');g.fillStyle=bg;g.fillRect(0,0,W,H);
   for(var i=0;i<6;i++){var x=W*(.1+i*.17)+Math.sin(t/3000+i)*60,y=H*(.5+.35*Math.sin(t/4000+i*1.3)),r=H*.3,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,i%2?'rgba(255,122,69,.12)':'rgba(124,92,255,.14)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2)}
   if(!G.done&&!G.lock&&G.t0){var k=1-(Date.now()-G.t0)/20000,b=Z.$('tvB');if(b)b.style.width=Math.max(0,k*100)+'%';if(k<=0)answer(-1)}},30)},
 stop:function(){if(this._s)this._s()},
 key:function(k){if(G.done){if(k===13){newGame();return true}return false}if(k>=49&&k<=52){answer(k-49);return true}
  if(k===39||k===37){G.f=G.f^1;paint();Z.sfx('move');return true}if(k===38||k===40){G.f=G.f^2;paint();Z.sfx('move');return true}if(k===13){answer(G.f);return true}}});
})();