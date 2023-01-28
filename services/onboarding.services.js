require("../messages/templates");
const dataConnection = require('../models/connections/data');
const User=dataConnection.models.User;

const onboardUser=async(user)=>{
  console.log("inside onboarding...")
  //
  if(!user.isOnboarding){
     let onboarding=isOnboarding(user);
  // change flow to onboarding flow
      if(onboarding){
      let isOnboardingFlow=await startOnboardingFlow(user);
      if(isOnboardingFlow){
        return true
        }
      }
  }
  
 
}


const onboardingActions=async(action,user_response,user)=>{
  let action_status
  if(action==='isLearner'){
    action_status = await isLearner(user);
  }
  if(action==='saveName'){
    console.log("saving name")
    action_status = await saveName(user,user_response);
  }
  if(action=='isParent'){
    action_status = await isParent(user);
  }
  
  if(action==="saveGrade"){
    action_status = await saveGrade(user,user_response);
  }
  
  if(action==="doneOnboarding"){
    action_status = await doneOnboarding(user)
  }
  
  return action_status
}



const isLearner=async(user)=>{
  
  let data={
    isLearner:true
  }
  
  let status = await updateUser(user,data);
  
  return status
  
    
}


//////////////////
const saveName=async(user,name)=>{
  
  let data={
    name:name
  }
  
  let status = await updateUser(user,data);
  
  return status
  
    
}
////////////////////////////////////
const saveGrade=async(user,grade)=>{
  
  let data={
    grade:grade
  }
  
  let status = await updateUser(user,data);
  
  return status
  
    
}

/////////////////////////////////////

const doneOnboarding=async(user)=>{
  
  let data={
    isOnboarding:false,
    isOnboarded:true
  }
  
  let status = await updateUser(user,data);
  
  return status
  
    
}

//////////////////////////
const isParent=async(user)=>{
  
  let data={
    isParent:true
  }
  
  let status = await updateUser(user,data);
  
  return status
  
    
}


/////////////////////
const updateUser=async(user,data)=>{
  try{
     let updatedUser= await User.findByIdAndUpdate(user._id,data)
      console.log("updated user")
      console.log(data)
      console.log(updatedUser)
     return true;
  
    
  }catch(error){
    console.log(error);
    return false;
    
  }
}

module.exports = {
  onboardingActions,
  updateUser
}

const isOnboarding=async(user)=>{
  console.log("switching onboarding")
  let data={
    isOnboarding:true
  }
  return await updateUser(user,data);
}

const startOnboardingFlow=async(user)=>{
  console.log("starting onboarding flow")
  let date = new Date()
  let data={
    session:{
      flow:'onboarding',
      node:'start',
      lastUpdated:date,
      num:0,
      isActive:true
    }
  }
  return await updateUser(user,data);
}


module.exports={
  onboardUser
}