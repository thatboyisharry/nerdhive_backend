const {updateUser,getLearner, addLesson, addJob } = require("../services/apiCalls");

const PAYOUT='175'
const createLessonFlowActions=async(action,user_response,user)=>{

    if(action.name==="saveSubject"){
        let success= await saveSubject(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="saveTopic"){
        let success= await saveTopic(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="saveObjective"){
        let success= await saveObjective(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="createJob"){
        let success= await createJob(user);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="saveLocation"){
        let success= await saveLocation(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="saveLearner"){
        let success= await saveLearner(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    if(action.name==="createLesson"){
        let success= await createLesson(user);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

   

}

///////////////////////////////////
const saveSubject=async(user,subject)=>{

    let lesson={
        subject:subject,
        objectives:[],
        status:'uncomplete'
    }

    user.session.data.lesson=lesson;
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveTopic=async(user,topic)=>{
    const { lesson }=user.session.data;

    lesson.topic=topic

    user.session.data.lesson=lesson;
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveObjective=async(user,objective)=>{
    const { lesson }=user.session.data;

    lesson.objectives.push(objective);

    user.session.data.lesson=lesson;
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveLearner=async(user,learner_code)=>{
    const { lesson }=user.session.data;

    let learner=await getLearner(learner_code)
    if(learner==null){
        return false
    }
    lesson.learnerId=learner.userId
    lesson.grade=learner.grade
    user.session.data.lesson=lesson
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////


const createJob=async(user)=>{
    const { lesson }=user.session.data;

    let payout = '175';
    let id = uuidv1();
    lesson.id=id
    let job = {
        id:id,
        payout: payout,
        interestedCandidates:[],
        uninterestedCandidates:[],
        lesson:lesson
    } 

    try{
        await addLesson(lesson);
        await addJob(job);
        user.session.data={}
        let res = await updateUser(user);
        return res
    }catch(error){
        console.log(error)
    }
}

///////////////////////////////////
const saveLocation=async(user,location)=>{
    const { lesson }=user.session.data;
    if(location==='online'){
        lesson.location=location
    }else{
        let learner = await getLearner(lesson.learnerId);
        lesson.location=learner.location
    }
    
    user.session.data.lesson=lesson
    let res = await updateUser(user);
    
    return res
}



module.exports={
    createLessonFlowActions
  }