const dataConnection = require('../models/connections/data');
const User=dataConnection.models.User;
const {updateUser,updateLead,getLead,addCustomerQuery} = require("../services/apiCalls");
const { createCustomerQuery } = require('./utils');
const { generateQueryImage } = require('../services/queryGenerator');


const onboardingFlowActions=async(action,user_response,user)=>{
  
  
  if(action.name==='saveName'){
    let success = await saveName(user,user_response);
    if(success){
      return action.onSuccess
    }else{
        return action.onFailure
    }
  }
  
  if(action.name==='isLearner'){
    let success = await isLearner(user);
    if(success){
      return action.onSuccess
    }else{
        return action.onFailure
    }
  }

  if(action.name==='isParent'){
    let success = await isParent(user,user_response);
    if(success){
      return action.onSuccess
    }else{
        return action.onFailure
    }
  }
  
  if(action.name==='saveParentName'){
    let success = await saveParentName(user,user_response);
    if(success){
      return action.onSuccess
    }else{
        return action.onFailure
    }
  }
  
  if(action.name==='saveLearnerName'){
    let success = await saveLearnerName(user,user_response);
    if(success){
      return action.onSuccess
    }else{
        return action.onFailure
    }
  }
  
  if(action.name==="saveSchoolingLevel"){
    console.log("inside saving schooling Level")
    let success = await saveSchoolingLevel(user,user_response);
    if(success){
      console.log(action.onSuccess,"trigger")

      return action.onSuccess
    }else{
        return action.onFailure
    }
  }
  
  if(action.name==="saveGrade"){
    let success = await saveGrade(user,user_response);
    if(success){
      return action.onSuccess
    }else{
        return action.onFailure
    }
  }
  
  if(action.name==="saveStudentProgram"){
    let success = await saveStudentProgram(user,user_response);
    if(success){
      return action.onSuccess
    }else{
        return action.onFailure
    }
  }
  
  if(action.name==="getQuestion"){
    let success = await getQuestion(user,user_response);
    if(success){
      return action.onSuccess
    }else{
        return action.onFailure
    }
  }
  
   if(action.name==="saveBudget"){
    let success = await saveBudget(user,user_response);
    if(success){
      return action.onSuccess
    }else{
        return action.onFailure
    }
  }

  return ""
 
}
///***********************************************************///
const getQuestion=async(user,response)=>{
  let lead = await getLead(user)
  console.log("lead in get question",lead)
  if(!user.session.data){
    user.session.data={
      questions:[]
    }
    let questionnaire= getQuestionnaire(lead);
    user.session.data.questions=questionnaire;
    user.session.data.completed_questions=[];
  }
  
  //save user response of current question
  if(user.session.data.current_question){
    let current_question = user.session.data.current_question
    current_question.response=response
    user.session.data.completed_questions.push(current_question)
  }
  
  let questions = user.session.data.questions
  
  //check if you still have qeestions and get the next question
  if(questions.length>0){
    user.session.data.current_question=questions.shift();
    user.session.data.questions=questions
    let res = await updateUser(user)
    return res
  }else{
    //if you are out of questions evaluate the qestionnaire responses
    let completed_questions=user.session.data.completed_questions
    let report=evaluateResponses(completed_questions)
    user.session.data.report=report
    
    await updateUser(user)
    ///need to update lead here
     await updateLead(user,{questionnaire_responses:report})
    //false means that we are need of the questionnaire, transiton to next phase
    return false
  }
  
  
}

const evaluateResponses=(questions)=>{
  let coaching_score=0
  let more_than_two_subjects=false
  let questionnaire_transcript=''
  
  for(let i = 0 ; i < questions.length; i++){
    
    let question = questions[i]
    //search for the " is struggling with more than 2 subjects" question
    if(question.question_text.search(/subjects/i)!==-1&&question.type==="yes_or_no"){
      if(question.response==='yes'){
        more_than_two_subjects=true
      }
    }
    
    if(question.type==='yes_or_no'){
      if(question.response==='yes'&&question.coaching==='yes'){
        coaching_score +=1
      }
      
      if(question.response==='no'&&question.coaching==='no'){
        coaching_score +=1
      }
    }
    
    let questionnaire_response = `\nQuestion: ${question.question_text} \nResponse:${question.response}\n\n`
    questionnaire_transcript = questionnaire_transcript + questionnaire_response
    
  }
  
  return {
    coaching_score,
    more_than_two_subjects,
    questionnaire_transcript
  }
}

