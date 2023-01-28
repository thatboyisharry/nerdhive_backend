

const mene=[
    {
        name:'start',
        flow:'learner_menu',
        node:'start',
        actions:[{name:'startChat',trigger:'talk_to_coach',flow:'startChat',onSuccess:'',onFailure:''},
                {name:'getNextLesson',trigger:'next_lesson',flow:'nextLesson',onSuccess:'',onFailure:''},
                {name:'getUpcomingLessons',trigger:'upcoming_lessons',flow:'upcomingLessons',onSuccess:'',onFailure:''}
            ],
        uis:[
            {
                type:'interactive',
                name:'learner_menu'
            },
        ],
        transitions:[
            {
                name:'ask_city',
                flow:'landlord', 
                node:'ask_city',
                catchNode:'none',
                trigger:""
            }
        ],
        catch:"",
        sticky:false

    
    },
]


const landlordNodes=[
    {
        name:'ask_province',
        flow:'landlord',
        node:'ask_province',
        actions:[{name:'saveProvince',trigger:'',flow:'landlord'}],
        uis:[
            {
                type:'interactive',
                name:'ask_province'
            },
        ],
        transitions:[
            {
                name:'ask_city',
                flow:'landlord', 
                node:'ask_city',
                catchNode:'none',
                trigger:""
            }
        ],
        catch:"",
        sticky:false

    
    },
    {
        name:'ask_city',
        flow:'landlord',
        node:'ask_city',
        actions:[{name:'saveCity',trigger:'',flow:'landlord'}],
        uis:[
            {
                type:'interactive',
                name:'ask_city'
            },
        ],
        transitions:[
            {
                name:'ask_town',
        
                flow:'landlord', 
                node:'ask_town',
                catchNode:'none',
                trigger:""
            }
        ],
        catch:"",
        sticky:false

    
    },
    {
        name:'ask_town',
        flow:'landlord',
        node:'ask_town',
        actions:[{name:'saveTown',trigger:'',flow:'landlord'}],
        uis:[
            {
                type:'interactive',
                name:'ask_town'
            },
        ],
        transitions:[
            {
                name:'ask_address',
                flow:'landlord', 
                node:'ask_address',
                catchNode:'none',
                trigger:""
            }
        ],
        catch:"",
        sticky:false

    
    },
    {
        name:'ask_address',
        flow:'landlord',
        node:'ask_address',
        actions:[{name:'saveStreetAddress',trigger:'',flow:'landlord'}],
        uis:[
            {
                type:'interactive',
                name:'ask_address'
            },
        ],
        transitions:[
            {
                name:'ask_property_type',
                flow:'landlord', 
                node:'ask_property_type',
                catchNode:'none',
                trigger:""
            }
        ],
        catch:"",
        sticky:false

    
    },
    {
        name:'ask_property_type',
        flow:'landlord',
        node:'ask_property_type',
        actions:[{name:'savePropertyType',trigger:'',flow:'lanlord'}],
        uis:[
            {
                type:'interactive',
                name:'ask_property_type'
            },
        ],
        transitions:[
            {
                name:'ask_rooms_available',
                flow:'landlord', 
                node:'ask_rooms_available',
                catchNode:'none',
                trigger:"backroom"
            },
            {
                name:'ask_bedrooms_available',
                flow:'landlord', 
                node:'ask_bedrooms_available',
                catchNode:'none',
                trigger:"apartment"
            }
        ],
        catch:"",
        sticky:false

    
    },
    {
        name:'ask_rooms_available',
        flow:'landlord',
        node:'ask_rooms_available',
        actions:[{name:'saveAvailableRoomsNum',trigger:'',flow:'landlord'}],
        uis:[
            {
                type:'interactive',
                name:'ask_rooms_available'
            },
        ],
        transitions:[
            {
                name:'ask_own_bathroom_availability',
                flow:'landlord', 
                node:'ask_own_bathroom_availability',
                catchNode:'none',
                trigger:""
            }
            
        ],
        catch:"",
        sticky:false

    
    },
    {
        name:'ask_bedrooms_available',
        flow:'landlord',
        node:'ask_bedrooms_available',
        actions:[{name:'saveBedroomsNum',trigger:'',flow:'landlord'}],
        uis:[
            {
                type:'interactive',
                name:'ask_bedrooms_available'
            },
        ],
        transitions:[
           
            {
                name:'ask_bedrooms_available',
                flow:'landlord', 
                node:'ask_own_bathroom_availability',
                catchNode:'none',
                trigger:""
            }
            
        ],
        catch:"",
        sticky:false

    
    },
    {
        name:'ask_own_bathroom_availability',
        flow:'landlord',
        node:'ask_own_bathroom_availability',
        actions:[{name:'hasOwnBathroom',trigger:'yes',flow:'landlord'}],
        uis:[
            {
                type:'interactive',
                name:'ask_own_bathroom_availability'
            },
        ],
        transitions:[
            {
                name:'ask_shower_availability',
                flow:'landlord', 
                node:'ask_shower_availability',
                catchNode:'none',
                trigger:"yes"
            },
            {
                name:'ask_parking_availability',
                flow:'landlord', 
                node:'ask_parking_availability',
                catchNode:'none',
                trigger:"no"
            }
        ],
        catch:"",
        sticky:false

    
    },
    {
        name:'ask_shower_availability',
        flow:'landlord',
        node:'ask_shower_availability',
        actions:[{name:'hasShower',trigger:"",flow:"landlord"}],
        uis:[
            {
                type:'interactive',
                name:'ask_shower_availability'
            },
        ],
        transitions:[
            {
                name:'ask_parking_availability',
                flow:'landlord', 
                node:'ask_parking_availability',
                catchNode:'none',
                trigger:""
            }
            
        ],
        catch:"",
        sticky:false

    
    },
    {
        name:'ask_parking_availability',
        flow:'landlord',
        node:'ask_parking_availability',
        actions:[{name:'hasParking',trigger:'',flow:'landlord'}],
        uis:[
            {
                type:'interactive',
                name:'ask_parking_availability'
            },
        ],
        transitions:[
            {
                name:'ask_rent_info',
                flow:'landlord', 
                node:'ask_rent_info',
                catchNode:'none',
                trigger:""
            }
            
        ],
        catch:"",
        sticky:false

    
    },
    {
        name:'ask_rent_info',
        flow:'landlord',
        node:'ask_rent_info',
        actions:[{name:'saveRentAmount',trigger:'',flow:'landlord'}],
        uis:[
            {
                type:'interactive',
                name:'ask_rent_info'
            },
        ],
        transitions:[
            {
                name:'ask_deposit_required',
                flow:'landlord', 
                node:'ask_deposit_required',
                catchNode:'none',
                trigger:""
            }
            
        ],
        catch:"",
        sticky:false

    
    },
    {
        name:'ask_deposit_required',
        flow:'landlord',
        node:'ask_deposit_required',
        actions:[{name:'depositRequired',trigger:"",flow:'landlord'}],
        uis:[
            {
                type:'interactive',
                name:'ask_deposit_required'
            },
        ],
        transitions:[
            {
                name:'ask_deposit_amount',
                flow:'landlord', 
                node:'ask_deposit_amount',
                catchNode:'none',
                trigger:"yes"
            },
            {
                name:'ask_additional_info',
                flow:'landlord', 
                node:'ask_additional_info',
                catchNode:'none',
                trigger:"no"
            }
            
        ],
        catch:"",
        sticky:false

    
    },
    {
        name:'ask_deposit_amount',
        flow:'landlord',
        node:'ask_deposit_amount',
        actions:[{name:'saveDepositAmount',trigger:'',flow:'landlord'}],
        uis:[
            {
                type:'interactive',
                name:'ask_deposit_amount'
            },
        ],
        transitions:[
            {
                name:'ask_additional_info',
                flow:'landlord', 
                node:'ask_additional_info',
                catchNode:'none',
                trigger:""
            }
            
        ],
        catch:"",
        sticky:false

    
    },
    {
        name:'ask_additional_info',
        flow:'landlord',
        node:'ask_additional_info',
        actions:[{name:'saveAdditionalInfo',trigger:'',flow:'landlord'}],
        uis:[
            {
                type:'interactive',
                name:'ask_additional_info'
            },
        ],
        transitions:[
            {
                name:'ask_property_pictures',
                flow:'landlord', 
                node:'ask_property_pictures',
                catchNode:'none',
                trigger:""
            }
            
        ],
        catch:"",
        sticky:false

    
    },
   {
        name:'ask_property_pictures',
        flow:'landlord',
        node:'ask_property_pictures',
        actions:[{name:'savePropertyPictures',trigger:'',flow:'landlord'}],
        uis:[
            {
                type:'text',
                name:'ask_property_pictures'
            },
        ],
        transitions:[
             {
                name:'get_pictures',
                flow:'landlord', 
                node:'get_pictures',
                catchNode:'none',
                trigger:"done"
            }
            
        ],
        catch:"",
        sticky:true

    
    },
    {
          name:'get_pictures',
          flow:'landlord',
          node:'get_pictures',
          actions:[],
          uis:[
              {
                  type:'image',
                  name:'get_pictures'
              },
          ],
          transitions:[
               {
                  name:'ask_additional_info',
                  flow:'landlord', 
                  node:'ask_additional_info',
                  catchNode:'none',
                  trigger:""
              }

          ],
          catch:"",
        sticky:false


      },
  
  
  
]



module.exports={
  landlordNodes
}