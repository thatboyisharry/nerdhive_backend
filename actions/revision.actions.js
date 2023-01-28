const {updateUser, getWorksheet,getNotes,addNotes,addWorksheet,addTest } = require("../services/apiCalls");
const { createWorksheet, createNotes } = require('./utils');
const {generateNotes,generateQuestions} = require("../services/generative.models.services.js");
const autocorrect = require('autocorrect')()
const {v1} =require('uuid');
const uuidv1 = v1;
const revisionFlowActions=async(action,user_response,user)=>{

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

    if(action.name==="addSubtopic"){
        let success= await addSubtopic(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
    
    if(action.name==="createTest"){
        let success= await generateWorksheet(user);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
    if(action.name==="getQuestion"){
        let success= await getQuestion(user,user_response)
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }

    
   

}

///////////////////////////////////
const saveSubject=async(user,subject)=>{

    let worksheet={
        subject:subject,
        topic:'',
        subtopics:[]
    }

    user.session.data.worksheet=worksheet;
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const saveTopic=async(user,topic)=>{
    const { worksheet }=user.session.data;
  //parse the topic
    topic=topic.replace(/\./g,"").toLowerCase().trim();
    worksheet.topic=topic

    user.session.data.worksheet=worksheet;
    let res = await updateUser(user);
    
    return res
}

///////////////////////////////////
const addSubtopic=async(user,subtopic)=>{
    const { worksheet }=user.session.data;
    
    //parse subtopic
    subtopic=subtopic.replace(/\./g,"").toLowerCase().trim();
  
    worksheet.subtopics.push(subtopic);

    user.session.data.worksheet=worksheet;
    let res = await updateUser(user);
    
    return res
}


//////////////////////////////////

//function to randomly generate X numbers between a certain range
const randomUnique = (range, count) => {
  console.log("generating random numbers")
  let nums = new Set();
  while (nums.size < count) {
      nums.add(Math.floor(Math.random() * (range - 1 + 1) + 1));
    console.log(nums.size,"current size")
    console.log(count,"limit")
  }
  console.log("done generating random numebers")
  return [...nums];
}

const generateWorksheet=async(user)=>{
  const { worksheet }=user.session.data;
  
 console.log("generating worksheet")
  
  
  
 try{
    let subtopics=worksheet.subtopics
    let worksheet_questions=[]
    let query={
      topic:worksheet.topic,
    }
    //get the worksheet of each provided subtopic
    for(let i = 0 ; i < subtopics.length;i++){
      let subtopic = subtopics[i];
      query.subtopic=subtopic
      console.log("getting subtopic worksheet")
      let subtopic_worksheet=await getWorksheet(query)
      //if worksheet doesn't exist already, generate one for that subtopic
      if(!subtopic_worksheet){
        console.log("generating subtopic worksheet")
        subtopic_worksheet=await generateSubtopicWorksheet(query)
      }
      
      worksheet_questions=worksheet_questions.concat(subtopic_worksheet.questions);
      console.log("have worksheet questions worksheet")

    }
   
  
   
  //genrating random numbers to select quetsions to add in the worksheet
   console.log(worksheet_questions.length,"total questions")
   let count = worksheet_questions.length 
   count=count<=20?count:20;
   let random_question_numbers = randomUnique(worksheet_questions.length,count);
  
   //inserting random quetsions into the final worksheet
  let final_questions = []
  // let final_questions = worksheet_questions
   for(let i = 0; i< count;i++){
     console.log("adding questions")
     if(!(worksheet_questions[random_question_numbers[i]]==null)){

       final_questions.push(worksheet_questions[random_question_numbers[i]])  
    }
       
    console.log(final_questions.length, "current num of qs")
     
  }
   console.log("done randomly selecting questions")
   //selecting the first quetsion,it's now on at first
   user.session.data.current_question=null
   //array to put completed questions
   user.session.data.completed_questions=[]
   //array with all the questions
   user.session.data.revision_questions=final_questions

    let res = await updateUser(user);
    
    return res
     
   
 }catch(error){
   console.log(error)
 }
  
}
///////////////////////////////////////////
const getQuestion=async(user,answer)=>{
    //suggestion ,change function name to getNextQuestion
  //if answer is mark test it means we have run out of questions and it's time to mark the test
  
  if(!(answer==='mark_test')){
    console.log("we are not at the end yet")
    //save the question that was just completed and add the completed question to the array of completed questions
    if(user.session.data.current_question!==null){
        let completed_question={
        question:user.session.data.current_question,
        learner_answer:answer
      }
      user.session.data.completed_questions.push(completed_question)
    }
    //select the next question to be answered
    let questions = user.session.data.revision_questions;
    let question = questions.length>0?questions.pop():null;
    user.session.data.current_question=question
    user.session.data.revision_questions=questions

    let res = await updateUser(user)
    return res
  
  
  }
  
  let res = await markTest(user);
  
  return res
  
  
  
}


const markTest=async(user)=>{
  let allQuestions = user.session.data.completed_questions;
  let total_correct=[]
  let total_incorrect=[]
  
  for(let i = 0;i<allQuestions.length;i++){
    let question = allQuestions[i]
    //for question of type true of false
    if(question.question.type==='true_or_false'){
      if(question.question.answer.toLowerCase()==question.learner_answer.toLowerCase()){
        total_correct.push(question.question);
      }else{
        total_incorrect.push(question.question)
      }
    }
    
    //for multiple choice questions
    if(question.question.type==='multiple_choice'){
      if(question.question.answer_key.toLowerCase()==question.learner_answer.toLowerCase()){
        total_correct.push(question.question);
      }else{
        total_incorrect.push(question.question)
      }
    }
    
    
  }
  
  // complile the test stats
  let total_correct_count=total_correct.length
  let worksheet = user.session.data.worksheet
  let test_stats={
    id:uuidv1(),
    userId:user.id,
    topic:worksheet.topic,
    subtopics:worksheet.subtopics,
    subject:worksheet.subject,
    date:new Date(),
    total_correct:total_correct_count,
    total_incorrect:total_incorrect.length,
    percentage:((total_correct_count/allQuestions.length)*100).toFixed(2),
    correct_questions:total_correct,
    incorrect_questions:total_incorrect
    
  }
 
  user.session.data.test_stats=test_stats;
  await addTest(test_stats)
  let res = await updateUser(user);


}









////////////////////////////////////////
const generateSubtopicWorksheet=async(query)=>{
  const {topic, subtopic } = query
  let notes = await getNotes(query);
  if(!notes){
    let notes_topic=`${topic} focusing on this subtopic: ${subtopic}`
    notes = await generateNotes(notes_topic);
    let new_notes = createNotes(topic,subtopic,notes);
    await addNotes(new_notes)
  }
  let questions = await generateQuestions(notes);
  let worksheet = createWorksheet(topic,subtopic,questions)
  await addWorksheet(worksheet)
  console.log(worksheet)
  return worksheet;
  
  
   
}

module.exports={
   revisionFlowActions
  }