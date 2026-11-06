export interface JournalNote { id: string; text: string; createdAt: number | null }
export interface Profile { email: string; name: string; firstAccessAt: number; completed: number[]; journal: Record<number,string>; journalNotes: Record<number,JournalNote[]>; welcomed: boolean }
export function migrateJournal(profile: Profile): Profile {
  if(profile.journalNotes) return profile;
  const journalNotes: Record<number,JournalNote[]> = {};
  for(const [day,text] of Object.entries(profile.journal || {})) {
    if(text.trim()) journalNotes[Number(day)] = [{id:`legacy-${day}`,text,createdAt:null}];
  }
  return {...profile,journal:{},journalNotes};
}
export const PROFILE_KEY = 'divine-script:profiles:v1';
const SESSION_KEY = 'divine-script:session:v1';
export function normalizeName(name: string) {const first = name.trim().split(/\s+/)[0] || '';return first.charAt(0).toLocaleUpperCase()+first.slice(1);}
export function normalizeEmail(email: string) {return email.trim().toLowerCase();}
export function validEmail(email: string) {return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));}
export const storage = {
  profiles(): Record<string,Profile> {const raw=localStorage.getItem(PROFILE_KEY);if(!raw)return {};try{return Object.fromEntries(Object.entries(JSON.parse(raw) as Record<string,Profile>).map(([email,profile])=>[email,migrateJournal(profile)]))}catch{throw new Error('Your saved data could not be read. Please contact support before clearing browser data.')}},
  get(email: string) {return this.profiles()[normalizeEmail(email)] || null;},
  save(profile: Profile) {localStorage.setItem(PROFILE_KEY,JSON.stringify({...this.profiles(),[profile.email]:profile}));},
  session() {const email=localStorage.getItem(SESSION_KEY);return email ? this.get(email) : null;},
};
export const authService = {
  // Symbolic access only. Replace with a server-side purchase verification endpoint.
  async verifyPurchase(_email: string): Promise<boolean> {return true;},
  async login(email: string, name?: string): Promise<Profile> {
    email=normalizeEmail(email);if(!validEmail(email))throw new Error('Please enter a valid email address.');
    if(!await this.verifyPurchase(email))throw new Error('We could not verify your purchase. Please contact support.');
    let profile=storage.get(email);
    if(!profile){if(!name?.trim())throw new Error('Please enter your first name.');profile={email,name:normalizeName(name),firstAccessAt:Date.now(),completed:[],journal:{},journalNotes:{},welcomed:false};storage.save(profile);}
    localStorage.setItem(SESSION_KEY,email);return profile;
  },
  logout() {localStorage.removeItem(SESSION_KEY);},
};