// generates a questionnaire bases on lead info provided
const getQuestionnaire=(lead)=>{
  
  let questionnaire=[]
  class Question{
    constructor(question_text,type,coaching,tutoring){
      this.question_text=question_text;
      this.type=type;
      this.coaching=coaching;
      this.tutoring=tutoring;
      this.response=''
    }
  }
  let yes_or_no_type='yes_or_no';
  let text_response_type='text_response'
  let yes='yes'
  let no='no'
  
  //check if lead is a parent
  console.log("lead in get questionnaire", lead)
  if(lead.isParent){
    //is child a boy or girl
    let son_or_daughter = lead.isBoy===true?"son":"daughter"
    
    let question_1=new Question(`Is struggling with more than TWO subjects`,yes_or_no_type,yes,no)
    let question_2=new Question(`Has trouble focusing`,yes_or_no_type,yes,no)
    let question_3=new Question(`Has trouble taking tests`,yes_or_no_type,yes,no)
    let question_4=new Question(`You think the problem is more to do with attitude and motivation`,yes_or_no_type,yes,no)
    let question_5=new Question(`What subject(s) does your ${son_or_daughter} need help with ?`,text_response_type)
    questionnaire=[question_1,question_2,question_3,question_4,question_5]
  }else{
    let question_1=new Question(`I am struggling with more than TWO subjects`,yes_or_no_type,yes,no)
    let question_2=new Question(`I have trouble focusing`,yes_or_no_type,yes,no)
    let question_3=new Question(`I have problems with taking tests`,yes_or_no_type,yes,no)
    let question_4=new Question(`I am not sure if I know to study to study effectively`,yes_or_no_type,yes,no)
    let question_5=new Question(`What subject(s) do you need help with ?`,text_response_type)
    questionnaire=[question_1,question_2,question_3,question_4,question_5]
  }
  
  
  return questionnaire
}

///*******************************************************************///
/////////////////////////
const isLearner=async(user)=>{
  
  let data={
    isLearner:true
  }
  
  let status = await updateLead(user,data);
  
  return status
  
    
}


//////////////////////////
const isParent=async(user,child_gender)=>{
  
  
  
  let data={
    isParent:true,
    isBoy:child_gender==='boy'?true:false,
    isGirl:child_gender==='girl'?true:false
  }
  
  let status = await updateLead(user,data);
  
  return status;
  
    
}


//////////////////
const saveName=async(user,name)=>{
  
  let data={
    name:name
  }
  
  let status = await updateLead(user,data);
  
  return status
  
    
}
//////////////////
const saveParentName=async(user,name)=>{
  
  let data={
    parentName:name
  }
  
  let status = await updateLead(user,data);
  
  return status
  
    
}
//////////////////
const saveLearnerName=async(user,name)=>{
  await getQuestion(user)
  let data={
    learnerName:name
  }
  
  let status = await updateLead(user,data);
  
  return status
  
    
}
//////////////////
const saveBudget=async(user,budget)=>{
  
  let data={
    budget:budget
  }
  
  let status = await updateLead(user,data);
  await createLeadQuery(user);
  
  return status
  
    
}
////////////////////////////////////////////

const createLeadQuery=async(user)=>{
  let lead = await getLead(user)
  let data={
    type:"lead",
    id:user.id
  }
  let customerQuery=createCustomerQuery(data)
  customerQuery.lead=lead
  customerQuery.user=user
  let queryInfoImageLink = await generateQueryImage(customerQuery)
  customerQuery.queryInfo.imageLink=queryInfoImageLink
  let res = await addCustomerQuery(customerQuery);
  return res   
}






///////////////////////////////////////////

////////////////////////////////////
const saveSchoolingLevel=async(user,school_level)=>{
  let level = school_level.replace(/_/g," ");
  
  let data={
    schoolingLevel:level
  }
  
  let status = await updateLead(user,data);
  
  return status
  
    
}
////////////////////////////////////
const saveGrade=async(user,grade)=>{
  
  let data={
    grade:grade
  }
  
  let status = await updateLead(user,data);
  
  return status
  
    
}

////////////////////////////////////
const saveStudentProgram=async(user,program)=>{
  
  let data={
    studentProgram:program
  }
  
  let status = await updateLead(user,data);
  
  return status
  
    
}

/////////////////////////////////////

const doneOnboarding=async(user)=>{
  
  let data={
    isOnboarding:false,
    isOnboarded:true
  }
  
  let status = await updateUser(user,data);
  
  return status
  
    
}




module.exports = {
  onboardingFlowActions,
  updateUser
}