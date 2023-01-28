const { startChat} = require("../dialogEngine/startChat");
const {  getUser, updateUser, getLearnerQuestion,updateLearnerQuestion, getWorksheet } = require("../services/apiCalls");
const { getWorksheetQueryObj } = require('./utils');

const worksheetsFlowActions=async(action,user_response,user)=>{
    
    if(action.name==="saveSubject"){
        let success= await saveSubject(user,user_response);
        if(success){
         
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="getWorksheet"){
        let success= await getSubWorksheet(user,user_response);
        if(success){
          
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
   
}

const saveSubject=async(user,subject)=>{
   user.session.data.worksheet={subject:subject, query:" "};
    

    let res = await updateUser(user);
    
    return res

}
//////////////////////////////

const getSubWorksheet=async(user,query)=>{
    let subject = user.session.data.worksheet.subject;
    
    let queryObj=getWorksheetQueryObj(subject,query)
    
    if(queryObj===null){
      return false
    }
  
    let worksheet = await getWorksheet(queryObj)
    user.session.data.worksheet.data=worksheet;
    let res = await updateUser(user);
    
    return res

}
//////////////////////////////



module.exports={
    worksheetsFlowActions
}