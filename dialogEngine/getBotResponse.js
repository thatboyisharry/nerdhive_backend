const { updateUserSession, getUser} = require("../services/apiCalls");
const { actionsHandler } = require('../actions');
const { onboardUser} = require("../services/onboarding.services");
const { getMessages, getTransition, getFlow, getNode } = require('./utils');




////////////////////////////////////////////////


const getBotResponses=async(user,user_response,project_flows)=>{
  console.log(user);
  
  let responses;  
  let session=user.session;

  let current_flow = await getFlow(session.flow,project_flows);
  console.log(current_flow)
  let current_node = await getNode(current_flow,session.node);
  console.log("current node")
  console.log(current_node)
  //get the next transition
  let trigger = user_response;
  let transition;
  if(current_node.sticky){
    transition = await getTransition(current_node,trigger); 
    if(transition==null){
        if(current_node.actions.length>0&&session.num!==0){
          trigger = await actionsHandler(current_node,user_response,user)
        }
    }
  }else{
    if(current_node.actions.length>0&&session.num!==0){
      trigger = await actionsHandler(current_node,user_response,user)
      
    }
    transition = await getTransition(current_node,trigger); 
  }
  
  
  
  if(session.num===0){
    transition = current_node;
  }

  if(transition!==null){
        
      console.log("transition is not null")
    console.log("transition")
      console.log(transition)
      let updatedUser = await getUser(user.phone);
      let responses = await getMessages(transition,updatedUser,project_flows);
      let isUpdated = await updateUserSession(user,transition);
      //isUpdated returns a boolean variable 
      if(isUpdated){
          console.log("user updated")
          return responses
      }
    
    console.log('user not updated')
  }

  if(transition==null){
      console.log("transition is null");
      responses = current_node.catch
  }

  
  
  console.log("Failed getting bot responses")
  
  
   
  
}






module.exports={
    getBotResponses,
    
}