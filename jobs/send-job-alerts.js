const { getActiveJobs, isSentJob } = require("./utils");
const {  getTemplate, getJobs, getTutors, updateUser, getUser } = require("../services/apiCalls");
const { sendTemplateMessage } = require("../services/sendTemplateMessages");
const mongoose = require('mongoose');
let dbRoute=process.env.MONGO_URL;
const fs = require('fs');
const path = require('path');
const { parentPort } = require('worker_threads');

const Cabin = require('cabin');

const { Signale } = require('signale');





// initialize cabin
const cabin = new Cabin({
  axe: {
    logger: new Signale()
  }
});

// store boolean if the job is cancelled
let isCancelled = false;

// handle cancellation (this is a very simple example)
if (parentPort)
  parentPort.once('message', message => {
    if (message === 'cancel') isCancelled = true;
  });

async function main(){
    await mongoose.connect(dbRoute);
    let db=mongoose.connection;
    let hour = new Date().getHours
    let allJobs = await getJobs();
    let activeJobs = getActiveJobs(allJobs)

    for(let i = 0 ; i <activeJobs.length; i++){
        let job = activeJobs[i];
        try {
            await sendJobAlert(job);
        } catch (error) {
            console.log(error)
        }
        
    }

    
     // signal to parent that the job is done
  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
}

const sendJobAlert=async(job)=>{
    //filter out interested and uninterested candidates
    try {
        let tutors = await getTutors();
        let jobAlertTemplate= await getTemplate("job_alert")
        for(let i = 0 ; i<tutors.length; i++){
            let tutor = tutors[i];
            let  user = await getUser(tutor.phone)
            //check if you've already send job to tutor
            let isSent = isSentJob(job,tutor);
            if(isSent){
                continue;
            }
            //check if you've already send job to tutor and is awaiting response
            if(user.session.data.activeJob){
                continue;
            }
            await sendTemplateMessage(jobAlertTemplate,job,tutor);
            tutor.sentJobs.push(job.id);
            user.session.data.activeJob=job
            await updateUser(user);
        }
    } catch (error) {
        console.log(error)
    }
    
}


main().catch(err => console.log(err));