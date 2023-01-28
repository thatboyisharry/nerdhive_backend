const { getChatUser, updateUser, getUser } = require("../services/apiCalls")

const chatInvite=async(code,chatInitiator)=>{
    try {
        let clientUser = await getChatUser(code);
        if(!clientUser.session.chat.active){
            clientUser.session.chat.invite=true;
            clientUser.session.chat.participant=chatInitiator.phone;
            clientUser.session.flow='startChat';
            clientUser.session.node='talk_to_coach';
            chatInitiator.session.chat.invite=true;
            chatInitiator.session.chat.participant=clientUser.phone;
            await updateUser(clientUser);
            await updateUser(chatInitiator);
            return true;
        }else{
            return  false
        }
         
    } catch (error) {
        console.log(error)
        return  false
    }
    
}


const startChat=async(code,chatInitiator)=>{
  console.log("stating chat...")
    try {
        let clientUser = await getChatUser(code);
        if(!clientUser.session.chat.active){
            clientUser.session.chat.invite=false;
            clientUser.session.chat.active=true;
            clientUser.session.chat.participant=chatInitiator.phone;
            chatInitiator.session.chat.active=true;
            chatInitiator.session.chat.participant=clientUser.phone;
            // if this is coming from a help request invite, turn off the invite boolean
            if(chatInitiator.session.helpRequest.invite){
                chatInitiator.session.helpRequest.invite=false;
            }
          console.log(clientUser.session)
            await updateUser(clientUser);
            await updateUser(chatInitiator);
            return true;
        }else{
            return  false
        }
         
    } catch (error) {
        console.log(error)
        return  false
    }
    
}

const endChat=async(user_text,chatTerminator)=>{
    let response = user_text.toLowerCase().split(' ');
  
      if(user_text==="🔥"&&chatTerminator.session.flow==='help_request'){
         try {
                    let clientUser = await getUser(chatTerminator.session.chat.participant);
                    clientUser.session.chat.active=false;
                     clientUser.session.chat.invite=false;
                    clientUser.session.chat.participant=null;
                    clientUser.session.flow='help_request';
                    clientUser.session.node='alert_tutor';
                    chatTerminator.session.flow='help_review_flow';
                    chatTerminator.session.node='start';
                    chatTerminator.session.chat.active=false;
                    chatTerminator.session.chat.invite=false;
                    chatTerminator.session.chat.participant=null;
                    await updateUser(clientUser);
                    await updateUser(chatTerminator);
                    return true
                } catch (error) {
                    console.log(error)
                }

      }
   
    if(response.length==2||(user_text==="🔥")){
        if((response[0]==='end'&&response[1]==='chat')||(user_text==="🔥")){
            try {
                let clientUser = await getUser(chatTerminator.session.chat.participant);
                clientUser.session.chat.active=false;
                clientUser.session.chat.participant=null;
                chatTerminator.session.flow='startChat';
                chatTerminator.session.node='alert_learner';
                chatTerminator.session.chat.active=false;
                chatTerminator.session.chat.invite=false;
                chatTerminator.session.chat.participant=null;
                await updateUser(clientUser);
                await updateUser(chatTerminator);
                return true
            } catch (error) {
                console.log(error)
            }
           
        }     
    }
  
   
    return false;
}

const getChatMessage=(msg)=>{

    let response;
    let type=msg.type;
    const INTERACTIVE='interactive';
    const BUTTON='button';
    const TEXT='text';
    const BUTTON_REPLY='button_reply';
    const LIST_REPLY='list_reply';

    
    let user_text_msg ={
        messaging_product:'whatsapp',
        recipient_type:'individual',
        to:'',
        type:'text',
        text:{
          body:''
        }
    }


    if(type===INTERACTIVE){
        let interactive_type = msg.interactive.type;
        if(interactive_type===BUTTON_REPLY){
            response=msg.interactive.button_reply.id;
        }

        if(interactive_type===LIST_REPLY){
            response=msg.interactive.list_reply.id;
        }
    }

    if(type===BUTTON){
        response=msg.button.payload.toLowerCase();
        return response
    }

    if(type===TEXT){
        response=msg.text.body;
        user_text_msg.text.body=response;
        return user_text_msg
    }

    if(type!==TEXT){
        
        if(type==='image'){
        
            let id=msg.image.id;
            let user_media_msg={
                messaging_product:'whatsapp',
                recipient_type:'individual',
                to:'',
                type:'image',
                image:{
                    id:id
                }
            }
            return user_media_msg;
          }
          
          if(type==='document'){
            
            let id=msg.document.id;
            let user_media_msg={
                messaging_product:'whatsapp',
                recipient_type:'individual',
                to:'',
                type:'document',
                document:{
                    filename:filename,
                    id:id
                }
            }
            return user_media_msg;
          }
          
          if(type==='audio'){
            
            let id=msg.audio.id;
            let user_media_msg={
                messaging_product:'whatsapp',
                recipient_type:'individual',
                to:'',
                type:'audio',
                audio:{
                    id:id
                }
            }
            return user_media_msg;
          }
          
          if(type==='video'){
            
            let id=msg.video.id;
            let user_media_msg={
                messaging_product:'whatsapp',
                recipient_type:'individual',
                to:'',
                type:'video',
                video:{
                    id:id
                }
            }
            return user_media_msg;
          }
        
    }

    return user_text_msg.text.body=response;

}
module.exports={
    startChat,
    endChat,
    chatInvite,
    getChatMessage

}