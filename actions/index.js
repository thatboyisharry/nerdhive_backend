const { createLessonFlowActions } = require('./createLesson.actions');
const { helpRequestFlowActions } = require('./helpRequest.actions');
const { helpReviewFlowActions } = require('./helpReview.actions');
const { homeworkAssistanceFlowActions } = require('./homeworkAssistance.actions');
const { learnerMenuFlowActions } = require('./learnerMenu.actions');
const { onboardingFlowActions } = require('./onboarding.actions');
const { postLessonFlowActions } = require('./postLesson.actions');
const { scheduleLessonFlowActions } = require('./scheduleLesson.actions');
const { startChatFlowActions } = require('./startChat.actions');
const { worksheetsFlowActions } = require('./worksheets.actions');
const { studyToolsFlowActions } = require('./studyTools.actions');
const { revisionFlowActions } = require('./revision.actions');
const { mathHomeworkAssistanceFlowActions } = require('./mathHomeworkAssistance.actions');
const { customerSupportFlowActions } = require('./customerSupport.actions');

const actionsHandler= async(node,user_response,user)=>{
  console.log("Inside actions")
  console.log(node)
  console.log(user_response)
  if(node.actions&&node.actions.length>0){
    let action=node.actions[0]
  
    if(node.actions.length>1){
      for(let i = 0;i<node.actions.length;i++){
        let node_action = node.actions[i];
        if(node_action.trigger===user_response){
            action=node_action
        }
      }
    }
    
    let trigger=" ";
    if(node.flow==='customer_support'){
      trigger=await customerSupportFlowActions(action,user_response,user)
    }
    if(node.flow==='study_tools'){
      trigger=await studyToolsFlowActions(action,user_response,user)
    }
    if(node.flow==='revision_flow'){
      trigger=await revisionFlowActions(action,user_response,user)
    }
     if(node.flow==='math_assistance'){
      trigger=await mathHomeworkAssistanceFlowActions(action,user_response,user)
    }
    if(node.flow==='homework_assistance'){
      trigger=await homeworkAssistanceFlowActions(action,user_response,user)
    }

    if(node.flow==='help_request'){
      trigger=await helpRequestFlowActions(action,user_response,user)
    }
    if(node.flow==='help_review_flow'){
      trigger=await helpReviewFlowActions(action,user_response,user)
    }
    if(node.flow==='learner_menu'){
      trigger=await learnerMenuFlowActions(action,user_response,user)
    }
    if(node.flow==='scheduleLessons'){
      console.log("scheduleLesson flow...")
      trigger = await scheduleLessonFlowActions(action,user_response,user);
    }

    if(node.flow==='postLesson'){
      console.log("postLesson flow...")
      trigger = await postLessonFlowActions(action,user_response,user);
    }

    if(node.flow==='createLesson'){
      console.log("createLesson flow...")
      trigger = await createLessonFlowActions(action,user_response,user);
    }

    if(node.flow==='startChat'){
      console.log("startChat flow...")
      trigger = await startChatFlowActions(action,user_response,user);
    }

    if(node.flow==='onboarding_flow'||node.flow==='onboarding_parent'||node.flow==='onboarding_learner'){
      console.log("onboarding flow...")
      trigger = await onboardingFlowActions(action,user_response,user);
    }
     if(node.flow==='worksheets'){
      console.log("worksheets flow...")
      trigger = await worksheetsFlowActions(action,user_response,user);
    }
    return trigger
    
    
  }
  
  return " "
  
  
}



module.exports={
  actionsHandler
}