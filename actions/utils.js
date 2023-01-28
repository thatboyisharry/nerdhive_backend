const {v1} =require('uuid');
const uuidv1 = v1;
const axios = require("axios").default;
const token = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.phone_number_id;
const FormData = require('form-data');


class LearnerQuestion{
    constructor(user,subject){
        this.id=uuidv1();
        this.userId=user.id;
        this.subject=subject;
        this.grade="12";
        this.topic='';
        this.difficulty='';
        this.status='unsolved';
        this.sentTo=[];
        this.question={id:'',text:''};
        this.attemptImages=[];
        this.solutionImages=[];
        this.attempted=false;
        this.solver={
            userId:'',
            rating:''
        }
        this.date=''
        
    }
}

class UserQuery{
    constructor(user,prompt,response,type,subject){
        this.id=uuidv1();
        this.userId=user.id;
        this.prompt=prompt;
        this.response=response;
        this.type=type;
        this.subject=subject;
        this.date=new Date()
        
    }
}

const createUserQuery=(user,queryData)=>{
  const {prompt,response,type,subject}=queryData;
  
  let query = new UserQuery(user,prompt,response,type,subject)
  console.log("query")
  console.log(query)
  return query
} 

const createLearnerQuestion=(user,subject)=>{
    let question = new LearnerQuestion(user,subject);
  console.log(question)
    return question;
}

const getWorksheetQueryObj=(subject,queryData)=>{
  
  let queryArray = queryData.split(" ");
  if(queryArray.length<2){
    return null
  }
  
  if(queryArray.length==2){
    let queryObj = {
      subject:subject,
      topic:queryArray[0],
      grade:queryArray[1],
      
    }
    return queryObj
  }else{
      let queryObj = {
      subject:subject,
      topic:queryArray[0],
      subtopic:queryArray[1],
      grade:queryArray[2],
      
    }
    return queryObj
  }
  
}

class Worksheet{
    constructor(topic,subtopic,questions){
        this.id=uuidv1();
        this.subject='';
        this.grade="";
        this.topic=topic;
        this.subtopic=subtopic,
        this.questions=questions;
       
        
    }
}

class Notes{
    constructor(topic,subtopic,notes){
        this.id=uuidv1();
        this.subject='';
        this.grade="";
        this.topic=topic;
        this.subtopic=subtopic,
        this.notes=notes;
       
        
    }
}

class TopicGuide{
    constructor(topic,guide,subject){
        this.id=uuidv1();
        this.subject='';
        this.grade="";
        this.topic=topic;
        this.subject=subject;
        this.guide=guide;
        
       
        
    }
}
const createTopicGuide=(topic,guide,subject)=>{
    
    let topic_guide = new TopicGuide(topic,guide,subject);
    console.log(topic_guide,"topic guide")
    return topic_guide;
}

const createNotes=(topic,subtopic,questions)=>{
    
    let notes = new Notes(topic,subtopic,questions);
    console.log(notes)
    return notes;
}

const createWorksheet=(topic,subtopic,questions)=>{
  
    //add topic and subtopic label to each question
    for(let i = 0; i<questions.length;i++){
      questions[i].topic=topic;
      questions[i].subtopic=subtopic;
    }
    
    let worksheet = new Worksheet(topic,subtopic,questions);
    return worksheet;
}

const addWorksheetDetails=(worksheet,details)=>{
  let detailsArray=details.split(" ");
     // check if grade is a number
    if(detailsArray.length===3){
       worksheet.topic=detailsArray[0]
       worksheet.subtopic=detailsArray[1]
       worksheet.grade=detailsArray[2]
      
    }else if(detailsArray.length===2){
        worksheet.topic=detailsArray[0]
       worksheet.grade=detailsArray[1]
    }else{
      return null
    }
  return worksheet
}

class QuestionPaper{
    constructor(subject){
        this.id=uuidv1();
        this.grade="";
        this.paper="";
        this.questionPaper={id:''};
        this.memo={id:''};
        this.term=''
        this.year=''
        this.lastUpdated=''
        
    }
}


const createQuestionPaper=(subject)=>{
    let questionPaper = new QuestionPaper(subject);
  console.log(questionPaper)
    return questionPaper;
}

const getMediaUrl=async(id)=>{
           let url=''
     
            try {
                await axios({
                    method: "GET", // Required, HTTP method, a string, e.g. POST, GET
                    url: `https://graph.facebook.com/v15.0/${id}`,
                    headers: { "Content-Type": "application/json",
                             Authorization: `Bearer ${token}`},
                    })
                    .then(function (response) {
                      url=response.data.url
                      console.log(url)
                    }).catch(function (error) {
                        console.log(error)
                        return "not_image"
                });
            } catch (error) {
                return "not_image"
                console.log(error)
            }
  
            return url;
}

