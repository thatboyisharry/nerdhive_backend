const dataConnection = require('../models/connections/data');
const projectConnection = require('../models/connections/project');
const Project=projectConnection.models.Project;
const User=dataConnection.models.User;
const Learner=dataConnection.models.Learner;
const Lesson=dataConnection.models.Lesson;
const Tutor=dataConnection.models.Tutor;
const Coach=dataConnection.models.Coach;
const Parent=dataConnection.models.Parent;
const Timetable=dataConnection.models.Timetable;
const Job=dataConnection.models.Job;
const Question=dataConnection.models.Question;
const Worksheet=dataConnection.models.Worksheet;
const QuestionPaper=dataConnection.models.QuestionPaper;
const Query=dataConnection.models.Query;
const StudyNotes=dataConnection.models.StudyNotes;
const Notes=dataConnection.models.Notes;
const Test=dataConnection.models.Test;
const TopicGuide=dataConnection.models.TopicGuide;
const Conversation=dataConnection.models.Conversation;
const Lead=dataConnection.models.Lead;
const CustomerQuery=dataConnection.models.CustomerQuery;
const CustomerSupport=dataConnection.models.CustomerSupport;
const {v1} =require('uuid');
const autocorrect = require('autocorrect')()
const uuidv1 = v1;





const createDummyData=async()=>{
    let date = new Date();
    let user1={
        id:'LEARNER100',
        name:'Harold',
        isLearner:true,
        isOnboarding:false,
        userCode:"HAR9604",
        grade:'12',
        phone:'27834939604',
        session:{
            flow:'onboarding',
            node:'start',
            num:0,
            isActive:false,
            helpRequest:{
              invite:false,
              requestId:'',
              learnerId:'',
            },
            chat:{
            active:false,
            partiipant:null
            },
          data:{},
        }
    }

    let user2={
        id:'COACH100',
        name:'JAY',
        userCode:'JAY404',
        isCoach:true,
        isOnboarding:false,
        grade:'12',
        phone:'27681508705',
        session:{
            flow:'onboarding',
            node:'start',
            num:0,
            isActive:true,
             helpRequest:{
              invite:false,
              requestId:'',
              learnerId:'',
            },
            chat:{
            active:false,
            partiipant:null
            },
            data:{}
        }
    }


    let learner={
        userId:'LEARNER100',
        learnerCode:'HAR9604',
        parentId:'HARPAR1',
        name:'Harold',
        surname:"Muchengeta",
        school:"Gatang Sec School",
        grade:"12",
        phone:'27834939604',
        email:"harold@gmail.com",
        location:"Pretoria",
        coachId:'COACH100',
        timetableId:'LEARNER100'
    
    }   

    let coach={
        userId:'COACH100',
        sessions:[],
        tutors:['HAR9604'],
        learners:['HAR9604'],
        timetableId:'COACH100'
    }
    let tutor ={
        userId:'COACH100',
        name:"Harry",
        surname:"Muchengeta",
        phone:'27681508705',
        email:"harold@gmail.com",
        lessons:[],
        sentJobs:[],
        learners:['LEARNER100'],
        coach:'COACH100',
        timetableId:"COACH100"

    }
    let tutorTimetable={
        userId :"COACH100",
        monday:[{
            id:'APPOINTMENT101',
            time:'16:00',
            day:'Monday',
            lessonId:'TRIG121'
        
        }],
        tuesday:[],
        wednesday:[],
        thursday:[],
        friday:[],
        saturday:[],
        sunday:[],
    }

    let learnerTimetable={
        userId :"LEARNER100",
        monday:[{
            id:'APPOINTMENT101',
            time:'16:00',
            day:'Monday',
            lessonId:'TRIG121'
        
        }],
        tuesday:[{
            id:'APPOINTMENT102',
            time:'16:00',
            day:'Tuesday',
            lessonId:'ALG121'
        
        }],
        wednesday:[],
        thursday:[],
        friday:[],
        saturday:[],
        sunday:[],
    }

     let lesson1 = {
        id:'TRIG121',
        lessonCode:'TRIG121',
        learnerId:'LEARNER100',
        tutorId:'',
        appointmentId:'APPOINTMENT101',
        subject:"MATHEMATICS",
        topic:"TRIGNOMETRY",
        subtopic:"Identies",
        day:"MONDAY",
        time:"16:00",
        status:"upcoming"
    }


    let lesson2 = {
        id:'ALG121',
        lessonCode:'ALG121',
        learnerId:'LEARNER100',
        tutorId:'',
        appointmentId:'APPOINTMENT102',
        subject:"MATHEMATICS",
        topic:"ALGEBRA",
        subtopic:"Inequalities",
        day:"TUESDAY",
        time:"16:00",
        status:"upcoming"
    }

    let job1 = {
        id:'JOB101',
        lesson:{
            id:'TRIG122',
            lessonCode:'TRIG122',
            learnerId:'LEARNER100',
            tutorId:'',
            subject:"MATHEMATICS",
            topic:"TRIGNOMETRY",
            subtopic:"Identies",
            status:'upcoming'
        },
        interestedCandidates:[],
        uninterestedCandidates:[],
        status:'active',
        payout:'R175'
        
    }

    await addUser(user1);
    await addUser(user2);
    await addLearner(learner);
    await addTutor(tutor)
    await addCoach(coach);
    await addLesson(lesson1);
    await addLesson(lesson2)
    await addTimetable(learnerTimetable);
    await addTimetable(tutorTimetable)
    await addJob(job1);
}
const createUser=(data)=>{
  const {name,surname,phone,userId}=data;
  let userCode = createUserCode(data);
    let date = new Date()
    let user={
        id:uuidv1(),
        name:name,
        userCode:userCode,
        surname:surname,
        phone:phone,
        session:{
            flow:'',
            node:'start',
            num:0,
            isActive:false,
            helpRequest:{
              invite:false,
              requestId:'',
              learnerId:'',
            },
            chat:{
            active:false,
            partiipant:null
            },
          data:{},
        }
    }

    return user
}
const createUserCode=(user)=>{
    if(user.phone&&user.name){
        let num_part = user.phone.toString().split('').slice(8,).join('');
        let alpha_part = user.name.split('').slice(0,4).join('');
        let userCode = alpha_part + num_part;
        userCode=userCode.toUpperCase();
        return userCode;
    }
}

