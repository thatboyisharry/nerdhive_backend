const { startChat} = require("../dialogEngine/startChat");
const {  getUser, updateUser, getLearnerQuestion,updateLearnerQuestion } = require("../services/apiCalls");


const helpReviewFlowActions=async(action,user_response,user)=>{
    
  
    if(action.name==="questionSolved"){
      console.log("question solved")
        let success= await questionSolved(user,user_response);
        if(success){
         
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
  
    if(action.name==="questionNotSolved"){
        let success= await questionSolved(user,user_response);
        if(success){
         
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
   if(action.name==="saveTutorRating"){
        let success= await saveTutorRating(user,user_response);
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


const questionSolved=async(user)=>{
  try{
    let helpRequest = user.session.helpRequest;
    let questionId= helpRequest.requestId;
    let question = await getLearnerQuestion(questionId)
    question.status='solved'
    await updateLearnerQuestion(question)
    let res = await updateUser(user);
    return res
  
  
  }catch(error){
    console.log(error)
  }
}


const saveTutorRating=async(user,rating)=>{
  
  try{
    let helpRequest = user.session.helpRequest;
    let questionId= helpRequest.requestId;
    let question = await getLearnerQuestion(questionId)
    question.solver={
      userId:helpRequest.participant,
      rating:rating
    }
    await updateLearnerQuestion(question)
    let res = await updateUser(user);
    return res
  
  }catch(error){
    console.log(error)
  }
}





module.exports={
    helpReviewFlowActions
}