const { startChat} = require("../dialogEngine/startChat");
const {  getUser, updateUser, getLearnerQuestion,updateLearnerQuestion } = require("../services/apiCalls");


const helpRequestFlowActions=async(action,user_response,user)=>{
    
    if(action.name==="acceptInvite"){
        let success= await acceptInvite(user,user_response);
        if(success){
         
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
  
    if(action.name==="sendTutorQuestion"){
        let success= await isSolving(user);
        if(success){
         
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
  if(action.name==="hasError"){
        let success= await hasError(user);
        if(success){
         
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  if(action.name==="noError"){
        let success= true;
        if(success){
         
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
  
    if(action.name==="saveError"){
        let success= await addErrorReport(user,user_response);
        if(success){
         
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="declineInvite"){
        let success= await declineInvite(user,user_response);
        if(success){
          
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
    if(action.name==="keepSending"){
        let success= await keepSending(user,user_response);
        if(success){
          
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
    if(action.name==="notAvailable"){
        // let success= await declineInvite(user,user_response);
        let success=true;
        if(success){
          
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
}

const isSolving=async(user)=>{
  try{
    user.session.helpRequest.solving=true;
     let res = await updateUser(user);
      return res
  }catch(error){
    console.log(error)
  }
}


const hasError=async(user)=>{
  try{
    let helpRequest = user.session.helpRequest;
    let questionId= helpRequest.requestId;
    let question = await getLearnerQuestion(questionId)
    question.hasError=true;
    await updateLearnerQuestion(question)
    let res = await updateUser(user);
    return res
  
  
  }catch(error){
    console.log(error)
  }
}


const addErrorReport=async(user,error)=>{
  try{
    let helpRequest = user.session.helpRequest;
    let questionId= helpRequest.requestId;
    let question = await getLearnerQuestion(questionId)
    question.errorReports.push(error);
    await updateLearnerQuestion(question)
    let res = await updateUser(user);
    return res
  
  
  }catch(error){
    console.log(error)
  }
}


const keepSending=async(user)=>{
  
  try{

    let helpRequest = user.session.helpRequest;
    let questionId= helpRequest.requestId;
    let question = await getLearnerQuestion(questionId)
    let sentTo=question.sentTo.filter(tutorId=>tutorId!==user.id);
    question.sentTo=sentTo;
    helpRequest.requestId=''
    user.session.helpRequest=helpRequest;
    await updateLearnerQuestion(question)
    let res = await updateUser(user);
    return res
  
  
  }catch(error){
    console.log(error)
  }
    
}
const acceptInvite=async(user)=>{
    const {learnerId}=user.session.helpRequest.learnerId
  
    let id = user.session.helpRequest.learnerId
  
    try {
        let res =false

        let learner = await getUser(id)
        learner.session.flow='help_request'
        learner.session.node='send_learner_message';
        learner.session.helpRequest.requestId=user.session.helpRequest.requestId
        learner.session.helpRequest.participant=user.id
        await updateUser(learner);
        let updatedLearner = await getUser(id)
        res = await startChat(updatedLearner.userCode,user)
      console.log('res')
      console.log(res)
        return res
        
    } catch (error) {
        console.log(error)
        return false
    }

   

}

const declineInvite=async(user)=>{
  try{
    
    let helpRequest = user.session.helpRequest;
    helpRequest.invite=false
    helpRequest.solving=false
    helpRequest.learnerId=''
    user.session.helpRequest=helpRequest;
    let res = await updateUser(user);
    return res
    
  }catch(error){
    console.log(error)
  }
    
   

}



module.exports={
    helpRequestFlowActions
}