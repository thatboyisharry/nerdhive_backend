
const { htmlToImage } = require('./htmlToImage');

const FormData = require('form-data');
const { uploadToCloud } = require('../../actions/utils');

const generateQueryImage=async(customerQuery)=>{
  
  let queryInfoImage = await htmlToImage(customerQuery);
  let imageBase64String=Buffer.from(queryInfoImage).toString('base64')
  let formData= new FormData();
  formData.append('image',imageBase64String);
  let queryInfoImageUrl= await uploadToCloud(formData);
  console.log(queryInfoImageUrl,"query image url")
  return queryInfoImageUrl
}

module.exports={
  generateQueryImage
}