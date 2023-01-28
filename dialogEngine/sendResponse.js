const axios = require("axios").default;



const sendResponse=async(phone_number_id,token,user_num,bot_responses)=>{
    console.log("bot responses...")
    console.log(bot_responses)
    if(Array.isArray(bot_responses)){
        for(let i = 0; i < bot_responses.length ; i++){
          let bot_response = bot_responses[i];
          bot_response.to=user_num
          let data =bot_response
          console.log(data)
          console.log(data.interactive?data.interactive:'')
            try {
                await axios({
                    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
                    url:
                      "https://graph.facebook.com/v13.0/" +
                      phone_number_id +
                      "/messages?access_token=" +
                      token,
                    headers: { "Content-Type": "application/json" },
                    data: data
                    })
                    .then(function (response) {
                      // console.log(JSON.stringify(response.data));
                    }).catch(function (error) {
                        console.log(" error posting response");
                        console.log(error)
                });
            } catch (error) {
                console.log(error)
            }
        }
      }
      
      if(!Array.isArray(bot_responses)){
        if(bot_responses){
          bot_responses.to=user_num
        }
        console.log(bot_responses)
        let data =bot_responses
            axios({
                method: "POST", // Required, HTTP method, a string, e.g. POST, GET
                url:
                  "https://graph.facebook.com/v13.0/" +
                  phone_number_id +
                  "/messages?access_token=" +
                  token,
                headers: { "Content-Type": "application/json" },
                data: data
                })
                .then(function (response) {
                  console.log(JSON.stringify(response.data));
                }).catch(function (error) {
                    console.log(" error posting response");
                  console.log(error)
            });
      }

}


const updateStatus=async(phone_number_id,token,msg,status)=>{

    let data={
        messaging_product: "whatsapp",
        status: status,
        message_id: msg.id
    }
    axios({
            method: "POST", // Required, HTTP method, a string, e.g. POST, GET
            url:
              "https://graph.facebook.com/v13.0/" +
              phone_number_id +
              "/messages?access_token=" +
              token,
            headers: { "Content-Type": "application/json" },
            data: data
            })
            .then(function (response) {
              console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log("error updating status");
            });
        
    return
}

module.exports={
    sendResponse,
    updateStatus
}