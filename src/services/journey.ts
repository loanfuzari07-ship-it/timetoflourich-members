export function remainingUnlockTime(firstAccessAt:number,now:number,hours:number){return Math.max(0,firstAccessAt+hours*3600000-now)}