const createLead=async(user_number)=>{
  let data={
    userId:uuidv1(),
    phone:user_number
  }
  let lead = await addLead(data);
  return lead;
}
const createLeadUser=async(lead)=>{
  let user={
        id:lead.userId,
        phone:lead.phone,
        isLead:true,
        name:'unknown',
        userCode:lead.phone,
        session:{
            flow:'onboarding_flow',
            node:'start',
            num:0,
            isActive:false,
            helpRequest:{
              invite:false,
              requestId:'',
              learnerId:'',
            },
            chat:{
            active:false,
            partiipant:null
            },
          data:{},
        }
  }
    
  try{
    
    let newUser = await addUser(user);
    return newUser
  }catch(error){
    console.log(error)
  }
  
}
const createLearnerUser=async(learner)=>{
  try{
    console.log(learner)
    let user = createUser(learner);
    user.id=learner.userId;
    user.grade=learner.grade
    user.userCode=learner.learnerCode;
    user.isLearner=true;
    user.session.flow='learner_menu'
    let newUser = await addUser(user);
    return newUser
  }catch(error){
    console.log(error)
  }
  
}

const createTutorUser=async(tutor)=>{
  let user = createUser(tutor);
  user.id=tutor.userId;
  user.userCode=tutor.tutorCode;
  user.isTutor=true;
  user.session.flow='tutor_menu'
  user = await addUser(user);
  return user
}

