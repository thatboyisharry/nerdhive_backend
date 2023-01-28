const { startChat,chatInvite } = require("../dialogEngine/startChat");
const { getChatUser, getLearner, getLearnerCoach, getUser, getCoach, getParent,updateUser } = require("../services/apiCalls");


const startChatFlowActions=async(action,user_response,user)=>{
    
    if(action.name==="startChat"){
        let success= await openChat(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
    if(action.name==="sendChatInvite"){
        let success= await sendChatInvite(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
    if(action.name==="cancelInvite"){
        let success= await cancelInvite(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="talkToCoach"){
        let success= await openChat(user,user_response);
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
  
  
    if(action.name==="setAppointment"){
        let success= await declineInvite(user,user_response);
        if(success){
          
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
}


const cancelInvite=async(user)=>{
  try{
    //switch particpant invite
    let participant =await getUser(user.session.chat.participant)
    participant.session.chat.invite=false;
    participant.session.chat.participant='';
    user.session.chat.cancelled=true;
    await updateUser(user);
    let res = await updateUser(participant);
    return res
    
  }catch(error){
    console.log(error)
  }
    
   

}


const declineInvite=async(user)=>{
  try{
    //switch particpant invite
    let participant =await getUser(user.session.chat.participant)
    participant.session.chat.invite=false;
    participant.session.chat.participant='';
    await updateUser(user);
    let res = await updateUser(participant);
    return res
    
  }catch(error){
    console.log(error)
  }
    
   

}

const sendChatInvite=async(user,code)=>{
  console.log("sending chat invite")
    code=code.toUpperCase();
    try {
        let res =false
        if(user.isCoach||user.isAdmin){
            let participant = await getChatUser(code);
            //check if user is available to receive invite
            if(participant.session.chat.invite||participant.session.chat.active||participant.session.helpRequest.solving||participant.session.helpRequest.invite){
              return false
            }
            res = await chatInvite(participant.userCode,user)
        }else if(user.isLearner){
            let learner = await getLearner(user.id)
            let coach = await getCoach(learner.coachId);
            let coachUser = await getUser(coach.userId)
               //check if user is available to receive invite
            if(coachUser.session.chat.invite||coachUser.session.chat.active||coachUser.session.helpRequest.solving||coachUser.session.helpRequest.invite){
              return false
            }
            res = await chatInvite(coachUser.userCode,user)
        }else if(user.isParent){
            let parent = await getParent(user.id);
            let coach = await getCoach(parent.coach);
            let coachUser = await getUser(coach.userId)
               //check if user is available to receive invite
            if(coachUser.session.chat.invite||coachUser.session.chat.active||coachUser.session.helpRequest.solving||coachUser.session.helpRequest.invite){
              return false
            }
            res = await chatInvite(coachUser.userCode,user)

        }
        
        return res
        
    } catch (error) {
        console.log(error)
        return false
    }

   

}


const openChat=async(user,code)=>{

    try {
        let res =false
        if(user.isCoach||user.isAdmin){
            if(user.session.chat.invite){
              let phone=user.session.chat.participant
              let participant = await getUser(phone)
              res = await startChat(participant.userCode,user)
            }else{
              let participant = await getChatUser(code);
              res = await startChat(participant.userCode,user)
            }
           
        }else if(user.isLearner){
            let learner = await getLearner(user.id)
            let coach = await getCoach(learner.coachId);
            let coachUser = await getUser(coach.userId)
            res = await startChat(coachUser.userCode,user)
        }else if(user.isParent){
            let parent = await getParent(user.id);
            let coach = await getCoach(parent.coach);
            let coachUser = await getUser(coach.userId)
            res = await startChat(coachUser.userCode,user)

        }
        
        return res
        
    } catch (error) {
        console.log(error)
        return false
    }

   

}

module.exports={
    startChatFlowActions
  }