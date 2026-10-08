/* Kalenderberechnung: reine Datumslogik, keine medizinischen Empfehlungen. */
(function(root){
'use strict';
const day=s=>Date.parse(s+'T00:00:00Z')/86400000;
const iso=n=>new Date(n*86400000).toISOString().slice(0,10);
const add=(s,n)=>iso(day(s)+n);
const valid=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(day(s))&&iso(day(s))===s;
function validate(r){
 if(!['daily','weekdays','days','weeks','individual'].includes(r.mode)||!['date','count','none'].includes(r.endMode))throw Error('Unbekannter Rhythmus oder Umfang.');
 if(!r.name?.trim()||!valid(r.start))throw Error('Bitte Bezeichnung und gültigen Beginn eintragen.');
 if(!r.times?.length||r.times.some(t=>!/^([01]\d|2[0-3]):[0-5]\d$/.test(t)))throw Error('Uhrzeiten bitte als 18:00 eingeben, mehrere mit Komma trennen.');
 if(r.mode==='weekdays'&&!r.weekdays?.length)throw Error('Bitte mindestens einen Wochentag wählen.');
 if(['days','weeks'].includes(r.mode)&&(!Number.isInteger(r.interval)||r.interval<1||r.interval>3650))throw Error('Abstand muss eine ganze Zahl zwischen 1 und 3650 sein.');
 if(r.mode==='individual'&&(!r.dates?.length||r.dates.some(d=>!valid(d)||d<r.start)))throw Error('Bitte gültige individuelle Termine ab Beginn eintragen.');
 if(r.endMode==='date'&&(!valid(r.end)||r.end<r.start))throw Error('Das Ende muss am oder nach dem Beginn liegen.');
 if(r.endMode==='count'&&(!Number.isInteger(r.count)||r.count<1||r.count>100000))throw Error('Anzahl muss zwischen 1 und 100000 liegen.');
}
function matches(r,d){
 if(d<r.start)return false;
 const n=day(d)-day(r.start);
 if(r.mode==='daily')return true;
 if(r.mode==='weekdays')return r.weekdays.includes(new Date(d+'T00:00:00Z').getUTCDay());
 if(r.mode==='individual')return r.dates.includes(d);
 return n%(r.interval*(r.mode==='weeks'?7:1))===0;
}
function base(r,to){
 let result=[], index=0;
 const stop=r.endMode==='date'? (r.end<to?r.end:to):to;
 for(let n=day(r.start), end=day(stop);n<=end;n++){
  const d=iso(n);if(!matches(r,d))continue;
  for(const t of [...new Set(r.times)].sort()){
   if(r.endMode==='count'&&index>=r.count)return result;
   result.push({date:d,time:t,index:++index});
  }
 }
 return result;
}
function occurrences(p,from,to){
 let serial=0;
 const out=[], revisions=p.revisions||[], ex=p.exceptions||{};
 for(let i=0;i<revisions.length;i++){
  const r=revisions[i], next=revisions[i+1]?.effective;
  for(const b of base({...r,endMode:r.endMode==='count'?'none':r.endMode},add(to,1))){
   if(b.date<r.effective||next&&b.date>=next)continue;
   if(r.endMode==='count'&&serial>=r.count)continue;
   serial++;
   const key=b.date+'T'+b.time, override=ex[key]||{};
   const date=override.date||b.date,time=override.time||b.time;
   const paused=(p.pauses||[]).some(x=>b.date>=x.start&&(!x.end||b.date<=x.end));
   let status=override.status||'offen';
   if(status==='offen'&&(paused||p.stopped&&b.date>=p.stopped))status=paused?'pausiert':'beendet';
   if(date>=from&&date<=to)out.push({...b,date,time,key,planId:p.id,name:r.name,kind:r.kind,dose:override.dose??r.dose,note:override.note??r.note,status,actual:override.actual||'',deferred:!!override.deferred,medId:r.medId});
  }
 }
 // Moved occurrences outside the source window also belong to their destination.
 for(const [key,o] of Object.entries(ex))if(o.date&&o.date>=from&&o.date<=to&&!out.some(x=>x.key===key)){
  const d=key.slice(0,10),r=[...revisions].reverse().find(x=>x.effective<=d);
  if(r&&base(r,d).some(x=>x.date+'T'+x.time===key))out.push({key,planId:p.id,date:o.date,time:o.time||key.slice(11),name:r.name,kind:r.kind,dose:o.dose??r.dose,note:o.note??r.note,status:o.status||'offen',actual:o.actual||'',deferred:!!o.deferred});
 }
 return out.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
}
function summary(p,today){
 const first=p.revisions[0]?.start;if(!first)return {};
 const last=p.revisions.at(-1), horizon=last.endMode==='date'?last.end:last.endMode==='count'?add(last.start,Math.min(200000,last.count*(last.mode==='weeks'?last.interval*7:last.mode==='days'?last.interval:7))):add(today,366);
 const all=occurrences(p,first,horizon), planned=all.filter(x=>!['pausiert','beendet'].includes(x.status));
 const end=p.stopped?add(p.stopped,-1):last.endMode==='none'?null:all.at(-1)?.date||last.end;
 const total=end?Math.max(0,day(end)-day(first)+1):null,elapsed=Math.max(0,day(today)-day(first)+1);
 return {first,end,total,elapsed:total===null?elapsed:Math.min(total,elapsed),remaining:end?Math.max(0,day(end)-Math.max(day(today),day(first)-1)):null,count:last.endMode==='none'?null:all.filter(x=>x.status!=='beendet').length};
}
const api={day,iso,add,valid,validate,matches,base,occurrences,summary};
root.MBKalender=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