const createCoachUser=async(coach)=>{
  let user = createUser(coach);
  user.id=coach.userId;
  user.userCode=coach.coachCode;
  user.isCoach=true;
  user.session.flow='coach_menu'
  user = await addUser(user);
  return user
}

const createParentUser=async(parent)=>{
  let user = createUser(parent);
  user.id=parent.userId;
  user.userCode=parent.parentCode;
  user.isCoach=true;
  user.session.flow='parent_menu'
  user = await addUser(user);
  return user
}

const getTemplate=async(name)=>{

    const PROJECT_NAME='Nerdhive'
    const Project=await getProject(PROJECT_NAME);
    // get all templates then filter by name
    let templates = Project.templates;
  console.log(templates)
  // return templates[2].value;
    for(let i = 0; i < templates.length; i++){
        let template=templates[i];
        console.log(`${template.name} vs ${name}`);
        if(template.name===name){
          console.log(template.value)
            return template.value;
        }
    }
}

const addLearner=async(learner)=>{

    try{
        let newLearner= new Learner(learner)
        let savedLearner = await newLearner.save(); 
        console.log(savedLearner);
        return true
    }catch(error){
        console.log(error)
    }
}
const getLearner = async(userId)=>{
    try{
        let learner = await Learner.findOne({userId:userId})
       console.log("inside get learner")
      
        if(learner==null){
            let phone = userId
            learner = await Learner.findOne({phone:phone})
           console.log(learner);
        }
      
        if(learner==null){
            let learnerCode=userId
            learner = await Learner.findOne({learnerCode:learnerCode})
            //change phone to some code
        }
        
        
        return learner
    }catch(error){
        console.log(error);
    }
}

const getLearners = async()=>{
    try{
        let learners = await Learner.find({})
        if(learners!==null){
            console.log("found learners")
            return learners
        }
       
    }catch(error){
        console.log(error);
    }
}

const getCoachLearners = async(coach)=>{
    try{
        let learners = await Learner.find({})
        if(learners!==null){
            console.log("found learners")
            learners=learners.filter(learner=>learner.coachId!==coach.userId)
            return learners
        }
       
    }catch(error){
        console.log(error);
    }
}

const getParentLearners = async(parent)=>{
    try{
        let learners = await Learner.find({})
        if(learners!==null){
            console.log("found learners")
            learners=learners.filter(learner=>learner.parentId!==parent.userId)
            return learners
        }
       
    }catch(error){
        console.log(error);
    }
}

const addCoach=async(coach)=>{

    try{
        let newCoach= new Coach(coach)
        let savedCoach = await newCoach.save(); 
        console.log(savedCoach);
        return true
    }catch(error){
        console.log(error)
    }
}

const getCoach = async(userId)=>{
    try{
        let coach = await Coach.findOne({userId:userId})
        if(coach==null){
          let phone = userId;
          coach = await Coach.findOne({phone:phone});
        }
      
        return coach
       
    }catch(error){
        console.log(error);
    }
}

const addTutor=async(tutor)=>{

    try{
        let newTutor= new Tutor(tutor)
        let savedTutor = await newTutor.save(); 
        console.log(savedTutor);
        return true
    }catch(error){
        console.log(error)
    }
}

const getTutor = async(userId)=>{
    try{
        let tutor = await Tutor.findOne({userId:userId})
        if(tutor==null){
          let phone = userId
          tutor = await Tutor.findOne({phone:phone})
           
        }
  
        return tutor
       
    }catch(error){
        console.log(error);
    }
}

