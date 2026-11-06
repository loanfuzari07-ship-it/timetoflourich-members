import test from 'node:test';
import assert from 'node:assert/strict';
import {migrateJournal,storage,authService,PROFILE_KEY,type Profile} from '../src/services/authService.ts';
import {appendJournalNote} from '../src/services/journalService.ts';
const data=new Map<string,string>();
Object.defineProperty(globalThis,'localStorage',{value:{getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>data.set(k,v),removeItem:(k:string)=>data.delete(k)}});

test('existing journal text becomes Note 1 once, without changing profile or progress',()=>{
 data.clear();const legacy={email:'legacy@example.com',name:'Loan',firstAccessAt:1234,completed:[1],journal:{1:'An old reflection\nwith two lines',2:'  '},welcomed:true};
 data.set(PROFILE_KEY,JSON.stringify({[legacy.email]:legacy}));
 const migrated=storage.get(legacy.email)!;assert.equal(migrated.journalNotes[1][0].text,legacy.journal[1]);assert.equal(migrated.journalNotes[1][0].createdAt,null);assert.equal(migrated.firstAccessAt,1234);assert.deepEqual(migrated.completed,[1]);assert.deepEqual(migrated.journal,{});assert.equal(migrated.journalNotes[2],undefined);
 storage.save(migrated);assert.deepEqual(storage.get(legacy.email),migrated);assert.deepEqual(migrateJournal(migrated),migrated);
});

test('many notes append in order, clear only the current draft and stay separate by day and email after re-login',async()=>{
 data.clear();const a=await authService.login('one@example.com','One');
 let p:Profile={...a,journal:{1:'First note',2:'A draft for tomorrow'}};
 p=appendJournalNote(p,1,'First note');p=appendJournalNote(p,1,'Second note\nAnother line');p=appendJournalNote(p,2,'A different day');
 for(let i=3;i<=30;i++)p=appendJournalNote(p,1,`Note ${i}`);
 assert.equal(p.journalNotes[1].length,30);assert.equal(new Set(p.journalNotes[1].map(n=>n.id)).size,30);assert.equal(p.journalNotes[1][0].text,'First note');assert.equal(p.journalNotes[1][1].text,'Second note\nAnother line');assert.equal(p.journalNotes[2][0].text,'A different day');assert.equal(p.journal[1],'');assert.equal(a.journalNotes[1],undefined);
 assert.equal(appendJournalNote(p,1,' \n  '),p);
 storage.save(p);authService.logout();const b=await authService.login('two@example.com','Two');assert.deepEqual(b.journalNotes,{});authService.logout();const returned=await authService.login('one@example.com');assert.deepEqual(returned.journalNotes,p.journalNotes);assert.equal(returned.firstAccessAt,a.firstAccessAt);
 const withDraft={...returned,journal:{...returned.journal,2:'Preserve this draft'}};const next=appendJournalNote(withDraft,1,'One more');assert.equal(next.journal[2],'Preserve this draft');
});

test('notes also save when randomUUID is unavailable in a local preview',async()=>{
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,'crypto');
 try{
  Object.defineProperty(globalThis,'crypto',{value:{},configurable:true});
  let p=await authService.login('preview@example.com','Preview');
  p=appendJournalNote(p,1,'First');p=appendJournalNote(p,1,'Second');
  assert.equal(p.journalNotes[1].length,2);assert.notEqual(p.journalNotes[1][0].id,p.journalNotes[1][1].id);
 }finally{if(descriptor)Object.defineProperty(globalThis,'crypto',descriptor);}
});
