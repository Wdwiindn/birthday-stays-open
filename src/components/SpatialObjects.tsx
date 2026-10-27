'use client';
import {useRef,useEffect} from 'react';
import {ArrowLeft,ArrowRight,RotateCcw} from 'lucide-react';
import {callFragments} from '../data/memories';
import {shelfBooks,type ShelfBook} from '../data/books';
import type {FocusKind} from '../data/room';
const titles: Record<FocusKind,string> = { frames:'Those days, with you.',books:'The Bookshelf',calls:'Hello, Claire's listening',calendar:'Today and Tomorrow',tv:'All the little things.',window:'Outside, the world goes on.',drawer:'A Little Secret in the Drawer' };
interface FocusProps {
  kind: FocusKind; onClose: () => void; frameIndex: number; frameFlipped: boolean; onFrameMove: (n:number)=>void; onFrameFlip:()=>void;
  selectedBook: ShelfBook|null; onBookSelect:(id:string)=>void; onDial:()=>void; onBookMemory: (magic:boolean)=>void; callIndex:number;
  calendarPage:number; onCalendarFlip:()=>void; tvIndex:number; tvPaused:boolean; onTVPause:()=>void; onTVNext:()=>void;
  onWindowCat:()=>void; drawerOpen:boolean;onDrawerToggle:()=>void;onDrawerMagic:()=>void;
}
export function FocusControls(p: FocusProps) {
  const close=useRef<HTMLButtonElement>(null);
  useEffect(() => { close.current?.focus({preventScroll:true}); }, [p.kind]);
  const bare=['tv','window','books'].includes(p.kind);
  return <section className={`focus-ui focus-${p.kind}`} aria-label={titles[p.kind]}>
    <header className="focus-heading"><button ref={close} onClick={p.onClose} aria-label="Back to the room"><ArrowLeft size={18}/><span>Back</span></button></header>
    {!bare&&<div className={`focus-detail ${p.kind==='books'?'book-detail-quiet':''}`}>
      {p.kind==='frames'&&<><p className="focus-note">{p.frameIndex===0?'Friends Under the Tree':'Together on the Sofa'}</p><div className="focus-actions"><button onClick={()=>p.onFrameMove(-1)} aria-label="Previous framed photo"><ArrowLeft size={18}/></button><button onClick={p.onFrameFlip} aria-label={p.frameFlipped?'View photo':'Flip over'}><RotateCcw size={17}/></button><button onClick={()=>p.onFrameMove(1)} aria-label="Next framed photo"><ArrowRight size={18}/></button></div></>}
      {p.kind==='books'&&<div className="book-pick-controls"><select className="book-select" aria-label="Choose a book" value={p.selectedBook?.id??''} onChange={e=>p.onBookSelect(e.target.value)}><option value="">Bookshelf</option>{shelfBooks.map(book=><option key={book.id} value={book.id}>{book.title}</option>)}</select>{p.selectedBook&&<button className="focus-text-action" onClick={()=>p.onBookSelect('')}>Put it back</button>}</div>}
      {p.kind==='calls'&&<>{p.callIndex<0?<h2>Hello? ☎</h2>:<div className="dial-message" key={p.callIndex} role="status"><time>{callFragments[p.callIndex].time}</time><h2>{callFragments[p.callIndex].line}</h2>{callFragments[p.callIndex].aside&&<p>{callFragments[p.callIndex].aside}</p>}</div>}<button className="focus-text-action" onClick={p.onDial} aria-label="Dial the phone"><RotateCcw size={16}/></button></>}
      {p.kind==='drawer'&&<div className="drawer-actions"><button onClick={p.onDrawerToggle} aria-label={p.drawerOpen?'Close the drawer':'Open the drawer'}>{p.drawerOpen?'Close':'Open'}</button>{p.drawerOpen&&<button onClick={p.onDrawerMagic}>Touch the star ✧</button>}</div>}
      {p.kind==='calendar'&&<button className="focus-text-action" onClick={p.onCalendarFlip} aria-label={p.calendarPage?'Back to today':'Flip to tomorrow'}><RotateCcw size={19}/></button>}
    </div>}
  </section>;
}
