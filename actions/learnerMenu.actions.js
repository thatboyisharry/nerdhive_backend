const { startChat, chatInvite } = require("../dialogEngine/startChat");
const { getChatUser, getLearner, getLearnerCoach, getUser, getCoach, getParent } = require("../services/apiCalls");


const learnerMenuFlowActions=async(action,user_response,user)=>{
      console.log("action")
  console.log(action)
      if(action.name==="talkToCoach"){
        let success= await sendChatInvite(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
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


module.exports={
    learnerMenuFlowActions
  }