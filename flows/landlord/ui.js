const { createButton, createInteractiveButton, createRow, createSection, createInteractiveList, createTextUI } =require("../../messages/templates");
const EmojiConvertor = require('emoji-js');

const emoji = new EmojiConvertor();

emoji.replace_mode="unified"
emoji.allow_native = true;

let backroom_id="backroom"
let backroom_title="Backroom"
let backroom_description=""
let backroom_row = createRow(backroom_id,backroom_title,backroom_description)

let house_id="house"
let house_title="House"
let house_description=""
let house_row = createRow(house_id,house_title,house_description)

let apartment_id="apartment"
let apartment_title="Apartment"
let apartment_description=""
let apartment_row = createRow(apartment_id,apartment_title,apartment_description)

let properties_section=createSection("properties",[backroom_row,house_row,apartment_row]);
let ask_property_type = createInteractiveList("ask_property_type",[properties_section]);
ask_property_type.value.header.text="Getting started"
ask_property_type.value.body.text=emoji.replace_colons(`Alright then :smile:, let us help you find tenants for your property.\nWhat kind of property are you renting ?`);
ask_property_type.value.footer.text="Choose the type of property you are renting ";
ask_property_type.value.action.button="Type of properties";

////////////////////////////////////////////////////////////////////////////////
let gauteng_id="gauteng_id"
let gauteng_title="Gauteng"
let gauteng_description=""
let gauteng_row = createRow(gauteng_id,gauteng_title,gauteng_description)

let limpopo_id="limpopo_id"
let limpopo_title="Limpopo"
let limpopo_description=""
let limpopo_row = createRow(limpopo_id,limpopo_title,limpopo_description)

let free_state_id="free_state_id"
let free_state_title="Free State"
let free_state_description=""
let free_state_row = createRow(free_state_id,free_state_title,free_state_description)

let north_west_id="north_west_id"
let north_west_title="North West"
let north_west_description=""
let north_west_row = createRow(north_west_id,north_west_title,north_west_description)

let northern_cape_id="northern_cape_id"
let northern_cape_title="Northern Cape"
let northern_cape_description=""
let northern_cape_row = createRow(northern_cape_id,northern_cape_title,northern_cape_description)

let western_cape_id="western_cape_id"
let western_cape_title="Western Cape"
let western_cape_description=""
let western_cape_row = createRow(western_cape_id,western_cape_title,western_cape_description)

let eastern_cape_id="eastern_cape_id"
let eastern_cape_title="Eastern Cape"
let eastern_cape_description=""
let eastern_cape_row = createRow(eastern_cape_id,eastern_cape_title,eastern_cape_description)

let kzn_id="kzn_id"
let kzn_title="KwaZulu-Natal"
let kzn_description=""
let kzn_row = createRow(kzn_id,kzn_title,kzn_description)

let mpumalanga_id="mpumalanga_id"
let mpumalanga_title="Mpumalanga"
let mpumalanga_description=""
let mpumalanga_row = createRow(mpumalanga_id,mpumalanga_title,mpumalanga_description)

let province_section=createSection("provinces",[gauteng_row,kzn_row,western_cape_row,limpopo_row, free_state_row,northern_cape_row,mpumalanga_row,north_west_row,eastern_cape_row]);
let ask_province = createInteractiveList("ask_province",[province_section]);


ask_province.value.header.text="Province"
ask_province.value.body.text=emoji.replace_colons(`In what province is your property located ?`);
ask_province.value.footer.text="Choose a province ";
ask_province.value.action.button="Provinces";

////////////////////////////////////////////////////////////
let city_message = "In what city is your property located ?"
const ask_city = createTextUI('ask_city',city_message);

//////////////////////////////////////////////////////
let town_message = "In what township/suburb is your property located ?"
const ask_town = createTextUI('ask_town',town_message);

///////////////////////////////////////////////
let address_message = "What is the street address of your property ?"
const ask_address = createTextUI('ask_address',address_message);

///////////////////////////////////////////////////////////
////how many BackRooms 

let one_id="one_id"
let one_title="1"
let one_description=""
let one_row = createRow(one_id,one_title,one_description)

let two_id="two_id"
let two_title="2"
let two_description=""
let two_row = createRow(two_id,two_title,two_description)

