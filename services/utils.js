 const { updateUser,addUser,addConversation } = require("./apiCalls");
const {v1} =require('uuid');
const uuidv1 = v1;

class Timetable{
    constructor(userId){
        this.userId = userId;
        this.monday=[];
        this.tuesday=[];
        this.wednesday=[];
        this.thursday=[];
        this.friday=[];
        this.saturday=[];
        this.sunday=[];
    }
}

class Learner{ 
    constructor(userId){
        this.userId=userId;
        this.coachId=userId;
        this.learnerCode=userId;
    }
}

class Coach{
    constructor(learner){
        this.userId=learner.userId;
        this.coachId=learner.userId;
        this.learner=[learner.userId]
        this.phone=[learner.phone]
    }
}

const createUser=(data)=>{
  const {name,surname,phone,userId}=data;
  let userCode = createUserCode(data);
    let date = new Date()
    let user={
        id:uuidv1(),
        name:name,
        userCode:userCode,
        surname:surname,
        phone:phone,
        session:{
            flow:'',
            node:'start',
            num:0,
            isActive:false,
            helpRequest:{
              invite:false,
              requestId:'',
              learnerId:'',
            },
            chat:{
            active:false,
            partiipant:null
            },
          data:{},
        }
    }

    return user
}
const createUserCode=(user)=>{
    if(user.phone&&user.name){
        let num_part = user.phone.toString().split('').slice(8,).join('');
        let alpha_part = user.name.split('').slice(0,4).join('');
        let userCode = alpha_part + num_part;
        userCode=userCode.toUpperCase();
        return userCode;
    }
}



const resetSession=async(user)=>{
  console.log("inside reset session")
  if(user.isLead){
    console.log("returning lead user")
    return user
  }
  
  console.log(user)
  if(!user.session.lastUpdated){
    return user
  }
  let lastUpdated=user.session.lastUpdated
  let currentTime =new Date();
  let timePassedInSeconds = Math.round((currentTime-lastUpdated)/1000)
  
  
  let timePassedInMinutes=Math.round(timePassedInSeconds/60);
  
  // should only reset session when 15minutes has passed and user has no active chat or chat invites
  if(timePassedInMinutes>15){
    if(user.isCoach&&!(user.session.chat.invite||user.session.chat.active||user.session.helpRequest.solving||user.session.helpRequest.invite)){
      user.session.flow='coach_menu'
      user.session.node='start'
      user.session.data={}
    }
    
     if(user.isLearner&&!(user.session.chat.invite||user.session.chat.active||user.session.helpRequest.solving||user.session.helpRequest.invite)){
      // save convesation if user was mid convrsation
       if(user.session.data.studytools&&user.session.data.studytools.conversation){
         let conversation = user.session.data.studytools.conversation
         await addConversation(conversation);
       }
      user.session.flow='learner_menu'
      user.session.node='start'
      user.session.data={}
    }
    
     if(user.isTutor&&!(user.session.chat.invite||user.session.chat.active||user.session.helpRequest.solving||user.session.helpRequest.invite)){
      user.session.flow='tutor_menu'
      user.session.node='start'
      user.session.data={}
    }
    
    if(user.isParent&&!(user.session.chat.invite||user.session.chat.active||user.session.helpRequest.solving||user.session.helpRequest.invite)){
      user.session.flow='parent_menu'
      user.session.node='start'
      user.session.data={}
    }
  }
  
  return user
  
}

const parseTrueOrFalseQuestions=(questions_string)=>{
  
  let questions=[];
  
  let unstructured_questions = questions_string.trim().split("*");
  console.log("parsing questions")
  for(let i = 1 ; i< unstructured_questions.length;i++){
    let question_array = unstructured_questions[i].split("Answer: ")
    let question={
      question:question_array[0],
      answer:question_array[1].trim(),
      type:'true_or_false'
    }
    questions.push(question);
  }
  
  return questions
}

const parseMultipleChoiceQuestions=(questions_string)=>{
  
  let questions=[];
  
  let unstructured_questions = questions_string.trim().split("*");
  console.log("parsing questions")
  for(let i = 1 ; i< unstructured_questions.length;i++){
    let question_array = unstructured_questions[i].split("Answer: ")
    
    let answer_key=question_array[1].split("")[0]
    let question={
      question:question_array[0],
      answer:question_array[1].trim(),
      answer_key:answer_key,
      type:'multiple_choice'
    }
    questions.push(question);
  }
   
  return questions
}

const createTimetable=(userId)=>{
    let timetable = new Timetable(userId);
    return timetable
}

const createLearner=(userId)=>{
    let learner = new Learner(userId);
    return learner
}

const createCoach=(learner)=>{
    let coach = new Coach(learner);
    return coach
}
module.exports={
    createTimetable,
    createLearner,
    createCoach,
    createUserCode,
    resetSession,
    parseMultipleChoiceQuestions,
    parseTrueOrFalseQuestions,
    
}




