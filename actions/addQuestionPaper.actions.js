const {updateUser, } = require("../services/apiCalls");
const { createQuestionPaper,addQuestionPaperDetails } = require('./utils');


const addQuestionPaperFlowActions=async(action,user_response,user)=>{

    if(action.name==="saveSubject"){
        let success= await saveSubject(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
    if(action.name==="saveQuestionPaperDetails"){
        let success= await saveQuestionPaperDetails(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
    if(action.name==="saveQuestionPaper"){
        let success= await saveQuestionPaper(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
    if(action.name==="saveMemo"){
        let success= await saveMemo(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
    
  
  

   

}

///////////////////////////////////
const saveSubject=async(user,subject)=>{

    let questionPaper= createQuestionPaper(subject)

    user.session.data.questionPaper=questionPaper;
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveQuestionPaperDetails=async(user,details)=>{
   let questionPaper = user.session.data.questionPaper
   questionPaper = addQuestionPaperDetails(questionPaper,details);
    if(questionPaper===null){
      console.log("insufficent info")
      return false;
    }
  
    if(!(Number.isInteger(questionPaper.grade))){
      console.log("grade is not an int")
      return false
    }
    
    
    user.session.data.questionPaper= questionPaper;
   
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveQuestionPaper=async(user,questionPaper_id)=>{
  
    user.session.data.questionPaper.questionPaper.id=questionPaper_id;
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveMemo=async(user,memo_id)=>{
  


    user.session.data.questionPaper.memo.id=memo_id;
    let res = await updateUser(user);
    
    return res
}




module.exports={
    addQuestionPaperFlowActions
  }