const getLearnerCoach = async(learner)=>{
    try{
        let coaches = await Coach.find({})
        if(coaches!==null){
        
            for(let i = 0; i<coaches.length;i++){
                let coach=coaches[i]
                for(let j = 0 ;j < coach.learners.length ; j++){
                    if(coach.learners[j]===learner.userId){
                        return coach
                    }
                }
            }
        
        }
       
    }catch(error){
        console.log(error);
    }
}
const getTutors = async()=>{
    try{
        let tutors = await Tutor.find({})
        if(tutors!==null){
            console.log("found tutors")
            return tutors
        }
       
    }catch(error){
        console.log(error);
    }
}
const getLearnerParent = async(user)=>{
    try{
        let parent = await Parent.findOne({learnerId:user.id})
        if(parent==null){
            console.log("found parent")
            return parent
        }
       
    }catch(error){
        console.log(error);
    }
}

const getParent = async(userId)=>{
    try{
        let parent = await Parent.findOne({userId:userId})
        if(parent==null){
          let phone = userId
          parent = await Parent.findOne({phone:phone})
        }
       return parent
    }catch(error){
        console.log(error);
    }
}


const getTimetable = async(userId)=>{
    try{
        let timetable = await Timetable.findOne({userId:userId})
        if(timetable!==null){
            console.log("found timetable")
            return timetable
        }
       
    }catch(error){
        console.log(error);
    }
}

const getTimetables = async(userId)=>{
    try{
        let timetables = await Timetable.find({})
        if(timetables!==null){
            console.log("found timetables")
            return timetables
        }
       
    }catch(error){
        console.log(error);
    }
}

const updateTimetable = async(timetable)=>{
    try{
        let updatedTimetable= await Timetable.findByIdAndUpdate(timetable._id,timetable)
        if(updatedTimetable!==null){
            console.log("found timetable")
            return timetable
        }
       
    }catch(error){
        console.log(error);
    }
}

const getLessons = async(learner)=>{
    try{
        let lessons = await Lesson.find({})
        if(lessons!==null){
            console.log("found lessons")
            if(learner){
                lessons=lessons.filter(lesson=>lesson.learnerId!==learner.userId)
            }
            
            return lessons
        }
       
    }catch(error){
        console.log(error);
    }
}

const getLesson = async(lessonId)=>{

    try{
        let lesson = await Lesson.findOne({id:lessonId})
        if(lesson==null){
            let lessonCode=lessonId
            lesson = await Lesson.findOne({lessonCode:lessonCode})
            //change phone to some code
        }

        return lesson
               
    }catch(error){
        console.log(error);
    }
}
const updateLesson = async(lesson)=>{
    try{
  
        
        let lessonObj= await Lesson.findOne({id:lesson.id})
        if(lessonObj!==null){
            if(lessonObj.day!==lesson.day){
              lessonObj.day=lesson.day;
            }
            if(lessonObj.time!==lesson.time){
              lessonObj.time=lesson.time;
            }
            if(lessonObj.status!==lesson.status){
              lessonObj.status=lesson.status;
            }
          
           let savedLessonObj = await lessonObj.save();
            return savedLessonObj
        }
       
       
    }catch(error){
        console.log(error);
    }
}


const addLesson=async(lesson)=>{

    try{
        let newLesson= new Lesson(lesson);
        let savedLesson = await newLesson.save(); 
        console.log(savedLesson);
        return true
    }catch(error){
        console.log(error)
    }
}

const addJob=async(job)=>{

    try{
        let newJob= new Job(job)
        let savedJob = await newJob.save(); 
        console.log(savedJob);
        return true
    }catch(error){
        console.log(error)
    }
}

const getJobs = async()=>{
    try{
        let jobs = await Job.find({})
        return jobs
    }catch(error){
        console.log(error);
    }
}

const getJob = async(jobID)=>{
    try{
        let jobs = await Job.findOne({id:jobID})
        return jobs
    }catch(error){
        console.log(error);
    }
}

