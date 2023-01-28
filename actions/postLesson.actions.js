const {updateUser,updateLesson } = require("../services/apiCalls");

const postLessonFlowActions=async(action,user_response,user)=>{

    if(action.name==="saveRating"){
        let success= await saveLessonRating(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="saveLessonPros"){
        let success= await saveLessonPros(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="saveLessonCons"){
        let success= await saveLessonCons(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="wasAppropriate"){
        let success= await wasAppropriate(user);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="wasInappropriate"){
        let success= await wasInappropriate(user);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="saveConductNotes"){
        let success= await saveConductNotes(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="saveAdditionalNotes"){
        let success= await saveAdditionalNotes(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="saveUnderstandingRating"){
        let success= await saveUnderstandingRating(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }



    

}

///////////////////////////////////
const saveLessonRating=async(user,rating)=>{

    let review ={
        lessonRating:rating,
        understandingRating:'',
        prosNotes:'',
        consNotes:'',
        appropriateConduct:true,
        conductNotes:'',
        additionalNotes:'',
        date:''

    }

    user.session.data.review=review
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveLessonPros=async(user,notes)=>{
    const { review }=user.session.data;

    review.prosNotes=notes

    user.session.data.review=review
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveLessonCons=async(user,notes)=>{
    const { review }=user.session.data;

    review.consNotes=notes

    user.session.data.review=review
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const wasAppropriate=async(user)=>{
    const { review }=user.session.data;

    review.appropriateConduct=true

    user.session.data.review=review
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const wasInappropriate=async(user)=>{
    const { review }=user.session.data;

    review.appropriateConduct=false;

    user.session.data.review=review
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveConductNotes=async(user,notes)=>{
    const { review }=user.session.data;

    review.conductNotes=notes

    user.session.data.review=review
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveAdditionalNotes=async(user,notes)=>{
    const { review }=user.session.data;

    review.additionalNotes=notes

    user.session.data.review=review
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveUnderstandingRating=async(user,rating)=>{
    const { review,lesson }=user.session.data;

    review.understandingRating=rating

    if(user.isLearner){
        lesson.learnerReview=review
    }else if(user.isTutor){
        lesson.tutorReview=review
    }
    
    try{
        await updateLesson(lesson)
        user.session.data={}
        let res = await updateUser(user);
       
        return res
    }catch(error){
        console.log(error)
    }
   
}

module.exports={
    postLessonFlowActions
  }