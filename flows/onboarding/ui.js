const { createButton, createInteractiveButton, createTextUI } =require("../../messages/templates");


////////////////////////
let message = "Welcome to Homely Rentals"
 const start = createTextUI('start',message)
//////////////////////////
 const askName = createTextUI('askName','what is your name ?');
///////////////////////////


// const landlord = createButton('landlord','Landlord');
// const renter = createButton('renter','Renter');
// let buttons=[landlord,renter]
//  const landlord_or_renter = createInteractiveButton('landlord_or_renter',buttons);
// landlord_or_renter.value.body.text="which one are you ?"

const landlord_or_renter ={ type:'template',name:'landlord_or_renter'};
landlord_or_renter.value={
  name:'landlord_or_renter',
  language:{
    code:'en'
  },
  components: [{
    type: "body",
    "parameters": [
        {
            "type": "text",
            "text": ""
        }]
  }]
}



module.exports= {
  start,
  askName,
  landlord_or_renter
  
}