'use client';
import {useEffect,useRef,useState,type KeyboardEvent,type PointerEvent} from 'react';
import {Phone,ChevronRight,AudioLines} from 'lucide-react';
import {slideProgress} from '../lib/room-journey';
export type CallPhase='ringing'|'connected'|'transition'|'error';
export function IncomingCall({phase,seconds,muted,replaying=false,onAnswer,onContinue}:{replaying?:boolean;phase:CallPhase;seconds:number;muted:boolean;onAnswer:()=>void;onContinue:()=>void}){
 const screen=useRef<HTMLElement>(null);
 useEffect(()=>{screen.current?.focus({preventScroll:true});},[]);
 function trap(e:KeyboardEvent){if(e.key==='Escape'&&phase!=='transition'){onContinue();return;}if(e.key!=='Tab')return;const items=screen.current?.querySelectorAll<HTMLElement>('button,[role="slider"]');if(!items?.length){e.preventDefault();return;}const first=items[0],last=items[items.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===screen.current)){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===screen.current)){e.preventDefault();first.focus();}}
 const [progress,setProgress]=useState(0);const track=useRef<HTMLDivElement>(null),drag=useRef<{start:number;travel:number}|null>(null),value=useRef(0);
 const move=(p:number)=>{value.current=p;setProgress(p);};
 function start(e:PointerEvent<HTMLDivElement>){if(phase!=='ringing')return;const width=track.current?.clientWidth??300;drag.current={start:e.clientX,travel:width-68};e.currentTarget.setPointerCapture(e.pointerId);}
 function release(){if(!drag.current)return;drag.current=null;if(value.current>=.86){move(1);onAnswer();}else move(0);}
 function key(e:KeyboardEvent){if(phase!=='ringing')return;if(['Enter',' '].includes(e.key)){e.preventDefault();move(1);onAnswer();}else if(e.key==='ArrowRight'||e.key==='End'){e.preventDefault();const p=e.key==='End'?1:Math.min(1,value.current+.2);move(p);if(p===1)onAnswer();}else if(e.key==='ArrowLeft'||e.key==='Home'){e.preventDefault();move(e.key==='Home'?0:Math.max(0,value.current-.2));}}
 const timer=`${Math.floor(seconds/60).toString().padStart(2,'0')}:${Math.floor(seconds%60).toString().padStart(2,'0')}`;
 return <section ref={screen} tabIndex={-1} onKeyDown={trap} role="dialog" aria-modal="true" className={`incoming-screen call-${phase}`} aria-label="Voice call">
  <div className="caller-portrait" aria-hidden="true">🐘</div><h2>Claire ♡</h2>
  <p className="call-status" aria-live="polite">{phase==='ringing'?'Incoming call...':phase==='error'?"Call didn't connect":phase==='transition'?'Call continuing...':`${timer} · On call${muted?' · Muted':''}`}</p>
  {phase==='ringing'&&<div className="answer-track" ref={track} style={{'--answer-progress':progress} as React.CSSProperties}>
   <span className="slide-label">Slide to answer<ChevronRight size={16}/><ChevronRight size={16}/></span>
   <div className="answer-slider" role="slider" tabIndex={0} aria-label="Slide to answer the call" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress*100)} aria-valuetext={progress>.85?'Connected':'Slide right or press Enter to answer'} onKeyDown={key} onPointerDown={start} onPointerMove={e=>{if(drag.current)move(slideProgress(drag.current.start,e.clientX,drag.current.travel));}} onPointerUp={release} onPointerCancel={()=>{drag.current=null;move(0);}}><Phone size={25}/></div>
  </div>}
  {phase==='connected'&&<p className="call-caption" role="status">{seconds<3?'Hey Miranda!! Happy birthday!!':seconds<5?'Guess what? I've got a little surprise for you!':"Come on, let's go to our secret little hideaway! I've been waiting for you!"}</p>}
  {phase==='connected'&&<div className="call-wave" aria-hidden="true">{Array.from({length:9},(_,i)=><i key={i} style={{animationDelay:`${i*-.19}s`}}/>)}</div>}
  {phase==='error'&&<div className="call-recovery"><button onClick={onAnswer}><Phone size={17}/>Try again</button><button onClick={onContinue}>Continue</button></div>}
  {phase==='connected'&&<button className="call-return" onClick={onContinue}>{replaying?'Back to the room':'Explore the room'}</button>}
  {phase==='transition'&&<AudioLines className="call-continuing" size={27} aria-hidden="true"/>}
 </section>;
}
