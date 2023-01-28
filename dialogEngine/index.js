const {sendResponse,updateStatus} = require("./sendResponse");
const {getUserResponse} = require("./getUserResponse");
const {getBotResponses} = require("./getBotResponse");
const { updateUser, getUser } = require("../services/apiCalls");
const { startChat, endChat, getChatMessage } = require("./startChat");
const { goToPrevOrMenu } = require("./nerdHiveEngineSerivices");

const token = process.env.WHATSAPP_TOKEN;
const phone_number_id = process.env.phone_number_id;


const NerdHiveDialogEngine=async(msg,user,project_flows)=>{
  let user_text= await getUserResponse(msg);
  if(user.session.chat.active){
    let participant = user.session.chat.participant;
    let chat_ended= await endChat(user_text,user);
    if(chat_ended){
      
      //check to see the kind of chat , if we are from help_request
      let updatedUser = await getUser(user.phone)
      if(updatedUser.session.flow==='help_review_flow'){
        //get the the two users
        let tutor = await getUser(participant);
        let learnerUser = updatedUser
        //get responses for the two users
        let response_to_learner = await getBotResponses(learnerUser,user_text,project_flows);
        let response_to_tutor = await getBotResponses(tutor,user_text,project_flows);

        //below we are sending texts to let users know that the chat has ended
        await sendResponse(phone_number_id,token,learnerUser.phone,response_to_learner) 
        await sendResponse(phone_number_id,token,participant,response_to_tutor) 
      }else{
        let bot_response = await getBotResponses(updatedUser,user_text,project_flows);
        //below we are sending texts to let users know that the chat has ended
        console.log(bot_response)
        await sendResponse(phone_number_id,token,user.phone,bot_response) 
        await sendResponse(phone_number_id,token,participant,bot_response) 
        
      }
      
    }else{
      let chat_message = getChatMessage(msg);
      await sendResponse(phone_number_id,token,participant,[chat_message])
    }
    
   

  }else{
    if(user.session.helpRequest.invite){
          // if they accept the invite send the tutor the question
          // and let the learner know that the question being attended and they can send additional info to the tutor
    
          let bot_response = await getBotResponses(user,user_text,project_flows);
        console.log(bot_response)
          await sendResponse(phone_number_id,token,user.phone,bot_response);
      
          if(user.session.helpRequest.solving){
            if(user_text.toLowerCase()==='yes'&&user.session.node=='chat_to_learner'){
            // if tutor accepted the request let the learner know
            let learnerId = user.session.helpRequest.learnerId;
            let learnerUser = await getUser(learnerId);
            learnerUser.session.flow='help_request'
            learnerUser.session.node='send_learner_message'
            await updateUser(learnerUser);
            user.session.helpRequest.solving=false
            await updateUser(user);
            let updatedLearnerUser = await getUser(learnerId);
            let bot_response = await getBotResponses(updatedLearnerUser,user_text,project_flows);
            await sendResponse(phone_number_id,token,learnerUser.phone,bot_response);
            }
          }
          
         
    }else if(user.session.customerSupport.invite){
      // add the logic
      // if they accept the invite send the tutor the question
          // and let the learner know that the question being attended and they can send additional info to the tutor
    
          let bot_response = await getBotResponses(user,user_text,project_flows);
        console.log(bot_response)
          await sendResponse(phone_number_id,token,user.phone,bot_response);
      
          if(user.session.customerSupport.assisting){
            if(user_text.toLowerCase()==='yes'&&user.session.node=='chat_to_customer'){
            // if tutor accepted the request let the learner know
            let leadId = user.session.customerSupport.leadId;
            let leadUser = await getUser(leadId);
            leadUser.session.flow='cutomer_support'
            leadUser.session.node='send_client_message'
            leadUser.session.customerSupport.queryId=user.session.customerSupport.queryId
            await updateUser(leadUser);
            user.session.customerSupport.assisting=false
            await updateUser(user);
            let updatedLeadUser = await getUser(leadId);
            let bot_response = await getBotResponses(updatedLeadUser,user_text,project_flows);
            await sendResponse(phone_number_id,token,leadUser.phone,bot_response);
            }
          }
    }else if(user.session.isActive){
      try{
        let user_response= await getUserResponse(msg);
          
        let go_to_prev_or_menu = await goToPrevOrMenu(user,user_response)
        let bot_response;
         // check if user want to go back or back to menu
        if(go_to_prev_or_menu){
          let updatedUser = await getUser(user.phone);
          bot_response = await getBotResponses(updatedUser,user_text,project_flows);
        }else{
          bot_response = await getBotResponses(user,user_response,project_flows); 
        }

        // check if user have activated chat
        let updatedUser = await getUser(user.phone);
        //uncomment the code below in case of emergency
         // updatedUser.session.chat.invite=false;
         // updatedUser=await updateUser(updatedUser)
        if(updatedUser.session.chat.invite){
          let participant = user.session.chat.participant;
          // if chat is now active ,switch off invite
          if(updatedUser.session.chat.active){
             updatedUser.session.chat.invite=false;
            await updateUser(updatedUser)
            await sendResponse(phone_number_id,token,participant,bot_response)
            await sendResponse(phone_number_id,token,user.phone,bot_response)
          }else{  
            //let user chat was declined || send chat invite
             await sendResponse(phone_number_id,token,participant,bot_response)
            
            //check if invite was declined
            if(updatedUser.session.node==='alert_learner_decline'){
              // acknowledge user that declined
               updatedUser.session.node='acknowledge_decline'
              updatedUser.session.chat.invite=false;
              await updateUser(updatedUser)
              let userCurrent = await getUser(user.phone);
              let response_ = await getBotResponses(userCurrent,user_text,project_flows);
              await sendResponse(phone_number_id,token,updatedUser.phone,response_) 
             
            }else if(!updatedUser.session.chat.cancelled){
              //acknowledge user that sent the invite
               updatedUser.session.node='invite_sent'
              await updateUser(updatedUser)
              let userCurrent = await getUser(user.phone);
              let response_ = await getBotResponses(userCurrent,user_text,project_flows);
              await sendResponse(phone_number_id,token,updatedUser.phone,response_) 
            }else if(updatedUser.session.chat.cancelled){
              //if chat is cancelled turn the invite off and alert user
                updatedUser.session.chat.invite=false;
                updatedUser.session.chat.cancelled=false
                await updateUser(updatedUser)
               await sendResponse(phone_number_id,token,user.phone,bot_response)
            }
            
          }
         
        }else{
          
          await sendResponse(phone_number_id,token,user.phone,bot_response)
          
        }
      }catch(error){
        console.log(error)
      }
      
    }else{
      
      if(user.isLead){
        try{
          let updatedUser = await getUser(user.phone);
          let bot_response = await getBotResponses(updatedUser,user_text,project_flows);
          await sendResponse(phone_number_id,token,user.phone,bot_response);
        }catch(err){
          console.log(err)
        }
      }
      if(user.isLearner){
        try{
          let date = new Date()
          user.session.flow='learner_menu'
          user.session.node='start';
          user.session.lastUpdated=date;
          user.session.isActive=true;
          await updateUser(user);
          let updatedUser = await getUser(user.phone);
          let bot_response = await getBotResponses(updatedUser,user_text,project_flows);
          await sendResponse(phone_number_id,token,user.phone,bot_response);
        }catch(err){
          console.log(err)
        }
        
        
      }
      if(user.isTutor){
        try{
          let date = new Date()
          user.session={
            flow:'tutor_menu',
            node:'start',
            data:{},
            lastUpdated:date,
            isActive:true
          }
          await updateUser(user);
          let updatedUser = await getUser(user.phone);
          let bot_response = await getBotResponses(updatedUser,user_text,project_flows);
          await sendResponse(phone_number_id,token,user.phone,bot_response);
        }catch(err){
          console.log(err)
        }
      }
      if(user.isCoach){
        try{
          let date = new Date()
          user.session={
            flow:'coach_menu',
            node:'start',
            data:{},
            lastUpdated:date,
            isActive:true
          }
          await updateUser(user);
          let updatedUser = await getUser(user.phone);
          let bot_response = await getBotResponses(updatedUser,user_text,project_flows);
          await sendResponse(phone_number_id,token,user.phone,bot_response);
        }catch(err){
          console.log(err)
        }
      }
      if(user.isParent){
        try{
          let date = new Date()
          user.session={
            flow:'parent_menu',
            node:'start',
            data:{},
            lastUpdated:date,
            isActive:true
          }
          await updateUser(user);
          let updatedUser = await getUser(user.phone);
          let bot_response = await getBotResponses(updatedUser,user_text,project_flows);
          await sendResponse(phone_number_id,token,user.phone,bot_response);
        }catch(err){
          console.log(err)
        }
      }
      if(user.isAdmin){
        try{
          let date = new Date()
          user.session.flow='admin_menu';
          user.session.flow='start';
        
          await updateUser(user);
          let updatedUser = await getUser(user.phone);
          let bot_response = await getBotResponses(updatedUser,user_text,project_flows);
          await sendResponse(phone_number_id,token,user.phone,bot_response);
        }catch(err){
          console.log(err)
        }
      }
      
      
    }  

  }
  
}

module.exports={
  sendResponse,
  getBotResponses,
  getUserResponse,
  updateStatus,
  startChat,
  NerdHiveDialogEngine
}