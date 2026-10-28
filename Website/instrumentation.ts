export async function register(){
 if(process.env.NEXT_RUNTIME==='nodejs'){
  const {startBackups}=await import('./lib/backup');
  startBackups();
  const {startBookkeepingScheduler}=await import('./lib/bookkeeping-scheduler');
  startBookkeepingScheduler();
 }
}
