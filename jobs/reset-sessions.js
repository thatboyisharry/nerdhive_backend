const {getAllUsers, updateUser } = require("../services/apiCalls");
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
    let currentHour = new Date().getHours
    let users = getAllUsers()

    for(let i = 0 ; i < users.length ; i++){
        let user = users[i]
        let lastUpdatedTime=new Date(user.session.lastUpdated)
        let lastUpdatedHour=lastUpdatedTime.getHours
        if(currentHour-lastUpdatedHour>1){
            try {
                user.session.isActive=false
                user.session.chat.active=false
                user.session.chat.participant=null;
                await updateUser(user);
            } catch (error) {
                console.log(error)
            }
        }
    }
    
       // signal to parent that the job is done
  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
    
}

main().catch(err => console.log(err));