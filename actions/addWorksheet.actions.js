const {updateUser, addWorksheet } = require("../services/apiCalls");
const { createWorksheet,addWorksheetDetails } = require('./utils');


const addWorksheetFlowActions=async(action,user_response,user)=>{

    if(action.name==="saveSubject"){
        let success= await saveSubject(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
    if(action.name==="saveWorksheetDetails"){
        let success= await saveWorksheetDetails(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
    if(action.name==="saveWorksheet"){
        let success= await saveWorksheet(user,user_response);
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
    
    if(action.name==="uploadWorksheet"){
        let success= await uploadWorksheet(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
  

   

}

///////////////////////////////////
const uploadWorksheet=async(user,subject)=>{

    let worksheet= user.session.data.worksheet
       await addWorksheet(worksheet);
    
    let res = await updateUser(user);
    
    return res
}
///////////////////////////////////
const saveSubject=async(user,subject)=>{

    let worksheet= createWorksheet(subject)

    user.session.data.worksheet=worksheet;
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveWorksheetDetails=async(user,details)=>{
   let worksheet = user.session.data.worksheet
   worksheet = addWorksheetDetails(worksheet,details);
    if(worksheet===null){
      console.log("insufficent info")
      return false;
    }
  
    if(!(Number.isInteger(worksheet.grade))){
      console.log("grade is not an int")
      return false
    }
    
    
    user.session.data.worksheet= worksheet;
   
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveWorksheet=async(user,worksheet_id)=>{
  
    user.session.data.worksheet.worksheet.id=worksheet_id;
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveMemo=async(user,memo_id)=>{
  


    user.session.data.worksheet.memo.id=memo_id;
    let res = await updateUser(user);
    
    return res
}




module.exports={
    addWorksheetFlowActions
  }