'use client';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { albums, episodeTitles, photo, type MemoryKind } from '../data/memories';
import { roomAudio } from '../lib/audio';

export function MemoryViewer({ kind, onClose, onMagic }: { kind: MemoryKind | null; onClose: () => void; onMagic: () => void }) {
  return <Dialog open={!!kind} onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent className={`memory-dialog memory-${kind ?? 'closed'}`} showCloseButton={false}>
      {kind && <>
        <button className="close-object" onClick={onClose} aria-label="Back to the room"><X size={21} /></button>
        <DialogTitle className="memory-episode">{episodeTitles[kind]}</DialogTitle>
        <DialogDescription className="sr-only">A little memory from the room. Press Escape or close to return.</DialogDescription>
        <div className="memory-content" key={kind}>
          {kind === 'sunny' ? <MarchMemory /> : kind === 'magic' ? <MagicMemory onMagic={() => { onClose(); onMagic(); }} /> : <PolaroidAlbum kind={kind} />}
        </div>
      </>}
    </DialogContent>
  </Dialog>;
}

function PolaroidAlbum({ kind }: { kind: MemoryKind }) {
  const ids = albums[kind] ?? albums.film!;
  const [index, setIndex] = useState(0), [flipped, setFlipped] = useState(false);
  const swipe = useRef(0);
  const memory = photo(ids[index]);
  function move(direction: number) { setFlipped(false); setIndex(i => (i + direction + ids.length) % ids.length); roomAudio.foley('paper'); }
  function flip() { setFlipped(f => !f); roomAudio.foley('paper'); }
  return <div className="album-view">
    <button className={`polaroid ${flipped ? 'is-flipped' : ''}`} onClick={flip} aria-label={flipped ? 'View the front' : 'Flip to the back'} onTouchStart={event => { swipe.current = event.touches[0].clientX; }} onTouchEnd={event => { if (Math.abs(event.changedTouches[0].clientX - swipe.current) > 45) { event.preventDefault(); flip(); } }}>
      <span className="polaroid-turner">
        <span className="polaroid-front"><img src={memory.asset} alt={memory.alt} /><span className="photo-caption">{kind === 'frames' ? 'Those days, with you.' : kind === 'cats' ? 'many cats' : kind === 'portraits' ? 'Little things, loosely drawn.' : 'A perfectly crooked day.'}</span></span>
        <span className="polaroid-back"><span className="back-note">{memory.backText}</span><span className="back-signature">Claire ♡</span></span>
      </span>
    </button>
    <p className="album-label">{kind === 'together' ? 'Our Photo Album' : kind === 'portraits' ? 'Little Adventures' : kind === 'cats' ? 'many cats' : 'Days to Remember'}<span>{index + 1} / {ids.length}</span></p>
    <div className="object-controls">
      <button aria-label="Previous photo" onClick={() => move(-1)}><ArrowLeft size={18} /></button>
      <button className="flip-control" onClick={flip}><RotateCcw size={13} />{flipped ? 'View photo' : 'Flip over'}</button>
      <button aria-label="Next photo" onClick={() => move(1)}><ArrowRight size={18} /></button>
    </div>
    {kind === 'frames' && <p className="memory-afterword">Let's stay under the tree a while,<br />and let the breeze mess up our hair.</p>}
  </div>;
}

function MarchMemory() {
  const [index, setIndex] = useState(0);
  const ids = albums.sunny!, memory = photo(ids[index]);
  return <div className="march-memory">
    <article className="event-ticket"><span>A LITTLE SUNSHINE</span><h3>A Little Sunshine</h3><p>It's okay to take your time.<br />The flowers are waiting for the next breeze.</p><div className="ticket-footer"><span>HELLO, LITTLE DAY</span><span>KEEP THIS MOMENT</span></div></article>
    <button className="event-photo" onClick={() => setIndex(i => (i + 1) % ids.length)} aria-label="View the next sunny photo"><img src={memory.asset} alt={memory.alt} /><span>Another day, together. <ArrowRight size={14} /></span></button>
  </div>;
}

function MagicMemory({ onMagic }: { onMagic: () => void }) {
  return <div className="magic-memory"><img src={photo(11).asset} alt={photo(11).alt} /><p>Some lights shine<br />as long as you believe in them.</p><button className="spell-button" onClick={onMagic}>Lumos <span>✧</span></button></div>;
}
