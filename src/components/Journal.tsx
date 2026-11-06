import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Check, LockKeyhole, Plus } from 'lucide-react';
import type { Profile } from '../services/authService';
import { appendJournalNote } from '../services/journalService';

export default function Journal({profile,day,update,children}:{profile:Profile;day:number;update:(profile:Profile)=>boolean;children:ReactNode}) {
  const [draft,setDraft]=useState(profile.journal[day] || '');
  const [status,setStatus]=useState<'idle'|'draft'|'added'|'error'>(draft?'draft':'idle');
  const latest=useRef(profile),draftRef=useRef(draft);
  latest.current=profile;
  function change(text:string) {
    draftRef.current=text;setDraft(text);
    const next={...latest.current,journal:{...latest.current.journal,[day]:text}};
    if(update(next)){latest.current=next;setStatus(text.trim()?'draft':'idle')}else setStatus('error');
  }
  function add(e:FormEvent) {
    e.preventDefault();
    if(!draftRef.current.trim())return;
    const next=appendJournalNote(latest.current,day,draftRef.current);
    if(!update(next)){setStatus('error');return;}
    latest.current=next;draftRef.current='';setDraft('');setStatus('added');
  }
  const notes=profile.journalNotes[day] || [];
  return <section className="journal">
    {children}
    <form onSubmit={add}>
      <label className="sr-only" htmlFor="journal">Your reflection for Day {day}</label>
      <textarea id="journal" rows={6} placeholder="Let your thoughts find a home here…" value={draft} onChange={e=>change(e.target.value)}/>
      <div className="journal-controls">
        <span className="journal-status-message" aria-live="polite">{status==='error'?'Not saved — please try again':status==='added'?<><Check size={14}/>Note added</>:status==='draft'?<><Check size={14}/>Draft saved</>:null}</span>
        <button className="gold" type="submit" disabled={!draft.trim()}><Plus size={17}/>Add note</button>
      </div>
    </form>
    {notes.length>0&&<ol className="journal-notes" aria-label={`Your notes for Day ${day}`}>
      {notes.map((note,i)=><li className="journal-note" key={note.id}><h3>Note {i+1}</h3><p>{note.text}</p></li>)}
    </ol>}
    <div className="journal-status"><span><LockKeyhole size={12}/> Private, saved on this device</span></div>
  </section>
}
