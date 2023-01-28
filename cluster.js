const cluster = require('cluster');
const os = require('os');
const Bree = require('bree');
const Cabin = require('cabin');
const Graceful = require('@ladjs/graceful');
const { Signale } = require('signale');
const ms=require('ms');

// initialize cabin
const cabin = new Cabin({
  axe: {
    logger: new Signale()
  }
});

const bree = new Bree({
  logger: cabin,
  jobs: [
    // {
    //   name:'morning-lesson-remainder',
    //   interval: 'at 08:00 am'
    // },
    // {
    //   name:'pre-lesson',
    //   cron: '0 * * * *'
    // },
    // {
    //   name:'post-lesson',
    //   cron: '0 * * * *'
    // },
    // {
    //   name:'reset-sessions',
    //   cron: '0 0,6 * * *'
    // },
    // {
    //   name:'send-job-alerts',
    //   cron: '30 10,13,18 * * *'
    // },
    // {
    //   name:'send-help-requests',
    //   closeWorkerAfterMs:ms('40s'),
    //   cron: '*/3 * * * *'
    // },
    {
      name:'send-customer-support-query',
      closeWorkerAfterMs:ms('40s'),
      cron: '*/2 * * * *'
    }
  ]
});

 // handle graceful reloads, pm2 support, and events like SIGHUP, SIGINT, etc.
  const graceful = new Graceful({ brees: [bree] ,killTimeout:'40s'});
  //graceful.listen();

  // start all jobs (this is the equivalent of reloading a crontab):
  //bree.start();

if(cluster.isMaster){
  const cpus = os.cpus().length;
  console.log(`Forking for ${cpus} CPUs`);
  for(let i=0;i<cpus;i++){
    cluster.fork();
  }
  
  cluster.on('fork',(worker)=>{
    console.log(`Forking new worker ${worker.id}`)
  })
  
  //main worker that does cron jobs
  let mainWorkerId=null;
  
  cluster.on('listening',(worker,address)=>{
    
    console.log("cluster listening new worker" + worker.id)
    if(null===mainWorkerId){
      console.log("making worker to main worker")
      mainWorkerId=worker.id;
      worker.send({order:"startCron"})
    }
  })
  
  cluster.on('exit', (worker, code, signal) => {
  
  if (code !== 0 && !worker.exitedAfterDisconnect) {
    console.log(`Worker ${worker.id} crashed. ` +
                'Starting a new worker...');
    cluster.fork();
    
    if(worker.id===mainWorkerId){
      console.log("main worker is dead...")
      mainWorkerId=null;
      
    }
  }
  
  
      
});
}else{
 
  require('./app');
  process.on('message',function(message){
    if(message.order=='startCron'){
      bree.start();
      graceful.listen();
    }
  })
}