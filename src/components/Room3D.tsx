'use client';
import {useEffect,useRef,useState} from 'react';
import type {ThreeRoomState,ThreeRoomCallbacks} from '../three/room-engine';
import {memories,photo} from '../data/memories';
import {shelfBooks} from '../data/books';
const shortcuts:[string,string,string,number?][]=[['frames','Frames','🖼️',1],['books','Bookshelf','📚'],['calls','Telephone','☎️'],['tv','TV','📺',3],['together','Photo album','📓',4],['portraits','Polaroids','🎞️',5],['cats','Pet the cat','🐈',9],['elephant','Elephant','🐘'],['calendar','Calendar','📅'],['drawer','Drawer','🗃️'],['wall-charm','Little star','✨'],['cake','Birthday cake','🎂',12],['camera','Take a photo','📷'],['lamp','Floor lamp','💡'],['window','Window','🪟']];
export function Room3D({state,onObject,onDial}:{state:ThreeRoomState;onObject:(id:string)=>void;onDial:()=>void}){
 const host=useRef<HTMLDivElement>(null),engine=useRef<ReturnType<typeof import('../three/room-engine').mountRoom>|null>(null);
 const latest=useRef({state,onObject,onDial});latest.current={state,onObject,onDial};
 const [ready,setReady]=useState(false),[error,setError]=useState(''),[hover,setHover]=useState('');
 useEffect(()=>{let cancelled=false;
  void import('../three/room-engine').then(async({mountRoom})=>{
   if(document.fonts?.load)await document.fonts.load('18px "Room Hand"').catch(()=>{});
   if(cancelled||!host.current)return;
   const fail=(message:string)=>{if(cancelled)return;setError(message);setTimeout(()=>{engine.current?.dispose();engine.current=null;},0);};
   const callbacks:ThreeRoomCallbacks={onObject:id=>latest.current.onObject(id),onDial:()=>latest.current.onDial(),onHover:setHover,onReady:()=>setReady(true),onError:fail};
   try{engine.current=mountRoom(host.current,latest.current.state,callbacks);engine.current.sync(latest.current.state);}catch{fail('This device works better with the lightweight room. All the little stories are still here.');}
  }).catch(()=>setError('The room is in lightweight mode. You can still explore.'));
  return()=>{cancelled=true;engine.current?.dispose();engine.current=null;};
 },[]);
 useEffect(()=>engine.current?.sync(state),[state]);
 const focused=state.focus;
 return <><div ref={host} className="room-three-canvas" inert={!state.entered||state.blocked}/>
 {state.entered&&!ready&&!error&&<p className="three-loading" role="status">The room is lighting up...</p>}
 {state.entered&&error&&<section className="room-fallback" aria-label="Lightweight room" inert={state.blocked}><p className="fallback-note">{error}</p>
 {!focused?<div className="fallback-grid">{shortcuts.map(([id,label,symbol,index])=><button key={id} onClick={()=>onObject(id)}>{index?<img src={photo(index).asset} alt=""/>:<span className="fallback-symbol">{symbol}</span>}{label}</button>)}</div>:focused==='books'?<div className="fallback-books">{shelfBooks.map(book=><p key={book.id}>{book.title}<small> · {book.author}</small></p>)}</div>:focused==='frames'?<img src={photo(state.frameIndex+1).asset} alt={photo(state.frameIndex+1).alt}/>:focused==='tv'?<><img src={memories[state.tvIndex].asset} alt={memories[state.tvIndex].alt}/><div className="object-controls"><button onClick={()=>onObject('tv-prev')}>Previous</button><button onClick={()=>onObject('tv-pause')}>{state.tvPaused?'Play':'Pause'}</button><button onClick={()=>onObject('tv-next')}>Next</button></div></>:focused==='calendar'?<p className="fallback-symbol">{state.calendarPage?'Tomorrow · 02':'Today · 01'}</p>:focused==='calls'?<button className="fallback-symbol" onClick={onDial} aria-label="Dial the telephone">☎️</button>:focused==='window'?<p>It's quiet by the window. The cat curls its tail into a question mark.</p>:<p>A tiny star is hiding in the drawer. ✨</p>}
 </section>}
 {state.entered&&ready&&!error&&!state.blocked&&!state.focus&&<p className="three-hover" aria-live="polite">{hover||<><span className="desktop-room-hint">Drag to look around · Click to explore</span><span className="mobile-room-hint">Pinch to zoom · Tap to explore</span></>}</p>}
 </>;
}