const getImage=async(url)=>{
            let imageData;
            let formData= new FormData();
            try {
                await axios({
                    method: "GET", // Required, HTTP method, a string, e.g. POST, GET
                    url: url,
                    responseType: "text",
                    responseEncoding: "base64",
                    headers: { "Content-Type": "application/json",
                             Authorization: `Bearer ${token}`},
                    })
                    .then(async function (response) {
                  
                      imageData=response.data;
                      formData.append('image',imageData)
                      
                    }).catch(function (error) {
                        console.log(" error posting response");
                        console.log(error)
                });
            } catch (error) {
                console.log(error)
            }
            
        return formData
}

const uploadToWhatsapp=async(file)=>{
  let id
   let formData= new FormData();
   formData.append('data',file,{filename:'solutionImage.png',type:'image/png'});
    formData.append('messaging_product','whatsapp');
  try{
    await axios({
                    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
                    url: `https://graph.facebook.com/v15.0/${PHONE_NUMBER_ID}/media`,
                    headers: { "Content-Type": "multipart/form-data",
                             Authorization: `Bearer ${token}`},
      
                    formData
                    })
                    .then(function (response) {
                      console.log(response.data)
                      id =response.data.id
                      
                    }).catch(function (error) {
                        console.log(" error posting response");
                        console.log(error)
                });
    
  }catch(error){
    console.log(error)
  }
  
  return id;
}

const uploadToCloud=async(formdata)=>{
  
    let url=''
     try {
                await axios({
                    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
                    url: `https://sassy-luxurious-engineer.glitch.me/uploads/studytools`,
                    headers: formdata.getHeaders(),
                    data:formdata
                    })
                    .then(function (response) {
                       console.log(JSON.stringify(response.data.url));
                      url=response.data.url
                      return url;
                    }).catch(function (error) {
                        console.log(" error posting response");
                        console.log(error)
                });
            } catch (error) {
                console.log(error)
            }
  return url

}

const readImageText=async(url)=>{
  let text=''
  const options = {
  method: 'POST',
  url: 'https://microsoft-computer-vision3.p.rapidapi.com/ocr',
  params: {detectOrientation: 'true', language: 'unk'},
  headers: {
    'Content-Type': "application/json",
    'X-RapidAPI-Key': 'afe22bb39fmsh1d2249efde63eb1p1fac5fjsn457572f8d6e3',
    'X-RapidAPI-Host': 'microsoft-computer-vision3.p.rapidapi.com',
    
  },
  
    data:{url: url}
  };

  await axios.request(options).then(function (response) {
    text= createText(response.data)
    return text
   console.log(text)
  }).catch(function (error) {
    console.error(error);
  });
  
  return text
}

const createText=(data)=>{
  let text=''
  
  let paragraphsData=data.regions;
  
  for(let i=0;i<paragraphsData.length;i++){
    let paragraph=paragraphsData[i];
    for(let j=0;j<paragraph.lines.length;j++){
      let line=paragraph.lines[j]
      let lineText=[]
      for(let k=0;k<line.words.length;k++){
        let word=line.words[k].text;
        lineText.push(word)
      }
      lineText=lineText.join(' ')
      text = `${text} \n${lineText}`;
    }
    
    text = text + '\n'
   
  } 
  
  return text;
  
}
const addQuestionPaperDetails=(questionPaper,details)=>{
  return questionPaper
}

class CustomerQuery{
  constructor(type,id){
    this.id=uuidv1()
    this.type=type;
    this.userId=id;
    this.lead={}
    this.user={}
    this.queryInfo={
      imageLink:''
    }
    this.sentTo=[];
    this.message=[];
    this.solveer={
      userId:'',
      rating:''
    },
    this.notes='';
    this.date=new Date();
  }

}

const createCustomerQuery=(data)=>{
  const {type,id}=data;
  let customerQuery = new CustomerQuery(type,id);
  return customerQuery
}

// const generateSubtopicWorksheet=async(query)=>{
//   const {topic, subtopic } = query
//   let notes = await getNotes(query);
//   if(!notes){
//     let notes_topic=`${topic} focusing on this subtopic: ${subtopic}`
//     notes = await generateNotes(notes_topic);
//   }
   
// }
module.exports={
    createLearnerQuestion,
    getWorksheetQueryObj,
    createWorksheet,
    addWorksheetDetails,
    createQuestionPaper,
    addQuestionPaperDetails,
    uploadToCloud,
    createText,
    readImageText,
    getMediaUrl,
    getImage,
    uploadToWhatsapp,
    createUserQuery,
    createNotes,
    createTopicGuide,
    createCustomerQuery
}