const updateJob = async(job)=>{
    try{
        let updatedJob= await Job.findByIdAndUpdate(job._id,job)
        if(updatedJob!==null){
            console.log("updated Job")
            console.log(updatedJob)
            return updatedJob
        }
       
    }catch(error){
        console.log(error);
    }
}
const addQuestion=async(question)=>{

    try{
        let newQuestion= new Question(question);
        let savedQuestion = await newQuestion.save(); 
        console.log(savedQuestion);
        return true
    }catch(error){
        console.log(error)
    }
}
const getLearnerQuestions = async()=>{
    try{
        let LearnerQuestions = await Question.find({})
        return LearnerQuestions
    }catch(error){
        console.log(error);
    }
}

const getLearnerQuestion = async(questionId)=>{
    try{
        let question = await Question.findOne({id:questionId})
        return question
    }catch(error){
        console.log(error);
    }
}

const updateLearnerQuestion = async(question)=>{
    try{
        let questionObj= await Question.findOne({id:question.id})
        if(questionObj.sentTo.length!==question.sentTo.length){
            questionObj.sentTo=question.sentTo;
        }

        if(questionObj.status!==question.status){
            questionObj.status=question.status;
        }

        if(questionObj.solver.userId!==question.solver.userId){
            questionObj.solver=question.solver;
        }
      
        if(questionObj.hasError!==question.hasError){
          questionObj.hasError=question.hasError
        }
      
        if(questionObj.errorReports.length!==question.errorReports.length){
          questionObj.errorReports=question.errorReports
        }

        let savedQuestionObj = await questionObj.save();
        return savedQuestionObj
       
    }catch(error){
        console.log(error);
    }
}

const addQuestionPaper=async(question)=>{

    try{
        let newQuestionPaper= new QuestionPaper(question);
        let savedQuestionPaper = await newQuestionPaper.save(); 
        console.log(savedQuestionPaper);
        return true
    }catch(error){
        console.log(error)
    }
}
const getQuestionPaper = async(query)=>{
    try{
        let questionPaper = await Question.findOne(query)
        return questionPaper
    }catch(error){
        console.log(error);
    }
}


const addWorksheet=async(worksheet)=>{

    try{
        let newWorksheet= new Worksheet(worksheet);
        let savedWorksheet = await newWorksheet.save(); 
        console.log(savedWorksheet);
        return true
    }catch(error){
        console.log(error)
    }
}
const getWorksheet = async(query)=>{
    try{
        let worksheet = await Worksheet.findOne(query)
        return worksheet
    }catch(error){
        console.log(error);
    }
}
//create updateJob, updateTutor, updateCoach, updateLearner




const addProperty=async(user_id)=>{

     let property={
         ownerID:user_id
     }
 
     try{
         let newProperty= new Property(property);
         let savedProperty = await newProperty.save(); 
         return savedProperty;
     }catch(error){
         console.log(error)
     }
 }







 const getProject = async(name)=>{
   
      try{
      let project = await Project.findOne({name:name})

      console.log("found project")
      // console.log(project)
        return project
      }catch(error){
          console.log(error);
      }

   
}


const getUser = async(user_number)=>{
    
    try{
        let user = await User.findOne({phone:user_number})
        if(user==null){
          let id = user_number
          user = await User.findOne({id:id});
          
        }
      
        if(user==null){
          console.log(user_number);
          let learner = await getLearner(user_number)
        
          if(learner!==null){
            user = await createLearnerUser(learner)
            return user
          }
          
          let tutor = await getTutor(user_number);
          if(tutor!==null){
            user = await createTutorUser(tutor)
            return user
          }
          
          let coach = await getCoach(user_number);
          if(coach!==null){
            user = await createCoachUser(coach)
            return user
          }
          
          let parent = await getParent(user_number);
          if(parent!==null){
            user = await createParentUser(parent);
            return user
          }
          ///if its new user create lead
          let lead = await createLead(user_number);
          if(lead!==null){
            user = await createLeadUser(lead)
            return user
          }
        }else{
          return user
        }
      
         
        
    }catch(error){
        console.log(error);
    }
}

const getChatUser = async(user_code)=>{
    try{
        let user = await User.findOne({userCode:user_code})
        
      console.log("found user")
        return user
    }catch(error){
        console.log(error);
    }
}

