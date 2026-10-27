'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, X, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { birthdayLetter } from '../data/memories';
import { CandleFlame } from './CandleFlame';
import { BreathDetector } from '../lib/breath';

export type EndingPhase = 'idle' | 'wish' | 'dark' | 'relight' | 'letter';
export function BirthdayEnding({ phase, onBlow, onClose, season }: { phase: EndingPhase; onBlow: () => void; onClose: () => void; season: number }) {
  return <>
    <Dialog open={phase === 'wish'} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="memory-dialog wish-dialog" showCloseButton={false}>
        <button className="close-object" onClick={onClose} aria-label="Back to the room"><X size={21} /></button>
        <DialogTitle className="wish-title">Make a wish.</DialogTitle>
        <DialogDescription className="sr-only">Tap the candle or blow it out.</DialogDescription>
        {phase === 'wish' && <WishCandle onBlow={onBlow} />}
      </DialogContent>
    </Dialog>
    {phase === 'dark' && <div className="birthday-darkness" />}
    <Dialog open={phase === 'letter'} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="memory-dialog letter-dialog" showCloseButton={false}>
        <button className="close-object" onClick={onClose} aria-label="Keep this letter"><X size={21} /></button>
        <DialogTitle className="sr-only">A birthday letter for Miranda</DialogTitle>
        <DialogDescription className="sr-only">A special birthday letter, just for you.</DialogDescription>
        <article className="birthday-letter">
          <div className="letter-heading"><span>A NOTE FOR YOU</span><span>A LITTLE ROOM</span></div>
          <div className="letter-body">{birthdayLetter.map((line, i) => <p key={i}>{line}</p>)}</div>
          <p className="letter-signature">Claire</p>
          <div className="letter-ending"><h2>Happy Birthday, Miranda!</h2><p>You deserve all the happiness in the world.</p><span>ONE SMALL WISH</span><em>To be continued.</em></div>
          <button className="paper-action" onClick={onClose}>Keep this letter<ArrowRight size={16} /></button>
        </article>
      </DialogContent>
    </Dialog>
  </>;
}

function WishCandle({ onBlow }: { onBlow: () => void }) {
  const [micState, setMicState] = useState<'off' | 'waiting' | 'listening' | 'fallback'>('off');
  const [breath, setBreath] = useState(0);
  const stream = useRef<MediaStream | null>(null), context = useRef<AudioContext | null>(null);
  const frame = useRef(0), active = useRef(true), blown = useRef(false), requestId = useRef(0);
  const stop = useCallback(() => {
    cancelAnimationFrame(frame.current);
    stream.current?.getTracks().forEach(track => track.stop()); stream.current = null;
    if (context.current && context.current.state !== 'closed') void context.current.close().catch(() => {});
    context.current = null;
  }, []);
  const blow = useCallback(() => {
    if (blown.current || !active.current) return;
    blown.current = true; requestId.current++; stop(); onBlow();
  }, [onBlow, stop]);
  useEffect(() => { active.current = true; return () => { active.current = false; requestId.current++; stop(); }; }, [stop]);
  useEffect(() => {
    if (micState !== 'waiting' && micState !== 'listening') return;
    const timer = setTimeout(() => {
      if (active.current && !blown.current) { requestId.current++; stop(); setMicState('fallback'); setBreath(0); }
    }, 18000);
    return () => clearTimeout(timer);
  }, [micState, stop]);
  async function listen() {
    const id = ++requestId.current;
    setMicState('waiting');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('No microphone');
      const media = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false });
      if (!active.current || id !== requestId.current) { media.getTracks().forEach(track => track.stop()); return; }
      stream.current = media;
      const audio = new AudioContext(); context.current = audio; await audio.resume();
      if (!active.current || id !== requestId.current) { stop(); return; }
      const source = audio.createMediaStreamSource(media), analyser = audio.createAnalyser();
      analyser.fftSize = 1024; source.connect(analyser);
      const samples = new Float32Array(analyser.fftSize);
      let previous = performance.now(), frames = 0;
      const detector = new BreathDetector();
      setMicState('listening');
      const analyse = (now: number) => {
        if (!active.current || blown.current) return;
        analyser.getFloatTimeDomainData(samples);
        let sum = 0; for (const sample of samples) sum += sample * sample;
        const rms = Math.sqrt(sum / samples.length);
        const result = detector.sample(rms, now - previous); previous = now;
        if (++frames % 4 === 0) setBreath(result.intensity);
        if (result.extinguished) { blow(); return; }
        frame.current = requestAnimationFrame(analyse);
      };
      frame.current = requestAnimationFrame(analyse);
    } catch { stop(); if (active.current && id === requestId.current) setMicState('fallback'); }
  }
  return <div className="wish-candle">
    <button className="cake-closeup" onClick={blow} aria-label="Tap the flame to blow out the candle">

    </button>
    <div className="wish-actions">
      <button className="text-action" onClick={listen} disabled={micState === 'waiting' || micState === 'listening'}><Mic size={15} />{micState === 'waiting' ? 'Getting the microphone ready...' : micState === 'listening' ? 'Give it a gentle blow.' : 'Blow gently into the microphone'}</button>
      <button className="tap-to-blow" onClick={blow}>{micState === 'fallback' ? 'No worries! You can tap the flame instead.' : 'Or tap the flame'}</button>
    </div>
  </div>;
}
