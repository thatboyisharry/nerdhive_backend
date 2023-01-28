const {v1} =require('uuid');
const uuidv1 = v1;
const {updateUser,updateTimetable,getTimetable, getLesson, addQuestion} = require("../services/apiCalls");
const { createLearnerQuestion } = require('./utils');
const {mathsolver} =require('../mathsolver');
const { getMediaUrl,getImage,uploadToCloud,uploadToWhatsapp,readImageText } = require('./utils');
const FormData = require('form-data');


const mathHomeworkAssistanceFlowActions= async(action,user_response,user)=>{

    if(action.name==='solveProblem'){
        let success= await solveMathProblem(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
   if(action.name==='saveSolution'){
        let success= await saveSolutionImage(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }


    if(action.name==='saveMathProblem'){
        let success= await saveMathProblem(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
  if(action.name==='saveMathSolProblem'){
        let success= await saveMathSolProblem(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
  if(action.name==='saveAdditionalNotes'){
        let success= await saveAdditionalNotes(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
} 



/////////////////////////////////////

const saveMathProblem=async(user,problem)=>{
  
  let question = createLearnerQuestion(user,"Mathematics")
    question.topic=user.session.data.question?user.session.data.question.topic:'unspecified'
    question.question.id=problem
    question.grade=user.grade?user.grade:'unkwown'
    user.session.data={question:{}}
    user.session.data.question=question;
    let res= await updateUser(user);
    return res
  
  
}

/////////////////////////////////////

const saveMathSolProblem=async(user,solution)=>{
  
  let question = createLearnerQuestion(user,"Mathematics")
    question.topic=user.session.data.question?user.session.data.question.topic:'unspecified'
    question.solutionImages.push(solution)
    question.grade=user.grade?user.grade:'unkwown'
    user.session.data={question:{}}
    user.session.data.question=question;
    let res= await updateUser(user);
    return res
  
  
}

const saveAdditionalNotes=async(user,notes)=>{
    const {question}=user.session.data;
    question.notes=notes
   
    user.session.data.question=question;
    let res= await updateUser(user);
    return res

}



const saveSolutionImage=async(user,solution)=>{
    const {question}=user.session.data;
    question.solutionImages.push(solution)
   
    user.session.data.question=question;
    let res= await updateUser(user);
    return res

}

/////////////////////////////////////

const solveMathProblem=async(user,imageId)=>{
    
    try{
      let imageUrl =await getMediaUrl(imageId);
      console.log(imageUrl)
      if(!(imageUrl='not_image')){
        let formdata = await getImage(imageUrl);
        let dataUrl = await uploadToCloud(formdata);
        let mathproblem = await readImageText(dataUrl);
        let solutionImage = await mathsolver(mathproblem);
           //if was unable to solve math problem
          if(!solutionImage){
            return false
          }
        
        
        let imageBase64String=Buffer.from(solutionImage).toString('base64')
        let formData= new FormData();
        formData.append('image',imageBase64String);
        let solutionImageUrl= await uploadToCloud(formData);
        console.log("solution image url")
        console.log(solutionImageUrl)
        user.session.data.mathsolver={solutionLink:solutionImageUrl}
        
      }else{
        let mathproblem=imageId
        let solutionImage = await mathsolver(mathproblem);
        //if was unable to solve math problem
        if(!solutionImage){
          return false
        }
        let imageBase64String=Buffer.from(solutionImage).toString('base64')
        let formData= new FormData();
        formData.append('image',imageBase64String);
        let solutionImageUrl= await uploadToCloud(formData);
        console.log("solution image url")
        console.log(solutionImageUrl)
        user.session.data.mathsolver={solutionLink:solutionImageUrl}
      }
      
      
      
    }catch(error){
      console.log(error)
    }
    
    let res= await updateUser(user);
    return res

}

/////////////////////////////////////




module.exports = {
    mathHomeworkAssistanceFlowActions
}