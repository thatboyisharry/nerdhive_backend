
const getWeelkyAppointments=(timetable)=>{
    let appointments=[];
    

    if(timetable.monday.length>0){
      let day=timetable.monday
      for(let i = 0 ;i < day.length;i++){
        appointments.push(day[i])
      }
        
    }

    if(timetable.tuesday.length>0){
        let day=timetable.tuesday
      for(let i = 0 ;i < day.length;i++){
        appointments.push(day[i])
      }
    }

    if(timetable.wednesday.length>0){
        let day=timetable.wednesday
      for(let i = 0 ;i < day.length;i++){
        appointments.push(day[i])
      }
    }
    if(timetable.thursday.length>0){
        let day=timetable.thursday
      for(let i = 0 ;i < day.length;i++){
        appointments.push(day[i])
      }
    }
    if(timetable.friday.length>0){
       let day=timetable.friday
      for(let i = 0 ;i < day.length;i++){
        appointments.push(day[i])
      }
    }
    if(timetable.saturday.length>0){
       let day=timetable.saturday
      for(let i = 0 ;i < day.length;i++){
        appointments.push(day[i])
      }
    }

    if(timetable.sunday.length>0){
        let day=timetable.sunday
      for(let i = 0 ;i < day.length;i++){
        appointments.push(day[i])
      }
    }
    
    return appointments

}

module.exports={
    getWeelkyAppointments
 }