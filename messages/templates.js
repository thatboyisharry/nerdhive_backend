const {getProperty, getTimetable, getLesson, getTutor,updateUser,getCustomerQuery, getLearner, getLearnerQuestion, getCoach, getParent,getLead} = require("../services/apiCalls");
const { getWeelkyAppointments } = require("./utils");


const templateActionsHandler=async(message,user)=>{
    const { template } = message;
    let filledTemplate
    ////////////*****onboarding templates*********////////////////////
    //1. Parent questionnaire
    if(template.name==='ask_child_name'){
      let lead = await getLead(user);
      let son_or_daughter=lead.isBoy===true?"son":"daughter"
      let message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type:'text',
            text:{
              body:`What's the name of your ${son_or_daughter} ?` 
                    
              }
          }
      return message;
    }
  ////2.PARENT QUESTIONNARE
    if(template.name==='parent_questionnaire'){
      console.log(user, "lead user")
      let lead = await getLead(user);
      let question = user.session.data.current_question
      let message
      let son_or_daughter=lead.isBoy===true?"son":"daughter"
      if(question.type==='yes_or_no'){
        message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type: "interactive",
            interactive:{
              type:'button',
                body:{
                  text:`*Does the statement below describe your ${son_or_daughter} ?* \n\n ${question.question_text}`
                        
                  },
                action:{
                  buttons:[{type:"reply",
                            reply:{id:"yes",title:"Yes"}},
                           {type:"reply",
                            reply:{id:"no",title:"No"}}
                          ]
                }
              }
            } 
        
      }else{
         message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type:'text',
            text:{
              body:question.question_text
                    
              }
          }
      }
    
      return message;
    }
  
  ////3. LEARNER QUESTIONNARE
    if(template.name==='learner_questionnaire'){
      let lead = await getLead(user);
      let question = user.session.data.current_question
      let message
      if(question.type==='yes_or_no'){
        message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type: "interactive",
            interactive:{
              type:'button',
                body:{
                  text:`*Does the statement below describe you ?* \n\n ${question.question_text}`
                        
                  },
                action:{
                  buttons:[{type:"reply",
                            reply:{id:"yes",title:"Yes"}},
                           {type:"reply",
                            reply:{id:"no",title:"No"}}
                          ]
                }
              }
            } 
        
      }else{
         message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type:'text',
            text:{
              body:question.question_text
                    
              }
          }
      }
    
      return message;
    }
  ////4. PRICING INFO
    if(template.name==='pricing_info'){
      
     
      let pricing_info_link='http://res.cloudinary.com/dqstqz2nt/image/upload/v1674379521/fwgivlob8p028qeuf7xi.jpg'
      let image_id="524556566438033"
     
      let pricing_info={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type: "interactive",
            interactive:{
              type:'button',
                header:{
                  type:"image",
                  image:{
                    link:pricing_info_link
                    }
                },
                body:{
                  text: "Here is how our pricing works, please select your budget below so that we are able to put together the best possible solution for you according to your budget."
                  },
                footer:{
                    text: `Select your montly budget`
                    },
                action:{
                  buttons:[{type:"reply",
                            reply:{id:"R2000+",title:"R2000+"}},
                           {type:"reply",
                            reply:{id:"R1000-R2000",title:"R1000 - R2000"}},
                           {type:"reply",
                            reply:{id:"R500-R1500",title:"R500 - R1000"}}
                          ]
                }
              }
            } 

     
      return pricing_info;
    }
    ////////////*****onboarding templatees*********////////////////////
    ///////////////////////////////////////////////////////////////////
  
  
  ////////////*****customer support templatees*********////////////////////
    ///////////////////////////////////////////////////////////////////
  if(template.name==='send_support_query'){
    let queryId = user.session.customerSupport.queryId;
    let query = await getCustomerQuery(queryId)
    let message={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type: "interactive",
            interactive:{
              type:'button',
                header:{
                  type:"image",
                  image:{
                    link:query.queryInfo.imageLink
                    }
                },
                body:{
                  text: "Are you ready to chat to the customer ?"
                  },
                footer:{
                    text: `Please remember to be polite to the customer`
                    },
                action:{
                  buttons:[{type:"reply",
                            reply:{id:"yes",title:"Yes"}},
                           {type:"reply",
                            reply:{id:"no",title:"No"}}
                          ]
                }
              }
            } 
         return message
  }
  if(template.name==='alert_client'){
     let queryId = user.session.cutsomerSupport.queryId;
     let query = await getCustomerQuery(queryId)
     let message
     if(query.type==='lead'){
       // send options and let them know you'll help them choose
       message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type:'text',
            text:{
              body:"" 
                    
              }
          }
      }
    
  }
  
  ////////////*****customer support templatees*********////////////////////
    ///////////////////////////////////////////////////////////////////
    if(template.name==='upcoming_lessons'){
      let messages=[]
      //get learner timetable
      let timetable = await getTimetable(user.id);
      //filter from current day to sunday
      let appointments = getWeelkyAppointments(timetable)
      //get lessons from all appointments from current day to sunday
      let lessons=[]
      if(appointments.length>0){
        for (let j = 0 ; j < appointments.length; j++){
          let appointment=appointments[j]
          let lessonId = appointment.lessonId;
          let lesson = await getLesson(lessonId);
          lessons.push(lesson)
        }
        //fill templates with lesson details and return an array of templates
        for(let i = 0 ; i < lessons.length; i++){
          let lesson=lessons[i]
          filledTemplate = await  upcomingLessonsTemplate(template,lesson)
          message.template=filledTemplate
          let msg= JSON.parse(JSON.stringify(message));
          messages.push(msg);
          console.log(messages[i].template.components[0].parameters[0])
        }
        
      }
      if(messages.length>0){
        let intro_message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type:'text',
            text:{
              body:"*You have the following lessons coming this week.*"
              }
          }
          messages.unshift(message);
        
           let reschedule_message ={
              messaging_product:'whatsapp',
              recipient_type:'individual',
              to:'',
              type: "interactive",
              interactive:{
                type:'button',
                  body:{
                    text:"*Reply with lesson code to reschedule a lesson* \n\n Press menu to go back to the main menu"
                    },
                  action:{
                    buttons:[{type:"reply",
                              reply:{id:"menu",title:"Menu"}},]
                  }
                }
            }
            
          messages.push(reschedule_message);
      }else{
        let no_lessons_message ={
              messaging_product:'whatsapp',
              recipient_type:'individual',
              to:'',
              type: "interactive",
              interactive:{
                type:'button',
                  body:{
                    text:"*You have no upcoming lessons this week 😕* \n\n Press menu to go back to the main menu"
                    },
                  action:{
                    buttons:[{type:"reply",
                              reply:{id:"menu",title:"Menu"}},]
                  }
                }
            }
            
          messages.push(no_lessons_message);
      }
      
     
      
      return messages
      
    
    }
  
    if(template.name==='send_tutor_question'){
      let questionId = user.session.helpRequest.requestId;
      let question = await getLearnerQuestion(questionId)
      let messages=[]
      
      //check to see if it's a explain the solution type of question
      if(question.solutionImages.length>0){
        let solutionImages=[]
        let images=question.solutionImages
        for(let i=0;i<images.length;i++){
          let solImage={
                messaging_product:'whatsapp',
                recipient_type:'individual',
                to:'',
                type:'image',
                image:{
                    id:images[i]
                }
            }
          solutionImages.push(solImage)
        }
        
        let last_msg={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type: "interactive",
            interactive:{
              type:'button',
                header:{
                  type:"image",
                  image:{
                    id:images[images.length-1]
                    }
                },
                body:{
                  text: `Here is the question \n\n*Additional Info:*\n${question.notes}`
                  },
                footer:{
                    text: `Were you able to find the solution to the question ?`
                    },
                action:{
                  buttons:[{type:"reply",
                            reply:{id:"yes",title:"Yes"}},
                           {type:"reply",
                            reply:{id:"no",title:"No"}}
                          ]
                }
              }
            } 
        
       solutionImages.push(last_msg)
        messages= solutionImages
      }else{
        let learner_question={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type: "interactive",
            interactive:{
              type:'button',
                header:{
                  type:"image",
                  image:{
                    id:question.question.id
                    }
                },
                body:{
                  text: `Here is the question \n\n*Additional Info:*\n${question.notes}`
                  },
                footer:{
                    text: `Were you able to find the solution to the question ?`
                    },
                action:{
                  buttons:[{type:"reply",
                            reply:{id:"yes",title:"Yes"}},
                           {type:"reply",
                            reply:{id:"no",title:"No"}}
                          ]
                }
              }
            } 
          messages= [learner_question];
      }
      
      return messages;
      
      
      
    }
  
    if(template.name==='coach_learners'){
      let messages=[]
      let coach = await getCoach(user.phone);
      for(let i = 0; i<coach.learners.length;i++){
        let learner=await getLearner(coach.learners[i]);
        let filledTemplate= coachStakeholdersTemplate(learner,learner.learnerCode);
        messages.push(filledTemplate);
        
      }
      return messages
    }

    if(template.name==='coach_tutors'){
      let messages=[]
      let coach = await getCoach(user.phone);
      for(let i = 0; i<coach.tutors.length;i++){
        let tutor=await getTutor(coach.tutors[i]);
        let filledTemplate= coachStakeholdersTemplate(tutor,tutor.tutorCode);
        messages.push(filledTemplate);
        
      }
      return messages
    }
  
  ///for onboarding parent
  if(template.name==="onboard_parent"){
    
  }
  ///for onboarding learner
  if(template.name==="onboard_learner"){
    
  }
  /// for the revison questions flow
  if(template.name==="revision_worksheet"){
    let questions =user.session.data.revision_questions
    let question = user.session.data.current_question
    
    let message;
    //if the test is done and we have the results.
    if(questions.length==0&&user.session.data.test_stats){
      let test_stats=user.session.data.test_stats
      message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type:'text',
            text:{
              body:"*You got " +test_stats.percentage +"% on this topic* \n\n\n" +test_stats.total_correct + " you got correct ✔\n\n" +test_stats.total_incorrect + " you got wrong ❌" 
                    
              }
          }
      return message;
    }
    
    //if we are out of questions
    if(questions.length==0&&question==null){
      message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type: "interactive",
            interactive:{
              type:'button',
                body:{
                  text:`*You've completed all the questions*  \n\nI hope you did well😃, press "get results" to find out 
                  
                        `
                  },
                action:{
                  buttons:[{type:"reply",
                            reply:{id:"mark_test",title:"Get Results"}},
                          ]
                }
              }
            } 
      
      return message
    }
    if(question.type==='true_or_false'){
      message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type: "interactive",
            interactive:{
              type:'button',
                body:{
                  text:"*True or False*" +"\n\n" + question.question
                        
                  },
                action:{
                  buttons:[{type:"reply",
                            reply:{id:"True",title:"True"}},
                           {type:"reply",
                            reply:{id:"False",title:"False"}}
                          ]
                }
              }
            } 
      
      
    }
    
    if(question.type==='multiple_choice'){
      message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type:'text',
            text:{
              body:"*Choose correct option*" + "\n\n" + question.question
                    
              }
          }
       
      
    }
   
    

  
    return message
  }
  if(template.name==='coach_parents'){
      let messages=[]
      let coach = await getCoach(user.phone);
      for(let i = 0; i<coach.parents.length;i++){
        let parent=await getParent(coach.parents[i]);
        let filledTemplate= coachStakeholdersTemplate(parent,parent.parentCode);
        messages.push(filledTemplate);
        
      }
      return messages
    }
  
  
    if(template.name==='confirm_lesson_reschedule'){
      
      filledTemplate = await confirmRescheduleTemplate(template,user)
      message.template = filledTemplate;
      return message;
    }

    if(template.name==='confirm_time_changes'){
      
      filledTemplate = await confirmTimeChangesTemplate(template,user)
      message.template = filledTemplate;
      return message;
    }

    if(template.name==='chat_invite'){
      filledTemplate = await chatInviteTemplate(template,user)
    }
    
    if(template.name==='question_info'){
      filledTemplate = await questionInfoTemplate(template,user)
      message.template = filledTemplate;
      return message;
    }
  
    if(template.name==='attempt_info'){
      filledTemplate = await attemptInfoTemplate(template,user)
      message.template = filledTemplate;
      return message;
    }
  
    if(template.name==='worksheet'){
      filledTemplate = await worksheetTemplate(template,user)
      message.template = filledTemplate;
      return message;
    }
  
    if(template.name==='paper_memo'){
      filledTemplate = await paperMemoTemplate(template,user)
      message.template = filledTemplate;
      return message;
    }
  
    if(template.name==='translation'){
      let translation=user.session.data.studytools.translation;
        let message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type:'text',
            text:{
              body:translation
              }
          }
      
       return message;
    }
  
    if(template.name==='math_solution'){
      console.log(user.data)
       let solutionLink=user.session.data.mathsolver.solutionLink;
       let message={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type: "interactive",
            interactive:{
              type:'button',
                header:{
                  type:"image",
                  image:{
                    link:solutionLink
                    }
                },
                body:{
                  text: `Do you understand all the steps of the solution, or do you need a tutor to explain the solution to help you understand it better ?`
                  },
                
                action:{
                  buttons:[{type:"reply",
                            reply:{id:"understand",title:"I understand"}},
                           {type:"reply",
                            reply:{id:"explain",title:"Explain the solution"}}
                          ]
                }
              }
            } 
      
//       let message ={
//             messaging_product:'whatsapp',
//             recipient_type:'individual',
//             to:'',
//             type:'image',
//             image:{
//               link:solutionLink
//               }
//           }
      return message;
    }
  
    
     if(template.name==='topic_guide'){
       let topic_guide=user.session.data.studytools.topicguide;
      
      let message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type:'text',
            text:{
              body:topic_guide
              }
          }
      return message;
    }
  
     if(template.name==='study_notes'){
       let study_notes=user.session.data.studytools.studynotes;
      
      let message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type:'text',
            text:{
              body:study_notes
              }
          }
      return message;
    }
  
  if(template.name==='ai_chat_response'){
       let chat_response=user.session.data.studytools.chat_response;
        let human_response=user.session.data.studytools.human_response;
      let messages=[]
      let bot_message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type:'text',
            text:{
              body:chat_response
              }
          }
      messages.push(bot_message);
      let menu_message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type: "interactive",
            interactive:{
              type:'button',
                body:{
                  text:"Press menu to go to main menu"
                  },
                action:{
                  buttons:[{type:"reply",
                            reply:{id:"menu",title:"Menu"}},]
                }
              }
            } 
            
      if(human_response.search(/bye/i)!==-1 ){
        messages.push(menu_message);
      }
      
      
      return messages;
    }
  
     if(template.name==='q_and_a_response'){
       let answer=user.session.data.studytools.answer;
      let message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type:'text',
            text:{
              body:answer
              }
          }
      return message;
    }
  
     if(template.name==='summary'){
        let summary=user.session.data.studytools.summary;
      let message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type:'text',
            text:{
              body:summary
              }
          }
      return message;
    }
  
  
  
    return message

}

