'use client';
import {Sun,CloudRain,Snowflake,Sunset,Moon,Flame,CloudSun,Check} from 'lucide-react';
import {atmospheres,type Atmosphere} from '../data/atmospheres';
const icons={sunny:Sun,rain:CloudRain,snow:Snowflake,sunset:Sunset,blue:CloudSun,night:Moon,candle:Flame};
export function AtmospherePicker({value,open,onToggle,onChange}:{value:Atmosphere;open:boolean;onToggle:()=>void;onChange:(value:Atmosphere)=>void}){
 const Icon=icons[value];return <div className="atmosphere-picker">
  <button className="weather-toggle" aria-label={`Weather and lighting: ${atmospheres[value].label}`} title="Change the weather" aria-expanded={open} aria-controls="weather-options" onClick={onToggle}><Icon size={20}/></button>
  {open&&<div className="atmosphere-options" id="weather-options" role="group" aria-label="Choose weather and lighting">{(Object.keys(atmospheres) as Atmosphere[]).map(id=>{const I=icons[id];return <button key={id} aria-pressed={id===value} onClick={()=>onChange(id)}><I size={20}/><span>{atmospheres[id].label}</span><Check className="weather-check" size={13} aria-hidden="true"/></button>;})}</div>}
 </div>;
}