const getAllUsers = async()=>{
    try{
        let users = await User.find({})
      
        console.log("found users")
        return users
    }catch(error){
        console.log(error);
    }
}

const updateUserSession = async (user,transition)=>{
    let date = new Date()
    let session=user.session;
    session.flow=transition.flow
    if(transition.node){
      session.node=transition.node
    }else{
      session.node=transition.name
    }
    
    session.num=session.num + 1;
    session.lastUpdated=date;
   
    try{
       let userObj= await User.findOne({_id:user._id})
      userObj.session=session
      let updatedUser= await userObj.save()
      return true;
         
    }catch(error){
      console.log(error);
      return false;
      
    }
    
}
const updateUserInfo = async(user,data)=>{
    try{
        let updatedUser= await User.findByIdAndUpdate(user._id,data)
        console.log("updated user")
        console.log(updatedUser)
        return true;
    
      
    }catch(error){
      console.log(error);
      return false;
      
    }

}
const updateUser = async (user,data)=>{
 
    try{
        let updatedData=data;
        if(!data){
            if(user.session.num){
                let sessionNum = user.session.num +1;
               user.session.num =sessionNum
            }else{
                user.session.num = 0;
            }
    
            updatedData= user.session
        }
        
       
      let userObj= await User.findOne({_id:user._id})
      userObj.session=updatedData
      let updatedUser=await userObj.save();
  
      return true;
    
      
    }catch(error){
      console.log(error);
      return false;
      
    }
      
  }


  const addTimetable=async(timetable)=>{
 
     try{
         let newTimetable= new Timetable(timetable);
         let savedTimetable = await newTimetable.save(); 
         return savedTimetable;
     }catch(error){
         console.log(error)
     }
 }


const addUser=async(userData)=>{

    let user = userData;

    try{
        let newUser= new User(user);
        let savedUser = await newUser.save(); 
        console.log("user saved",savedUser)
        return savedUser;
    }catch(error){
        console.log(error)
    }
}

const addQuery=async(queryData)=>{
  let query = queryData;

    try{
        let newQuery= new Query(query);
        let savedQuery = await newQuery.save(); 
      
        return savedQuery;
    }catch(error){
        console.log(error)
    }
}

const updateQuery=async(id,data)=>{
  try{
        let updatedQuery= await Query.findByIdAndUpdate(id,data)
        return true
    
  }catch(error){
    console.log(error)
  }
}

const  deleteQuery=async(id)=>{
  try{
        let deletedQuery= await Query.findByIdAndRemove(id)
        return true
    
  }catch(error){
    console.log(error)
  }
}

const getQuery=async(id)=>{
  try{
    if(id){
      let query = Query.findOne({id:id});
      return query?query:null
    }else{
      let queries = Query.find({});
      return queries?queries:null
    }
  }catch(error){
    console.log(error)
  }
}

const addStudyNotes=async(notesData)=>{
  let notes = notesData;

    try{
        let newStudyNotes= new StudyNotes(notes);
        let savedStudyNotes = await newStudyNotes.save(); 
      
        return savedStudyNotes;
    }catch(error){
        console.log(error)
    }
}

const updateStudyNotes=async(id,data)=>{
  try{
        let updatedStudyNotes= await StudyNotes.findByIdAndUpdate(id,data)
        return true
    
  }catch(error){
    console.log(error)
  }
}

const  deleteStudyNotes=async(id)=>{
  try{
        let deletedStudyNotes= await StudyNotes.findByIdAndRemove(id)
        return true
    
  }catch(error){
    console.log(error)
  }
}

const getStudyNotes=async(id)=>{
  try{
    if(id){
      let notes = StudyNotes.findOne({id:id});
      return notes?notes:null
    }else{
      let allNotes = StudyNotes.find({});
      return allNotes?allNotes:null
    }
  }catch(error){
    console.log(error)
  }
}