const chatInviteTemplate=async(template,user)=>{

  template.components[0].parameters[0].text=user.name

return template
  
}

const worksheetTemplate=async(template,user)=>{
    let worksheet = user.session.data.worksheet.data;
   template.components[0].parameters[0].document.id=worksheet.worksheet.id;
}
const paperMemoTemplate=async(template,user)=>{
    let worksheet = user.session.data.worksheet.data;
   template.components[0].parameters[0].document.id=worksheet.memo.id;
}
const questionInfoTemplate=async(template,user)=>{
  let questionId = user.session.helpRequest.requestId;
  let question = await getLearnerQuestion(questionId)

  template.components[0].parameters[0].image.id=question.question.id

return template

}

const attemptInfoTemplate=async(template,user)=>{
  let questionId = user.session.helpRequest.requestId;
  let question = await getLearnerQuestion(questionId)

  template.components[0].parameters[0].image.id=question.attempt.id
return template

}


const coachStakeholdersTemplate=(stakeholder,code)=>{
  
  let msgString = `*#${code} ${stakeholder.name} ${stakeholder.surname}*`
  let message ={
            messaging_product:'whatsapp',
            recipient_type:'individual',
            to:'',
            type:'text',
            text:{
              body:msgString
              }
          }
  return message
}

const upcomingLessonsTemplate=async(template,lesson)=>{

    template.components[0].parameters[0].text=lesson.lessonCode;
    template.components[1].parameters[0].text=lesson.topic;
    template.components[1].parameters[1].text=lesson.day;
    template.components[1].parameters[2].text=lesson.time;

  return template

}

