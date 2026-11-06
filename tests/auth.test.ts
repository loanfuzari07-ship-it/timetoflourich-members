import test from 'node:test';
import assert from 'node:assert/strict';
import {authService,storage,normalizeName,validEmail} from '../src/services/authService.ts';
const data=new Map<string,string>();
Object.defineProperty(globalThis,'localStorage',{value:{getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>data.set(k,v),removeItem:(k:string)=>data.delete(k)}});
test('profiles retain journal, progress, name and first-access time after logout and remain isolated by email',async()=>{
 data.clear();const a=await authService.login('  PERSON@EXAMPLE.COM ','  loan   second ');assert.equal(a.name,'Loan');assert.equal(a.email,'person@example.com');
 storage.save({...a,name:'Maria',completed:[1,3],journal:{1:'A private reflection'},welcomed:true});authService.logout();assert.equal(storage.session(),null);
 const b=await authService.login('other@example.com','Other');assert.deepEqual(b.completed,[]);assert.deepEqual(b.journal,{});authService.logout();
 const restored=await authService.login('PERSON@example.com');assert.equal(restored.name,'Maria');assert.equal(restored.firstAccessAt,a.firstAccessAt);assert.deepEqual(restored.completed,[1,3]);assert.equal(restored.journal[1],'A private reflection');assert.equal(restored.welcomed,true);
});
test('invalid email and missing name cannot create profiles',async()=>{
 assert.equal(validEmail('a@b'),false);assert.equal(validEmail('a+b@example.co.uk'),true);assert.equal(normalizeName('  élisa   test '),'Élisa');await assert.rejects(()=>authService.login('bad','Name'));await assert.rejects(()=>authService.login('new@example.com','  '));assert.equal(storage.get('new@example.com'),null);
});
