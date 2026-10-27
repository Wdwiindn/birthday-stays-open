import type { MemoryKind } from './memories';
export type ObjectId = MemoryKind | 'cake' | 'camera' | 'lamp' | 'desk-lamp' | 'window-cat' | 'window' | 'letter' | 'drawer' | 'wall-charm';
export const roomObjects: { id: ObjectId; label: string; x: number; y: number; w: number; h: number }[] = [
  { id: 'frames', label: 'Friends in the yellow frame', x: 4.4, y: 9.4, w: 9, h: 18.5 },
  { id: 'calls', label: 'Pick up the old telephone', x: 2.6, y: 37.8, w: 11.4, h: 9.8 },
  { id: 'books', label: 'Explore the bookshelf', x: 18.5, y: 11.8, w: 16, h: 23.5 },
  { id: 'tv', label: 'Watch the photo slideshow', x: 2, y: 60, w: 21, h: 29 },
  { id: 'together', label: 'Photo album on the desk', x: 32.6, y: 68, w: 5.4, h: 5.7 },
  { id: 'portraits', label: 'Polaroids on the desk', x: 34, y: 73.8, w: 15.2, h: 5.4 },
  { id: 'calendar', label: 'Flip the birthday calendar', x: 70.5, y: 63.8, w: 7, h: 11.5 },
  { id: 'cats', label: 'Cat on the sofa', x: 61.5, y: 49.8, w: 12, h: 11.2 },
  { id: 'cake', label: 'Birthday cake', x: 43.5, y: 54, w: 13.3, h: 19.3 },
  { id: 'camera', label: 'Take a new photo', x: 63.4, y: 65.5, w: 7.3, h: 8.2 },
  { id: 'lamp', label: 'Switch the floor lamp', x: 79.3, y: 22.4, w: 11.5, h: 16.5 },
  { id: 'desk-lamp', label: 'Adjust the desk lamp', x: 0, y: 29.8, w: 8, h: 8.3 },
  { id: 'window-cat', label: 'Pet the cat by the window', x: 61.4, y: 25, w: 11, h: 14.2 },
  { id: 'window', label: 'Look out the window', x: 55.5, y: 4, w: 13.5, h: 20 },
];
export type FocusKind = 'frames' | 'books' | 'calls' | 'calendar' | 'tv' | 'window' | 'drawer';
export const focusBoxes: Record<FocusKind, { x: number; y: number; w: number; h: number }> = {
  frames: { x: 4.4, y: 9.4, w: 9, h: 18.5 },
  books: { x: 18.2, y: 11.5, w: 17, h: 24.5 },
  calls: { x: 2.4, y: 37.7, w: 11.5, h: 9.9 },
  calendar: { x: 70.4, y: 64, w: 7.2, h: 11.3 },
  tv: { x: 3, y: 61.2, w: 20.3, h: 26 },
  drawer: { x: 4, y: 45, w: 10, h: 7 },
  window: { x: 54.5, y: 2.8, w: 19.7, h: 37.5 },
};