const addNotes=async(notesData)=>{
  let notes = notesData;

    try{
        let newNotes= new Notes(notes);
        let savedNotes = await newNotes.save(); 
      
        return savedNotes;
    }catch(error){
        console.log(error)
    }
}

const updateNotes=async(id,data)=>{
  try{
        let updatedNotes= await Notes.findByIdAndUpdate(id,data)
        return true
    
  }catch(error){
    console.log(error)
  }
}

const  deleteNotes=async(id)=>{
  try{
        let deletedNotes= await Notes.findByIdAndRemove(id)
        return true
    
  }catch(error){
    console.log(error)
  }
}

const getNotes=async(query)=>{
  try{
    if(query.hasOwnProperty('topic')&&query.hasOwnProperty('subtopic')){
       let subtopicNotes = Notes.findOne(query);
      return subtopicNotes?subtopicNotes:null
    }
    else if(query){
      let notes = Notes.findOne({topic:query});
      return notes?notes:null
    }else{
      let allNotes = Notes.find({});
      return allNotes?allNotes:null
    }
  }catch(error){
    console.log(error)
  }
}

const addTest=async(testData)=>{
  let test = testData;

    try{
        let newTest= new Test(testData);
        let savedTest = await newTest.save(); 
        console.log(savedTest," test saved");
        return savedTest;
    }catch(error){
        console.log(error)
    }
}

const updateTest=async(id,data)=>{
  try{
        let updatedTest= await Test.findByIdAndUpdate(id,data)
        return true
    
  }catch(error){
    console.log(error)
  }
}

const  deleteTest=async(id)=>{
  try{
        let deletedTest= await Test.findByIdAndRemove(id)
        return true
    
  }catch(error){
    console.log(error)
  }
}

const getTest=async(id)=>{
  try{
    if(id){
      let test = Test.findOne({id:id});
      return test?test:null
    }else{
      let allTests = Test.find({});
      return allTests?allTests:null
    }
  }catch(error){
    console.log(error)
  }
}

const addTopicGuide=async(guideData)=>{
  let guide = guideData;

    try{
        let newTopicGuide= new TopicGuide(guideData);
        let savedTopicGuide = await newTopicGuide.save(); 
        console.log(savedTopicGuide," guide saved");
        return savedTopicGuide;
    }catch(error){
        console.log(error)
    }
}

const updateTopicGuide=async(id,data)=>{
  try{
        let updatedTopicGuide= await TopicGuide.findByIdAndUpdate(id,data)
        return true
    
  }catch(error){
    console.log(error)
  }
}

const  deleteTopicGuide=async(id)=>{
  try{
        let deletedTopicGuide= await TopicGuide.findByIdAndRemove(id)
        return true
    
  }catch(error){
    console.log(error)
  }
}

const getTopicGuide=async(topic)=>{
  try{
    if(topic){
      let guide = TopicGuide.findOne({topic:topic});
      return guide?guide:null
    }else{
      let allTopicGuides = TopicGuide.find({});
      return allTopicGuides?allTopicGuides:null
    }
  }catch(error){
    console.log(error)
  }
}

const addConversation=async(conversation)=>{

    try{
        let newConversation= new Conversation(conversation);
        let savedConversation = await newConversation.save(); 
        console.log(savedConversation," conversation saved");
        return savedConversation;
    }catch(error){
        console.log(error)
    }
}

const updateConversation=async(id,data)=>{
  try{
        let updatedConversation= await Conversation.findByIdAndUpdate(id,data)
        return true
    
  }catch(error){
    console.log(error)
  }
}

const addLead=async(lead)=>{

    try{
        let newLead= new Lead(lead);
        let savedLead = await newLead.save(); 
        console.log(savedLead," lead saved");
        return savedLead;
    }catch(error){
        console.log(error)
    }
}
const getLead=async(user)=>{

    try{
        let lead = await Lead.findOne({phone:user.phone})
        
        console.log(lead," lead");
        return lead;
    }catch(error){
        console.log(error)
    }
}

