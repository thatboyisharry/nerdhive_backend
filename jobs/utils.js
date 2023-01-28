const { getTimetables, getLesson, getUser } = require("../services/apiCalls");

const getAppointments=async()=>{
    let date = new Date();
    let day = date.getDay();
    let  timetables = await getTimetables()

    if(day==0){
        let appointments=[]
        for(let i = 0 ; i < timetables.length ; i++){
            let sundays=timetables[i].sunday
            appointments=appointments.concat(sundays) 
        }
        return appointments
    }

    if(day==1){
        let appointments=[]
        for(let i = 0 ; i < timetables.length ; i++){
            let mondays=timetables[i].monday
            appointments=appointments.concat(mondays) 
        }
        return appointments
        
    }

    if(day==2){
        let appointments=[]
        for(let i = 0 ; i < timetables.length ; i++){
            let tuesdays=timetables[i].tuesday
            appointments=appointments.concat(tuesdays) 
        }
        return appointments
        
    }

    if(day==3){
        let appointments=[]
        for(let i = 0 ; i < timetables.length ; i++){
            let wednesdays=timetables[i].wednesday
            appointments=appointments.concat(wednesdays) 
        }
        return appointments
        
    }

    if(day==4){
        let appointments=[]
        for(let i = 0 ; i < timetables.length ; i++){
            let thursdays=timetables[i].thursday
            appointments=appointments.concat(thursdays) 
        }
    }

    if(day==5){
        let appointments=[]
        for(let i = 0 ; i < timetables.length ; i++){
            let fridays=timetables[i].friday
            appointments=appointments.concat(fridays) 
        }
        return appointments
    }

    if(day==6){
        let appointments=[]
        for(let i = 0 ; i < timetables.length ; i++){
            let saturdays=timetables[i].saturday
            appointments=appointments.concat(saturdays) 
        }
        return appointments
    }

}



const getAppointmentMembers=async(appointments)=>{

    let lessons = []
        for(let k = 0 ; k< appointments; k++){
            let appointment=appointments[j]
            let lessonId = appointment.lessonId;
            let lesson = await getLesson(lessonId);
            lessons.push(lesson)
        }

        let learners=[]
        let tutors=[]
        for (let c = 0; c<lessons.length;c++){
            let learnerId = lessons[c].learnerId
            let tutorId = lessons[c].tutorId
            for(let i = 0; i<learners.length;i++){
                if(learnerId===learners[i]){
                    break
                }
                learners.push(learnerId)

            }

            for(let i = 0; i<tutors.length;i++){
                if(tutorId===tutors[i]){
                    break
                }
                tutors.push(tutorId)
            }
        }

        return {
            learners,
            tutors
        }

}

const getActiveJobs=(allJobs)=>{
    let jobs=[];
    for(let i = 0 ; i< allJobs.length ;i++){
        let job = allJobs[i];
        if(job.status==='active'){
            jobs.push(job);
        }
    }

    return jobs
}

const isSentJob=(job,user)=>{
    let sentJobs = user.sentJobs;
    for(let i = 0 ; i <sentJobs.length ; i++){
        if(sentJobs[i]===job.id){
            return true
        }
    }
    return false
}

const getUnsolvedQuestions=(questions)=>{
    let  unsolvedQuestions = questions.filter(question=>question.status==='unsolved')
    return unsolvedQuestions
}
const getNextTutor=async(tutors,question)=>{
    //filter tutors who are already helpingds
    let availableTutors=tutors.filter(tutor=>tutor.isHelping===false);
    console.log("availableTutors")
    console.log(availableTutors)
    //filter out those who already received the question
    for(let i = 0; i < question.sentTo.length;i++){
        let tutorId=question.sentTo[i]
       availableTutors = availableTutors.filter(tutor=>tutor.userId!==tutorId);
    }
  
   console.log("availableTutors 2")
  console.log(availableTutors)
    //filter those who has pending invite or currently chatting
    let candidates=[]
    console.log(availableTutors.length)
    if(!(availableTutors.length===0)){
      console.log(availableTutors.length)
      for(let i = 0;i<availableTutors.length;i++){
        let tutor = availableTutors[i];
         let tutorUser = await getUser(tutor.phone);
         console.log("tutorUser")
        console.log(tutorUser)
        if(!(tutorUser.session.helpRequest.invite||tutorUser.session.chat.active||tutorUser.session.chat.invite)){
            candidates.push(tutor);
        }
      }
      
    }
   console.log("candidates")
  console.log(candidates)

    //write any algorithm to choose a tutor to choose from the available candidates
    //get a random seed value to choose candidate
    if(candidates.length>0){
       let seed = Math.floor(Math.random()*candidates.length)
        return candidates[seed];
       
    }else{
      return null
    }
    
}

const getNextSupportAid=async(supportAids,query)=>{
    //filter out support aids that are already helping
    let availableAids=supportAids.filter(support=>support.isHelping===false);
   
    console.log(availableAids,"available aids")
    //filter out those who already received the query
    for(let i = 0; i < query.sentTo.length;i++){
        let supportId=query.sentTo[i]
       availableAids = availableAids.filter(support=>support.userId!==supportId);
    }
  
  
  console.log(availableAids,"available Aids 2")
    //filter those who has pending invite or currently chatting
    let candidates=[]
    console.log(availableAids.length)
    if(!(availableAids.length===0)){
      console.log(availableAids.length)
      for(let i = 0;i<availableAids.length;i++){
        let support = availableAids[i];
         let supportUser = await getUser(support.phone);
         console.log("supportUser")
        console.log(supportUser)
        if(!(supportUser.session.helpRequest.invite||supportUser.session.chat.active||supportUser.session.chat.invite)){
          if(!supportUser.session.customerSupport.invite){
            candidates.push(support);
          }
            
        }
      }
      
    }

  console.log(candidates,"candidates")

    //write any algorithm to choose a tutor to choose from the available candidates
    //get a random seed value to choose candidate
    if(candidates.length>0){
       let seed = Math.floor(Math.random()*candidates.length)
        return candidates[seed];
       
    }else{
      return null
    }
    
}

module.exports={
   getAppointments,
   getAppointmentMembers,
   getActiveJobs,
   isSentJob,
   getNextTutor,
   getUnsolvedQuestions,
    getNextSupportAid
}