import {processRecurring} from './bookkeeping';
/** Eén timer per Node-proces; duurzame perioderegistratie voorkomt dubbele facturen tussen processen. */
export function startBookkeepingScheduler(){
 if(process.env.NODE_ENV!=='production'||process.env.NEXT_PHASE==='phase-production-build')return;
 const state=globalThis as typeof globalThis & {nimagoBookkeepingTimer?:ReturnType<typeof setInterval>};
 if(state.nimagoBookkeepingTimer)return;
 const run=()=>{try{processRecurring()}catch(e){console.error('Boekhouding: periodieke verwerking mislukt',e)}};
 state.nimagoBookkeepingTimer=setInterval(run,15*60*1000);state.nimagoBookkeepingTimer.unref();
 const initial=setTimeout(run,10000);initial.unref();
}
