export const shelfBooks = [
  { id: 'hp1', title: "Harry Potter and the Philosopher's Stone", spine: "Philosopher's Stone", author: "J. K. Rowling", volume: 'I', color: '#60432e', family: 'magic', note: "Where the story begins." },
  { id: 'hp2', title: "Harry Potter and the Chamber of Secrets", spine: "Chamber of Secrets", author: "J. K. Rowling", volume: 'II', color: '#354b42', family: 'magic', note: "Some secrets live between the pages." },
  { id: 'hp3', title: "Harry Potter and the Prisoner of Azkaban", spine: "Prisoner of Azkaban", author: "J. K. Rowling", volume: 'III', color: '#3d4551', family: 'magic', note: "If you had a Time-Turner, which day would you revisit?" },
  { id: 'hp4', title: "Harry Potter and the Goblet of Fire", spine: "Goblet of Fire", author: "J. K. Rowling", volume: 'IV', color: '#6b3b33', family: 'magic', note: "The best adventures are shared with friends." },
  { id: 'hp5', title: "Harry Potter and the Order of the Phoenix", spine: "Order of the Phoenix", author: "J. K. Rowling", volume: 'V', color: '#665a39', family: 'magic', note: "May you always have people in your corner." },
  { id: 'hp6', title: "Harry Potter and the Half-Blood Prince", spine: "Half-Blood Prince", author: "J. K. Rowling", volume: 'VI', color: '#3d5148', family: 'magic', note: "Sometimes a note in the margins says everything." },
  { id: 'hp7', title: "Harry Potter and the Deathly Hallows", spine: "Deathly Hallows", author: "J. K. Rowling", volume: 'VII', color: '#5a4539', family: 'magic', note: "The story ends, but the magic stays." },
  { id: 'second-sex', title: "The Little Prince", spine: "The Little Prince", author: "Antoine de Saint-Exupéry", volume: '', color: '#654438', family: 'thought', note: "Some friendships make the whole universe feel a little warmer." },
  { id: 'misogyny', title: "Alice's Adventures in Wonderland", spine: "Alice in Wonderland", author: "Lewis Carroll", volume: '', color: '#4a5040', family: 'thought', note: "Never lose your curiosity. The world is full of wonderful surprises." },
  { id: 'feminism', title: "Anne of Green Gables", spine: "Anne of Green Gables", author: "L. M. Montgomery", volume: '', color: '#866746', family: 'thought', note: "Here's to a life full of little adventures and beautiful surprises." },
] as const;
export type ShelfBook = typeof shelfBooks[number];
