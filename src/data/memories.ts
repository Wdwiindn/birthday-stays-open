export type MemoryKind = 'frames' | 'calls' | 'film' | 'together' | 'portraits' | 'cats' | 'sunny' | 'magic' | 'books' | 'calendar' | 'tv' | 'elephant';
export interface Memory { id:string; episode:string; category:MemoryKind; carrier:'frame'|'polaroid'|'filmstrip'|'contact-sheet'|'tv'; asset:string; alt:string; backText:string; priority:number; }
export const episodeTitles:Record<MemoryKind,string>={frames:'Friends in the Frame',calls:'Hello?',film:'Little Everyday Moments',together:'Better Together',portraits:'Little Adventures',cats:'Many Cats',sunny:'A Little Sunshine',magic:'A Little Magic',books:'The Bookshelf',calendar:'Today and Tomorrow',tv:'Doodle Cinema',elephant:'Little Elephant'};
const gallery:[string,MemoryKind,string,string][]=[
 ['01-tree-friends','frames',"Two friends under a tree","I'm so lucky to have you by my side."],
 ['02-sofa-friends','frames',"Three friends squeezed onto a sofa","Even ordinary days are fun with you."],
 ['03-cafe-friends','together',"Friends sharing coffee","Here's to many more afternoons of endless conversations."],
 ['04-picnic','together',"A giant orange beside a picnic blanket","May you always find joy in the little things."],
 ['05-seaside','portraits',"A little figure by the sea","Stay brave, stay free, and see the world."],
 ['06-reading','portraits',"Someone reading by a red lamp","Never stop being curious or chasing your dreams."],
 ['07-jump','portraits',"Someone jumping in yellow boots","Never grow too old for a little silliness."],
 ['08-tulips','film',"Pink tulips and a blue cup","May you bloom in your own beautiful way."],
 ['09-orange-cat','cats',"A round orange cat","Rest when you need to. The world can wait."],
 ['10-many-cats','cats',"Five cats cuddled together","May you always be surrounded by love."],
 ['11-magic-room','magic',"Golden stars in a little room","You shine like a star."],
 ['12-cake','sunny',"A tiny cake with one candle","Happy birthday! May all your wishes come true."],
];
export const memories:Memory[]=gallery.map(([file,category,alt,backText],i)=>({id:`doodle-${i+1}`,episode:episodeTitles[category],category,carrier:category==='frames'?'frame':'polaroid',asset:`./memories/${file}.webp`,alt,backText,priority:5}));
export const photo=(index:number)=>memories[((index-1)%memories.length+memories.length)%memories.length];
export {albums} from './photo-collections';
export const callFragments=[
 {time:'Ring 01',line:"Hello? You've reached the Claire Hotline.",aside:''},
 {time:'Ring 02',line:"The clouds look like little pieces of toast today.",aside:''},
 {time:'Ring 03',line:"The cat says it's busy.\nBusy doing absolutely nothing.",aside:''},
 {time:'Ring 04',line:"The kettle's ready.\nMake yourself a nice cup of tea.",aside:''},
 {time:'Ring 05',line:"If you're not sure what to do,\njust look out the window for a while.",aside:''},
 {time:'Ring 06',line:"Wish received.\nSomething wonderful is starting to grow.",aside:''},
 {time:'Ring 07',line:"Now go give the cat some love.\nIt's waiting for you.",aside:''},
];
export const birthdayLetter=[
 "Dear Miranda,",
 "Happy birthday to one of my favorite people in the world! I hope you know how much you mean to me, even when I forget to say it out loud.",
 "Life is so much better with you in it. I love the way you find excitement in the smallest things, turn ordinary days into adventures, and make people feel like they belong.",
 "I'm proud of the person you are and the person you're becoming. Never feel you have to be less sensitive, less curious, or less yourself to fit into anyone else's world.",
 "Here's to more late-night conversations, ridiculous laughter, spontaneous plans, and memories we'll still be talking about years from now.",
 "I hope this next chapter brings you the kind of happiness that sneaks up on you and stays. You deserve so much love, today and every day.",
 "No matter how far life takes us, I'll always be cheering you on. Happy birthday, Miranda!",
 "With all my love, Claire",
];
