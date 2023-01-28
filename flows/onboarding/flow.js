const { askName, landlord_or_renter, start } = require("./ui")
const { onboardingNodes } = require ("./nodes")



 const onboardingFlow={
    name:'onboarding',
    user_interfaces:[
        start,
        askName,
        landlord_or_renter
    ],
    nodes:onboardingNodes

    
    
}
 
module.exports={
  
  onboardingFlow,
 
}