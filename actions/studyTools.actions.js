const {updateUser, addQuery, addTopicGuide,addNotes,getNotes,getTopicGuide} = require("../services/apiCalls");
const nltk = require('nltk');
const {v1} =require('uuid');
const uuidv1 = v1;
const {summarizeAndSimplify,generateNotes,generateGuide,isFollowUp} = require("../services/generative.models.services");
const { Configuration, OpenAIApi } = require("openai");
const { getMediaUrl,getImage,uploadToCloud,readImageText,createUserQuery,createTopicGuide } = require('./utils');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const axios = require("axios");


const studyToolsFlowActions=async(action,user_response,user)=>{
  if(action.name==='translateThis'){
        let success= await translateThis(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
  if(action.name==='saveLanguage'){
        let success= await saveLanguage(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  if(action.name==='createTopicGuide'){
        let success= await getGuide(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
  if(action.name==='createNotes'){
        let success= await createNotes(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  if(action.name==='summarizeThis'){
        let success= await summarizeThis(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
  if(action.name==='answerThis'){
        let success= await answerThis(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
  
  if(action.name==='chatWithAI'){
        let success= await chatWithAI(user,user_response);
        if(success){
            return action.onSuccess
        }else{
            return action.onFailure
        }
    }
}

const saveLanguage=async(user,language)=>{
  user.session.data= {
    studytools:{
      language:language
    }
  };
  
  let res = await updateUser(user);
  return res
}

const chatWithAI=async(user,text)=>{
  if(text.search(/my name/i)==-1){
     text=text.replace(/my/g, user.name)
  }
 
  let name = "Fiona"
  let subjects = 'Mathematics, chemistry, physics, biology, economics, accounting, geography, business and etc'
  let prompt_text=`
  
  ${user.name}: Hi Fiona, I'm having a hard time understanding this chemistry concept. Can you help me out?

${name}: Of course, I'm happy to help! What concept are you struggling with?

${user.name}: It's about the mole concept. I just can't seem to wrap my head around it.

${name}: Ah, the mole concept can be a bit tricky at first. But don't worry, we can work through it together. Can you tell me what you already know about the mole concept?

${user.name}: Well, I know that a mole is a unit of measurement for a certain amount of atoms or molecules. But I'm not really sure how to use it in calculations.

${name}: That's a great start! The mole concept is all about using the mole as a unit of measurement to help us calculate how much of a substance we have. For example, if we know that there are 6.022 x 10^23 atoms in one mole of a substance, we can use that information to figure out how many atoms we have in a smaller amount of that substance.

${user.name}: Okay, that makes a little more sense. But how do I actually do the calculations?

${name}: Let's go through an example together. Say we have 3 grams of oxygen. We know that the atomic mass of oxygen is 16 grams/mole. So, to find out how many moles of oxygen we have, we can divide the mass we have by the atomic mass: 3 grams / 16 grams/mole = 0.1875 moles.

${user.name}: Oh, I think I get it now. Thank you for explaining it to me, ${name}.

${name}: No problem! I'm happy to help. Do you have any other questions on the mole concept?

${user.name}: No, I think I understand it now. Thanks again for your help.

${name}: You're welcome! If you have any more questions or need further clarification on anything, just let me know.  
  `

  console.log(user.session)
  //extract the conversation object
  let conversation
  if(user.session.data.studytools){
    if(user.session.data.studytools.conversation){
      conversation = user.session.data.studytools.conversation
    }
  }else{
    conversation={
      id:uuidv1(),
      userId:user.id,
      tokens:0,
      total_messages:0,
      messages:[],
      
    }
  }
  let chat_data=''
  if(user.session.data.studytools&&user.session.data.studytools.chat_data!==""){
    chat_data=user.session.data.studytools.chat_data
    let user_message=`${user.name}: ${text}`
    conversation.messages.push(user_message);
    
    let followingUp=true;
    //check if message is a follow-up message
    if(conversation.messages.length>4){
      followingUp = await isFollowUp(conversation)
    }
    chat_data=followingUp?chat_data:prompt_text
    prompt_text=chat_data
  }else{
    let user_message=`${user.name}: ${text}`
    conversation.messages.push(user_message);
    chat_data=prompt_text
  }
  
  let snippet = `\n${user.name}: ${text} \n${name}:`
  let today_date =new Date()
  const response = await openai.createCompletion({
    model: "text-davinci-003",
     prompt: `Today's date is ${today_date.toDateString()}. The following is conversation with an AI tutor called ${name}. The tutor is helpful, creative, clever, funny and humorous.The tutor is knowledgeable in various subjects including ${subjects}. ${name} answers math questions and fully explains all the steps involved to get to the answer, avoids using the qudratic formula when the equation can be factorised, uses degrees instead of radians and does not answer math questions about range." :\n${prompt_text}` + snippet,
     // prompt: `${name} is a chatbot that answers questions with funny factual responses filled with humour and sarcasm:\n${prompt_text}` + snippet,
    //prompt: `${name} is a chatbot and a funny tutor that enthusiastically answers questions with funny humorous but helpful and informative responses:\n\n${user.name}: How many pounds are in a kilogram?\n${name}: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\n${user.name}: What does HTML stand for?\n${name}: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\nYou: When did the first airplane fly?\n${name}: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.\nYou: What is the meaning of life?\n${name}: I’m not sure. I’ll ask my friend Google.\nYou:${text}\n${name}:`,
    //prompt:`${name} is a chatbot that reluctantly answers questions with sarcastic responses:\n\nYou: How many pounds are in a kilogram?\n${name}: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\nYou: What does HTML stand for?\n${name}: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\nYou: When did the first airplane fly?\n${name}: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.\nYou: What is the meaning of life?\n${name}: I’m not sure. I’ll ask my friend Google.\nYou:${text}\n${name}:`,
    temperature: 0.5,//was 5
    max_tokens: 600,
    top_p: 0.3,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
  });
  
  console.log(response.data);
  let response_text = response.data.choices[0].text;
  
  //get response tokens and save them
  conversation.tokens=conversation.tokens + response.data.usage.total_tokens
  //save bot response 
  let bot_response=`${name}: ${response_text}`
  conversation.messages.push(bot_response);
  conversation.total_messages=conversation.messages.length;
  let user_name=`${user.name}'s`
  response_text= response_text.replace(new RegExp(user_name,"g"), "your");
  chat_data=`${chat_data} \n${user.name}: ${text} \n${name}: ${response_text}`
  
  
  //log the query
  let queryData={
    prompt:text,
    response:response_text,
    type:"chat"
  }
  let queryObj = createUserQuery(user,queryData)
  
  let query = await addQuery(queryObj);
  user.session.queries.push(query)
  
  user.session.data= {
    studytools:{
      chat_data:chat_data,
      chat_response:response_text,
      human_response:text,
      conversation:conversation
    }
  };
  
  let res = await updateUser(user);
  return res
  
  
}
const answerThis=async(user,question)=>{
  
  if(question.slice(-1)==='?'){
    question = question.slice(0,question.length-1);
  }
  
  const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: `I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with \"Unknown\".\n\nQ: What is human life expectancy in the United States?\nA: Human life expectancy in the United States is 78 years.\n\nQ: Who was president of the United States in 1955?\nA: Dwight D. Eisenhower was president of the United States in 1955.\n\nQ: Which party did he belong to?\nA: He belonged to the Republican Party.\n\nQ: What is the square root of banana?\nA: Unknown\n\nQ: How does a telescope work?\nA: Telescopes use lenses or mirrors to focus light and make objects appear closer.\n\nQ: Where were the 1992 Olympics held?\nA: The 1992 Olympics were held in Barcelona, Spain.\n\nQ: How many squigs are in a bonk?\nA: Unknown\n\nQ: ${question}?\nA:`,
  temperature: 0.1,
  max_tokens: 200,//was 64
  top_p: 1,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  stop: ["\n"],
  });
  
  console.log(response.data);
  let response_text = response.data.choices[0].text;
  if(response_text==' Unknown'){
    response_text="I am sorry☹, I do not know the factual answer to this question."
  }
  
  
  
  // log the query
  let topic=user.session.data.question?user.session.data.question.subject:null
  let queryData={
    prompt:question,
    response:response_text,
    topic:user.session.data.question?user.session.data.question.subject:null,
    type:"q_and_a"
  }
  let queryObj = createUserQuery(user,queryData)
  let query = await addQuery(queryObj);
  user.session.queries.push(query)
  user.session.data.studytools={}
  user.session.data.studytools.answer=response_text
  let res = await updateUser(user);
  return res
  
 
  
}

const translateThis=async(user,text)=>{
  let language = user.session.data.studytools.language;
  const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: `Translate this into 1. ${language}, :\n\n${text}\n\n1.`,
  temperature: 0.3
    ,
  max_tokens: 500,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  });
  console.log(response.data);
  let response_text = response.data.choices[0].text;
  
  
  //log the query
  let queryData={
    prompt:text,
    response:response_text,
    type:"translate"
  }
  let queryObj = createUserQuery(user,queryData)
  
  let query = await addQuery(queryObj);
  user.session.queries.push(query)
  user.session.data= {
    studytools:{
      translation:response_text
    }
  };
  
  let res = await updateUser(user);
  return res
  
  
  
}

const getGuide=async(user,topic)=>{
  
  topic=topic.replace(/\./g,"").toLowerCase().trim();
  console.log(topic, "parsed topic")
  
  try{
    let guide = await getTopicGuide(topic)
    if(!guide){
       guide = await generateGuide(topic);
      //parameters should be topic, guide and subjec
       let topic_guide = createTopicGuide(topic,guide)
       await addTopicGuide(topic_guide)
    }else{
      guide=guide.guide
    }
   
    //log the query
    let queryData={
      prompt:topic,
      response:guide,
      type:"topic_guide"
    }
    let queryObj = createUserQuery(user,queryData)

    let query = await addQuery(queryObj);
    user.session.data= {
      studytools:{
        topicguide:guide
      }
  };
  
  let res = await updateUser(user);
  return res
    
  }catch(error){
    console.log(error)
  }
  
}

const createNotes=async(user,topic)=>{
  
  topic=topic.replace(/\./g,"").toLowerCase().trim();
  
  let notes = await generateNotes(topic)
  
  //log the query
  let queryData={
    prompt:topic,
    response:notes,
    type:"notes"
  }
  let queryObj = createUserQuery(user,queryData)
  
  let query = await addQuery(queryObj);
  user.session.data= {
    studytools:{
      studynotes:notes
    }
  };
  
  let res = await updateUser(user);
  return res
  
  
}

const summarizeThis=async(user,text)=>{
  try{
      let textData=text
      const textArray=textData.split(' ');
      if(textArray.length===1){
        let id=text
        let imageUrl = await getMediaUrl(id);
        let formdata = await getImage(imageUrl);
        let dataUrl = await uploadToCloud(formdata);
        textData = await readImageText(dataUrl);
      }

      console.log("sendig below to openAI");
      console.log(textData)
    
      let summarized_text = textData!==" "? await summarizeAndSimplify(textData):" I am sorry, I can't read the handwriting on this"

           //log the query
        let queryData={
          prompt:textData,
          response:summarized_text,
          type:"summarize"
        }
        let queryObj = createUserQuery(user,queryData)

        let query = textData!==" "? await addQuery(queryObj):null;
      user.session.data= {
        studytools:{
          summary:summarized_text
        }
      };

      let res = await updateUser(user);
      return res
    
  }catch(error){
    console.log(error)
  }
  
  
}

module.exports={
  studyToolsFlowActions
}