const confirmRescheduleTemplate=async(template,user)=>{

  let lesson = user.session.data.lesson

  if(user.isLearner){
    
    let tutor = await getTutor(lesson.tutorId);
    template.components[0].parameters[0].text=tutor.name;
    template.components[0].parameters[1].text=lesson.day;
    template.components[0].parameters[2].text=lesson.time;
  }
  //Reschedule lesson with {tutor} on {day} @ {time} 
  if(user.isTutor){
    let learner = await getLearner(lesson.learnerId)
    template.components[0].parameters[0].text=learner.name;
    template.components[0].parameters[1].text=lesson.day;
    template.components[0].parameters[2].text=lesson.time;
  }
 

return template

}

const confirmTimeChangesTemplate=async(template,user)=>{
  const { lesson, appointment} = user.session.data

  if(user.isLearner){
    let tutor = await getTutor(lesson.tutorId);
    template.components[0].parameters[0].text=tutor.name;
    template.components[0].parameters[1].text=lesson.day;
    template.components[0].parameters[2].text=lesson.time;
    template.components[0].parameters[3].text=appointment.day;
    template.components[0].parameters[4].text=appointment.data.time;
    //you  have changed lesson with {tutor} from {day} @ {time} to {day} @time
  }
  
  if(user.isTutor){
    let learner = await getLearner(lesson.learnerId)
    template.components[0].parameters[0].text=learner.name;
    template.components[0].parameters[1].text=lesson.day;
    template.components[0].parameters[2].text=lesson.time;
    template.components[0].parameters[3].text=appointment.day;
    template.components[0].parameters[4].text=appointment.time;
    //you  have changed lesson with {learner} from {day} @ {time} to {day} @time
  }
 

return template

}

module.exports={
  templateActionsHandler
}