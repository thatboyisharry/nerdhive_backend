const { templateActionsHandler } = require('../messages/templates');


 ////////////
 const getTransition=(node,trigger)=>{
  console.log("getting transition...")
  console.log(trigger)
    if(trigger){
        for(let i = 0; i< node.transitions.length;i++){
          let transition = node.transitions[i];
          if(transition.trigger===trigger){
            console.log("transition")
            console.log(transition)
              return transition
          }
          if(transition.trigger&&transition.trigger===trigger){
            console.log(transition)
            return transition
          }
        }
      
        if(node.sticky){
          return null
        }
      
       if(node.transitions.length==1){
          return node.transitions[0]
        }

    }
    
 
      // if we are just starting a new flow
    
      //if node has only one none response dependent transition
   if(node.transitions.length==1){
          return node.transitions[0]
    }
   
    
   if(node.name==='start'){
      console.log("node is start")
      return node;
    }
   
    return null;
}
const getNode=(flow,node_name)=>{

    let nodes=flow.nodes
    console.log("getting flow nodes")
    // console.log(nodes)
    console.log("node name")
    console.log(node_name)
    for(let i = 0; i < nodes.length;i++){
        if(nodes[i].name===node_name){
            return nodes[i];
        }

    }
}

const getFlow=async(flow_name,project_flows)=>{
   
    for(let i = 0 ; i < project_flows.length; i++){
        let flow = project_flows[i]
        if(flow.name===flow_name){
            return flow
        }
    }
}

const getMessages=async(transition,user,project_flows)=>{
    let flow = await getFlow(transition.flow,project_flows);
    let node= await getNode(flow,transition.name);
  
    console.log("transition flow")
    console.log(flow)
     
    
    
    console.log("inside get messages")
    let messages = await getResponses(node,user)

    return messages
}

const getResponses=async(next_node,user)=>{
    console.log("inside get responses")
    let UIs=next_node.uis;
    
    let responses=[]
    console.log("the uis");
    console.log(UIs);
    console.log(UIs[0])
    for(let i = 0; i<UIs.length; i++){
        let bot_response=UIs[i].value;
        if(bot_response.type==='template'){
          bot_response=await addParameters(bot_response,user)
        }
        if(Array.isArray(bot_response)){
          for(let j = 0; j < bot_response.length ; j++){
            let msg = bot_response[j]
            responses.push(msg);
          }
          
        }else{
          responses.push(bot_response);
        }
        
    }


    return responses

}


const addParameters=async(bot_response,user)=>{
  response= await templateActionsHandler(bot_response,user)
  return response
}




    


module.exports = {
  getTransition,
  getMessages,
  getNode,
  getFlow
}