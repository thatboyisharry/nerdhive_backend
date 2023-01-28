const { startChat} = require("../dialogEngine/startChat");
const {  getUser, updateUser, getLearnerQuestion,updateLearnerQuestion } = require("../services/apiCalls");


const customerSupportFlowActions=async(action,user_response,user)=>{
    
    if(action.name==="startChat"){
        let success= await startChatWithCustomer(user,user_response);
        if(success){
         
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
  
    if(action.name==="sendSupportQuery"){
        let success= await isAssisting(user);
        if(success){
         
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
 
    if(action.name==="declineInvite"){
        let success= await declineInvite(user,user_response);
        if(success){
          
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
   
}

const isAssisting=async(user)=>{
  console.log("is assisting")
  
  try{
    user.session.customerSupport.assisting=true;
    user.session.customerSupport.invite=false;
     let res = await updateUser(user);
      return res
  }catch(error){
    console.log(error)
  }
}



const startChatWithCustomer=async(user)=>{
    const {leadId}=user.session.customerSupport.leadId
    let id = user.session.customerSupport.leadId
  
    try {
        let res =false

        let lead = await getUser(id)
        lead.session.flow='customer_support'
        lead.session.node='send_lead_message';
        lead.session.customerSupport.queryId=user.session.customerSupport.queryId
        lead.session.customerSupport.participant=user.id
        await updateUser(lead);
        let updatedLead = await getUser(id)
        res = await startChat(updatedLead.userCode,user)
      console.log('res')
      console.log(res)
        return res
        
    } catch (error) {
        console.log(error)
        return false
    }

   

}

const declineInvite=async(user)=>{
  try{
    
    let customerSupport = user.session.customerSupport;
    customerSupport.invite=false
    customerSupport.assiting=false
    customerSupport.leadId=''
    user.session.customerSupport=customerSupport;
    let res = await updateUser(user);
    return res
    
  }catch(error){
    console.log(error)
  }
    
   

}



module.exports={
    customerSupportFlowActions
}