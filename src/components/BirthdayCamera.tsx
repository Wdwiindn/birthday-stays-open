'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Download, RefreshCw, RotateCcw, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { deleteBirthdayPhoto, latestBirthdayPhoto, saveBirthdayPhoto, type BirthdayPhoto } from '../lib/storage';
import { getBirthdayState } from '../data/timeline';
import { roomAudio } from '../lib/audio';

export function BirthdayCamera({ open, onClose, onKept, season }: { open: boolean; onClose: () => void; onKept: () => void; season: number }) {
  return <Dialog open={open} onOpenChange={value => { if (!value) onClose(); }}><DialogContent className="memory-dialog camera-dialog" showCloseButton={false}>
    <button className="close-object" onClick={onClose} aria-label="Close camera"><X size={21} /></button>
    <DialogTitle className="memory-episode">Capture a Memory</DialogTitle>
    <DialogDescription className="sr-only">Take a photo, then retake, keep, or delete it. Photos stay on this device.</DialogDescription>
    {open && <CameraSession onKept={onKept} season={season} />}
  </DialogContent></Dialog>;
}

function CameraSession({ onKept, season }: { onKept: () => void; season: number }) {
  const [stage, setStage] = useState<'ready' | 'live' | 'shot'>('ready');
  const [facing, setFacing] = useState<'user' | 'environment'>('user');
  const [photo, setPhoto] = useState<BirthdayPhoto | null>(null), [url, setUrl] = useState('');
  const [saved, setSaved] = useState(false), [developing, setDeveloping] = useState(false);
  const [busy, setBusy] = useState(false), [note, setNote] = useState('');
  const video = useRef<HTMLVideoElement>(null), stream = useRef<MediaStream | null>(null);
  const active = useRef(true), requestId = useRef(0);
  const stop = useCallback(() => { stream.current?.getTracks().forEach(track => track.stop()); stream.current = null; }, []);
  useEffect(() => {
    active.current = true;
    void latestBirthdayPhoto().then(previous => {
      if (active.current && requestId.current === 0 && previous) { setPhoto(previous); setSaved(true); setStage('shot'); }
    }).catch(() => {});
    return () => { active.current = false; requestId.current++; stop(); };
  }, [stop]);
  useEffect(() => {
    if (!photo) { setUrl(''); return; }
    const objectUrl = URL.createObjectURL(photo.blob); setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);
  useEffect(() => {
    if (!developing) return;
    const timer = setTimeout(() => setDeveloping(false), 5000);
    return () => clearTimeout(timer);
  }, [developing]);
  useEffect(() => {
    if (stage === 'live' && video.current && stream.current) {
      video.current.srcObject = stream.current;
      void video.current.play().catch(() => setNote('Tap the screen to continue.'));
    }
  }, [stage, facing]);
  useEffect(() => {
    const hide = () => { if (document.visibilityState === 'hidden') { requestId.current++; stop(); setBusy(false); setStage(s => s === 'live' ? 'ready' : s); } };
    document.addEventListener('visibilitychange', hide);
    return () => document.removeEventListener('visibilitychange', hide);
  }, [stop]);

  async function start(nextFacing = facing) {
    const id = ++requestId.current; stop(); setBusy(true); setNote('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera unavailable');
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: nextFacing }, width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
      if (!active.current || id !== requestId.current) { media.getTracks().forEach(track => track.stop()); return; }
      stream.current = media; setFacing(nextFacing); setStage('live'); setPhoto(null); setSaved(false);
      // A facing switch can keep the same React video element mounted.
      if (video.current) { video.current.srcObject = media; await video.current.play().catch(() => {}); }
    } catch {
      if (active.current && id === requestId.current) { setStage('ready'); setNote('Maybe next time. The room will be here.'); }
    } finally { if (active.current && id === requestId.current) setBusy(false); }
  }
  async function capture() {
    const source = video.current;
    if (!source?.videoWidth || !source.videoHeight) { setNote('Just a moment. The camera is focusing.'); return; }
    setBusy(true);
    const canvas = document.createElement('canvas'), size = Math.min(source.videoWidth, source.videoHeight, 1200);
    canvas.width = size; canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) { setBusy(false); setNote('That didn't work. Let's try again.'); return; }
    if (facing === 'user') { context.translate(size, 0); context.scale(-1, 1); }
    const crop = Math.min(source.videoWidth, source.videoHeight);
    context.drawImage(source, (source.videoWidth-crop)/2, (source.videoHeight-crop)/2, crop, crop, 0, 0, size, size);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', .92));
    if (!active.current) return;
    setBusy(false);
    if (!blob) { setNote('That didn't work. Let's try again.'); return; }
    stop(); roomAudio.foley('shutter');
    const now = new Date();
    setPhoto({ id: `room-${Date.now()}-${Math.random().toString(36).slice(2,10)}`, createdAt: now.toISOString(), age: 0, blob });
    setSaved(false); setDeveloping(true); setStage('shot'); setNote('');
  }
  async function keep() {
    if (!photo) return;
    setBusy(true);
    try { await saveBirthdayPhoto(photo); if (active.current) { setSaved(true); setNote('Lovely! This memory is staying in the room.'); onKept(); } }
    catch { if (active.current) setNote('Couldn't save it in the room. Try saving it to your photos.'); }
    finally { if (active.current) setBusy(false); }
  }
  async function remove() {
    if (!photo) return;
    setBusy(true);
    try { if (saved) await deleteBirthdayPhoto(photo.id); if (active.current) { setPhoto(null); setSaved(false); setStage('ready'); setNote('This photo has been deleted.'); onKept(); } }
    catch { if (active.current) setNote('Couldn't delete the photo. Please try again later.'); }
    finally { if (active.current) setBusy(false); }
  }
  async function download() {
    if (!photo || !url) return;
    const source = new Image(); source.src = url;
    await new Promise<void>((resolve,reject)=>{if(source.complete&&source.naturalWidth){resolve();return;}source.onload=()=>resolve();source.onerror=()=>reject(new Error('Image unavailable'));});
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 1220;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.fillStyle = '#e9dfca'; ctx.fillRect(0,0,1024,1220); ctx.drawImage(source,50,50,924,924);
    ctx.fillStyle = '#544332'; ctx.font = '44px Georgia'; ctx.textAlign = 'center';
    ctx.fillText('A LITTLE DAY',512,1070); ctx.font = '27px Georgia'; ctx.fillText(formatDate(photo.createdAt),512,1140);
    const bridge=(window as unknown as {xhs?:{miniTool?:{writeTempFile:(o:{data:string})=>Promise<{filePath:string}>;saveImageToPhotosAlbum:(o:{filePath:string})=>Promise<unknown>}}}).xhs?.miniTool;
    if(!bridge?.writeTempFile||!bridge?.saveImageToPhotosAlbum){setNote('Your photo is here. You can also take a screenshot.');return;}
    try{const {filePath}=await bridge.writeTempFile({data:canvas.toDataURL('image/png')});await bridge.saveImageToPhotosAlbum({filePath});setNote('Saved to your photos.');}catch{setNote('Couldn't save to your photos, but the picture is still here.');}
  }
  return <div className="camera-session">
    {stage === 'ready' && <div className="camera-ready"><Camera size={42} strokeWidth={1} /><h3>Let's capture a memory.</h3><p>The memories are already here.<br />Let's make one for today.</p><button className="text-action" onClick={() => void start()} disabled={busy}>{busy ? 'Getting the camera ready...' : 'Open camera'}</button></div>}
    {stage === 'live' && <><div className="camera-live"><video ref={video} playsInline autoPlay muted className={facing === 'user' ? 'is-mirrored' : ''} onClick={() => void video.current?.play()} /><div className="viewfinder-corners" /><span>DOODLE · NOW</span></div><div className="camera-controls"><button onClick={() => void start(facing === 'user' ? 'environment' : 'user')} disabled={busy} aria-label="Switch camera"><RefreshCw size={19} /></button><button className="shutter-button" onClick={() => void capture()} disabled={busy} aria-label="Take photo" /><span /></div></>}
    {stage === 'shot' && photo && <><div className={`new-polaroid ${developing ? 'is-developing' : ''}`} key={photo.id}><img src={url || undefined} alt="A birthday Polaroid from today" /><div><strong>A LITTLE DAY</strong><span>{formatDate(photo.createdAt)}</span></div></div><div className="camera-controls shot-controls"><button onClick={() => void start()} disabled={busy} aria-label="Retake photo"><RotateCcw size={16} /><span>Retake</span></button>{!saved ? <button onClick={() => void keep()} disabled={busy || developing}>Keep this one</button> : <button onClick={() => void download()} aria-label="Save to photos"><Download size={16} /><span>Save photo</span></button>}<button onClick={() => void remove()} disabled={busy} aria-label="Delete this photo"><Trash2 size={16} /><span>Delete</span></button></div>{!saved && !developing && <button className="text-action" onClick={() => void download()}>Save to photos<Download size={15} /></button>}</>}
    <p className="camera-note" role="status">{developing ? 'Just a moment, your photo is developing.' : note}</p>
    <p className="camera-privacy">Your photos stay on this device. You decide what to keep.</p>
  </div>;
}
function formatDate(iso: string) { return new Date(iso).toLocaleDateString('en-GB',{ day:'2-digit', month:'short', year:'numeric' }).toUpperCase(); }