let three_id="three_id"
let three_title="3"
let three_description=""
let three_row = createRow(three_id,three_title,three_description)

let four_id="four_id"
let four_title="4"
let four_description=""
let four_row = createRow(four_id,four_title,four_description)

let five_id="five_id"
let five_title="5"
let five_description=""
let five_row = createRow(five_id,five_title,five_description)

let six_id="six_id"
let six_title="6"
let six_description=""
let six_row = createRow(six_id,six_title,six_description)

let seven_id="seven_id"
let seven_title="7"
let seven_description=""
let seven_row = createRow(seven_id,seven_title,seven_description)

let eight_id="eight_id"
let eight_title="8"
let eight_description=""
let eight_row = createRow(eight_id,eight_title,eight_description)

let nine_id="nine_id"
let nine_title="9"
let nine_description=""
let nine_row = createRow(nine_id,nine_title,nine_description)

let ten_id="ten_id"
let ten_title="10"
let ten_description=""
let ten_row = createRow(ten_id,ten_title,ten_description)

let nums_section=createSection("available rooms",[one_row,two_row,three_row,four_row,five_row,six_row,seven_row,eight_row,nine_row,ten_row]);


let ask_rooms_available = createInteractiveList("ask_rooms_available",[nums_section]);
ask_rooms_available.value.header.text="Number of available rooms"
ask_rooms_available.value.body.text=`How many rooms are currently available ?`;
ask_rooms_available.value.footer.text="Select a number";
ask_rooms_available.value.action.button="Number of rooms";
/////////////////////////////////////////////////
//////************NO. of BEDROOMS*************** */
let ask_bedrooms_available = createInteractiveList("ask_bedrooms_available",[nums_section]);
ask_bedrooms_available.value.header.text="Number of bedrooms"
ask_bedrooms_available.value.body.text=`How many bedrooms does the property have ?`;
ask_bedrooms_available.value.footer.text="Select a number";
ask_bedrooms_available.value.action.button="Number of bedrooms";

//////////////////////////////////////////////////
//*********PARKING******** */

const yes = createButton('yes','Yes');
const no = createButton('no','No');
const options = [yes,no]


const ask_parking_availability = createInteractiveButton('ask_parking_availability',options);
ask_parking_availability.value.body.text="Is parking space available ?"

////////////////////////////////////////////////////
///////**********SHOWER**************** */
const ask_own_bathroom_availability = createInteractiveButton('ask_own_bathroom_availability',options);
ask_own_bathroom_availability.value.body.text="Will the tenant have their own bathroom?"


///////////////////////////////////////////////////
///////**********IS SHOWER SHARED/PRIVATE**************** */
const ask_shower_availability = createInteractiveButton('ask_shower_availability',options);
ask_shower_availability.value.body.text="Does the bathroom come with a shower ?"


///////////////////////////////////////////////
////***************additional info********* */
let additional_info_message = "What other additional information do you want to add about your property ?"
const ask_additional_info = createTextUI('ask_additional_info',additional_info_message);

///////////////////////////////////////////////
///***************Rent info************ */
let rent_info_message = "How much is the rent ?\n*R*"
const ask_rent_info = createTextUI('ask_rent_info',rent_info_message);

///////////////////////////////////////////////////
///////**********IS DEPOSIT FEE REQUIRED**************** */
const ask_deposit_required = createInteractiveButton('ask_deposit_required',options);
ask_deposit_required.value.body.text="Is a deposit fee required ?"

///////////////////////////////////////////////////
///////**********DEPOSIT FEE**************** */
let deposit_amount_message = "How much is the deposit fee ?\n*R*"
const ask_deposit_amount = createTextUI('ask_deposit_amount',deposit_amount_message);

let property_pictures_message = emoji.replace_colons(`Great! :smile: , we are almost done.\n Send us the pictures of your property and send *done* when you're done.`)
const ask_property_pictures = createTextUI('ask_property_pictures',property_pictures_message);


module.exports = {
    ask_property_type,
    ask_province,
    ask_city,
    ask_town,
    ask_address,
    ask_bedrooms_available,
    ask_rooms_available,
    ask_parking_availability,
    ask_own_bathroom_availability,
    ask_rent_info,
    ask_deposit_required,
    ask_shower_availability,
    ask_deposit_amount,
    ask_additional_info,
    ask_property_pictures
}