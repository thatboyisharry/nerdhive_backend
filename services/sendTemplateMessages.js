const { sendResponse } = require("../dialogEngine");
const { getTimetables, getLesson, getLearner, getTutor } = require("../services/apiCalls");

const token = process.env.WHATSAPP_TOKEN;
const phone_number_id = process.env.phone_number_id;


const sendTemplateMessage=async(msgTemplate,data,receiver)=>{
    const { phone }=receiver;

    let messages=[]
    // template.components[0].parameters[0].text=user.name;
    if(msgTemplate.template.name==="learner_good_morning_text"){
        const { learner } = data;
        msgTemplate.template.components[0].parameters[0].text=learner.name;
        messages.push(msgTemplate)
    
    }

    if(msgTemplate.template.name==="tutor_good_morning_text"){
        const { tutor } = data;
        msgTemplate.template.components[0].parameters[0].text=tutor.name;
        messages.push(msgTemplate)
    
    }

    if(msgTemplate.template.name==="learner_morning_lesson_reminder"){
        const { tutor , learner , lesson , appointment} = data;
        msgTemplate.template.components[0].parameters[0].text=lesson.topic;
        msgTemplate.template.components[0].parameters[1].text=tutor.name;
        msgTemplate.template.components[0].parameters[2].text=appointment.time;
        messages.push(msgTemplate)
    
    }

    if(msgTemplate.template.name==="tutor_morning_lesson_reminder"){
        const { tutor , learner , lesson , appointment } = data;
        msgTemplate.template.components[0].parameters[0].text=lesson.topic;
        msgTemplate.template.components[0].parameters[1].text=learner.name;
        msgTemplate.template.components[0].parameters[2].text=appointment.time;
        messages.push(msgTemplate)
    }

    if(msgTemplate.template.name==="learner_pre_lesson_reminder"){
        const { tutor , learner , lesson ,link, appointment} = data;
        msgTemplate.template.components[0].parameters[0].text=learner.name;
        msgTemplate.template.components[1].parameters[0].text=tutor.name;
        msgTemplate.template.components[1].parameters[1].text=link;
        messages.push(msgTemplate)
    
    }

    if(msgTemplate.template.name==="tutor_pre_lesson_reminder"){
        const { tutor , learner , lesson ,link, appointment } = data;
        msgTemplate.template.components[0].parameters[0].text=tutor.name;
        msgTemplate.template.components[1].parameters[0].text=learner.name;
        msgTemplate.template.components[1].parameters[1].text=link;
        messages.push(msgTemplate)
    }

    if(msgTemplate.template.name==="learner_post_lesson_survey"){
        const { tutor , learner , lesson ,link, appointment} = data;
        msgTemplate.template.components[0].parameters[0].text=learner.name;
        msgTemplate.template.components[0].parameters[1].text=tutor.name;
        messages.push(msgTemplate)
    
    }

    if(msgTemplate.template.name==="tutor_post_lesson_survey"){
        const { tutor , learner , lesson ,link, appointment } = data;
        msgTemplate.template.components[0].parameters[0].text=tutor.name;
        msgTemplate.template.components[0].parameters[1].text=learner.name;
        messages.push(msgTemplate)
    }

    if(msgTemplate.template.name==="job_alert"){
        const { payout, lesson } = data;
        msgTemplate.template.components[0].parameters[0].text=lesson.subject
        msgTemplate.template.components[0].parameters[1].text=lesson.topic
        msgTemplate.template.components[0].parameters[2].text=lesson.grade
        msgTemplate.template.components[0].parameters[3].text=payout
        messages.push(msgTemplate)
    }

    if(msgTemplate.template.name==="job_candidate"){
        const { tutor,job} = data;
        const { lesson } = job.lesson;
        
    }

    if(msgTemplate.template.name==="help_request_invite"){
        const { question} = data;
        msgTemplate.template.components[0].parameters[0].text=question.subject
        msgTemplate.template.components[0].parameters[1].text=question.topic
        msgTemplate.template.components[0].parameters[2].text=question.grade
        messages.push(msgTemplate)
    }

    if(msgTemplate.template.name==="customer_support_invite"){
        const { query,support} = data;
        msgTemplate.template.components[0].parameters[0].text=support.name
        msgTemplate.template.components[0].parameters[1].text=query.type
       
        messages.push(msgTemplate)
    }




    await sendResponse(phone_number_id,token,phone,messages)
}

module.exports={
    sendTemplateMessage
}