const updateLead=async(user,data)=>{
  
  try{
        let updatedLead= await Lead.findOneAndUpdate({userId:user.id},data)
        return true
    
  }catch(error){
    console.log(error)
  }
}

const addCustomerQuery=async(query)=>{

    try{
        let newCustomerQuery= new CustomerQuery(query);
        let savedCustomerQuery = await newCustomerQuery.save(); 
        console.log(savedCustomerQuery," query saved");
        return savedCustomerQuery;
    }catch(error){
        console.log(error)
    }
}
const getCustomerQuery=async(id)=>{

    try{
        let query = await CustomerQuery.findOne({id:id})
        
        console.log(query," query");
        return query;
    }catch(error){
        console.log(error)
    }
}

const getCustomerQueries=async(query)=>{

    try{
        let customerQueries = await CustomerQuery.find(query)
        
        console.log(customerQueries," customerQueries");
        return customerQueries;
    }catch(error){
        console.log(error)
    }
}

const updateCustomerQuery=async(query,data)=>{
  
  try{
        let updatedCustomerQuery= await CustomerQuery.findOneAndUpdate({id:query.id},data)
        return true
    
  }catch(error){
    console.log(error)
  }
}

const addCustomerSupport=async(data)=>{

    try{
        let newCustomerSupport= new CustomerSupport(data);
        let savedCustomerSupport = await newCustomerSupport.save(); 
        console.log(savedCustomerSupport," employee saved");
        return savedCustomerSupport;
    }catch(error){
        console.log(error)
    }
}
const getCustomerSupport=async(user)=>{

    try{
        let query = await CustomerSupport.findOne({phone:user.phone})
        
        console.log(query," query");
        return query;
    }catch(error){
        console.log(error)
    }
}

const getAllCustomerSupport=async(query)=>{

    try{
        let customerSupport = await CustomerSupport.find({})
        
        console.log(customerSupport," customerSupport");
        return customerSupport;
    }catch(error){
        console.log(error)
    }
}

const updateCustomerSupport=async(user,data)=>{
  
  try{
        let updatedCustomerSupport= await CustomerSupport.findOneAndUpdate({userId:user.id},data)
        return true
    
  }catch(error){
    console.log(error)
  }
}



module.exports = {
    addJob,
    getJob,
    getJobs,
    updateJob,
    addUser,
    getUser,
    getChatUser,
    getAllUsers,
    getProject,
    updateUser,
    getTimetable,
    getTimetables,
    updateTimetable,
    addLesson,
    updateLesson,
    getLearner,
    getLearners,
    getLesson,
    getLessons,
    getTutor,
    getTutors,
    updateLesson,
    updateUserSession,
    getTemplate,
    getLearnerCoach,
    getCoach,
    getParent,
    addJob,
    addLearner,
    addCoach,
    getLearnerQuestions,
    getLearnerQuestion,
    updateLearnerQuestion,
    addQuestion,
    addQuestionPaper,
    getQuestionPaper,
    getWorksheet,
    addWorksheet,
    addTimetable,
    addQuery,
    updateQuery,
    deleteQuery,
    addStudyNotes,
    updateStudyNotes,
    deleteStudyNotes,
    getStudyNotes,
    addNotes,
    updateNotes,
    deleteNotes,
    getNotes,
    addTest,
    updateTest,
    deleteTest,
    getTest,
    addTopicGuide,
    updateTopicGuide,
    deleteTopicGuide,
    getTopicGuide,
    addConversation,
    updateConversation,
    addLead,
    updateLead,
    getLead,
    addCustomerQuery,
    updateCustomerQuery,
    getCustomerQuery,
    getCustomerQueries,
    addCustomerSupport,
    updateCustomerSupport,
    getCustomerSupport,
    getAllCustomerSupport
}