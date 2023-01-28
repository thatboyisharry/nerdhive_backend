const { getNextSupportAid } = require("./utils");
const {  getTemplate, updateUser, getUser,getCustomerQueries,updateCustomerQuery,getAllCustomerSupport } = require("../services/apiCalls");
const { sendTemplateMessage } = require("../services/sendTemplateMessages");
const mongoose = require('mongoose');
let dbRoute=process.env.MONGO_URL;
const fs = require('fs');
const path = require('path');
const { parentPort } = require('worker_threads');

const Cabin = require('cabin');

const { Signale } = require('signale');

const delay = require('delay')
const ms=require('ms');




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
    let customerQueries = await getCustomerQueries({status:"unresolved"});
    if(!customerQueries||customerQueries.length===0){
      return null
    }
  
  
    //send queries to customer support
    for(let i = 0 ; i <customerQueries.length; i++){
        let query = customerQueries[i];
        try {
            await sendSupportQuery(query);//sendHelpRequest
        } catch (error) {
            console.log(error)
        }
        
    }

    
     // signal to parent that the job is done
  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
}

const sendSupportQuery=async(query)=>{
    
    //filter out the employees that are currently busy with a client
    try {
        let customer_support_aids = await getAllCustomerSupport();
        //write algorithm to get the next customer_support_aid to receive the request
        //filter out those that not available 
        //filter out those already helping someone
        //filter out those with an active help request
        // let availableTutor = await getAvailableTutors(customer_support_aids);
        let customer_support_aid = await getNextSupportAid(customer_support_aids,query);
        if(customer_support_aid==null){
          return null
        }
        console.log("fetching template")
      
        await delay(ms('5s'));
        let customerSupportTemplate= await getTemplate("customer_support_invite")
         console.log(customerSupportTemplate)
        let data={
                query,
                support:customer_support_aid
              }
        await delay(ms('5s'));
        await sendTemplateMessage(customerSupportTemplate,data,customer_support_aid);

 

        //add support aid to list of support aids that received the query
       let sentTo = query.sentTo.push(customer_support_aid.userId);
      
        let customerSupport = await getUser(customer_support_aid.phone)
        customerSupport.session.customerSupport.invite=true;
        customerSupport.session.customerSupport.queryId=query.id;
        customerSupport.session.customerSupport.leadId=query.userId;
        let date = new Date()
        customerSupport.session.flow='customer_support';
        customerSupport.session.node='invite'
        customerSupport.session.lastUpdated=date;
        
        await updateCustomerQuery(query,{sentTo:sentTo})
        await updateUser(customerSupport);
        
    } catch (error) {
        console.log(error)
    }
    
}


main().catch(err => console.log(err));