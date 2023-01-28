const { parseTrueOrFalseQuestions, parseMultipleChoiceQuestions } = require('./utils');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const axios = require("axios");

const summarizeAndSimplify=async(text)=>{
  const response = await openai.createCompletion({
      model: "text-davinci-003",
      //prompt: `Summarize and simplify this for a sixth-grade student without leaving any key details:\n\n${text}.`,
      prompt: `Simplify this for a sixth-grade student without leaving any key details:\n\n${text}.`,
      temperature: 0.7,//was 0.7 intially
      max_tokens: 500,// was 64 intially
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      });
      console.log(response.data)
      return response.data.choices[0].text;
}



const isFollowUp=async(conversation)=>{
  let messages=JSON.parse(JSON.stringify(conversation.messages));
  let prompt=''
  if(messages.length>2){
    let currentMessage=messages.pop();
    let prevMessage1=messages.pop();
    let prevMessage2=messages.pop();
    prompt=`Is this message "${currentMessage}" a possible follow-up message of this exchange "${prevMessage2}" "${prevMessage1}" ? Respond with only yes or no.`
    //prompt = `Has the subject of the conversation changed since the previous exchanges: "${prevMessage2}" "${prevMessage1}" with this new message: "${currentMessage}" ? Respond with only yes or no`
  }else{
    let currentMessage=messages.pop();
    let prevMessage=messages.pop();
     prompt=`Is this message "${currentMessage}" a possible follow-up message of this message "${prevMessage}" ? Respond with only yes or no.`
    //prompt = `Has the context of the conversation changed since the previous exchanges: "${prevMessage}" with this new message: "${currentMessage}" ? Respond with only yes or no`
  }
  console.log("prompt :",prompt)
  const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.1,//was 0.7 intially
      max_tokens: 150,// was 64 intially
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      });
      console.log(response.data)
      let prediction= response.data.choices[0].text.toLowerCase().trim();
      conversation.tokens+=response.data.usage.total_tokens
      console.log(conversation.tokens," tokens used")
      console.log("is follow up ?",prediction)
      if(prediction.search(/yes/i)!==-1){
         console.log("returning true")
        return true
      }else{
        console.log("returning false")
        return false
      }
  
 
}


const generateNotes=async(topic)=>{

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Give me detailed notes about ${topic} as if it's a teacher explaining to a learner?`, 
      //prompt:`teach me about ${topic}`
      //prompt: `What are the key things I should know when studying ${topic}?`,
      temperature: 0.3,//was 3
      max_tokens: 1024,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      });
  
  console.log(response.data)
  return response.data.choices[0].text;
  
}

const generateGuide=async(topic)=>{
    let prompt=`Question: What are the key things I should study when studying alcohols in high school?
                Response: 1. Structure and Nomenclature: Understand the structure of alcohols and how to name them using the IUPAC system.

                          2. Physical Properties: Learn about the physical properties of alcohols such as boiling point, melting point, solubility, and density.

                          3. Chemical Properties: Understand the chemical properties of alcohols, such as their reactivity with other compounds, their oxidation states, and their reactivity with acids and bases.

                          4. Synthesis: Learn about the different methods used to synthesize alcohols, such as the Grignard reaction, the hydroboration-oxidation reaction, and the hydrogenation reaction.

                          5. Uses: Learn about the various uses of alcohols, such as in the production of fuels, solvents, and pharmaceuticals.

                          6. Health Effects: Understand the health effects of alcohol consumption, including its potential for addiction and the risks associated with excessive drinking.
                          
                Question: What are the key things I should study when studying ${topic} in high school?
                Response:
    
    `

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      //prompt: `What are the key things I should study when studying ${topic} in high school?`,
      prompt:prompt,
      temperature: 0.3,//was 3
      max_tokens: 600,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      });
  
  console.log(response.data)
  let response_text = response.data.choices[0].text;
  return response_text
  
}



const generateQuestions=async(notes)=>{

    let prompt1=`
          Generate 20 true/false questions from the given text
          
          Text:
              Organic chemistry is the study of compounds that contain carbon, and alcohols are a class of organic compounds that contain a hydroxyl group (-OH) bonded to a carbon atom. Alcohols are classified based on the number of carbon atoms bonded to the hydroxyl group, with the most common types being 1-carbon (methanol), 2-carbon (ethanol), and 3-carbon (propanol) alcohols.

              Alcohols can be either primary, secondary, or tertiary, depending on the number of carbon atoms bonded to the carbon atom that is bonded to the hydroxyl group. Primary alcohols have one carbon atom bonded to the carbon atom that is bonded to the hydroxyl group, secondary alcohols have two, and tertiary alcohols have three.

              Alcohols can be produced through a variety of methods, including the reduction of aldehydes and ketones, the fermentation of sugars, and the hydration of alkenes. They have a wide range of uses, including as solvents, fuels, and in the production of personal care and pharmaceutical products.

              Alcohols can also be oxidized to produce aldehydes, ketones, and carboxylic acids, depending on the conditions used. For example, ethanol can be oxidized to produce acetaldehyde, which can then be further oxidized to produce acetic acid.

              Alcohols are generally polar compounds due to the presence of the hydroxyl group, which can form hydrogen bonds with other molecules. This polarity gives them a number of unique properties, including the ability to dissolve many polar and ionic compounds and the ability to act as protic solvents, which means they can donate protons to reactants.

              Overall, alcohols are an important class of organic compounds with a wide range of uses and applications in a variety of fields.

          Questions:
              *Organic chemistry is the study of compounds that contain carbon. Answer: True
              *Alcohols are a class of organic compounds that contain a hydroxyl group bonded to a carbon atom. Answer: True
              *Methanol, ethanol, and propanol are all examples of 1-carbon alcohols. Answer: False
              *Primary alcohols have one carbon atom bonded to the carbon atom that is bonded to the hydroxyl group. Answer: True
              *Secondary alcohols have two carbon atoms bonded to the carbon atom that is bonded to the hydroxyl group. Answer: True
              *Tertiary alcohols have three carbon atoms bonded to the carbon atom that is bonded to the hydroxyl group. Answer: True
              *Alcohols can be produced through the reduction of aldehydes and ketones. Answer: True
              *Alcohols can be produced through the fermentation of sugars. Answer: True
              *Alcohols can be produced through the hydration of alkenes. Answer: True
              *Alcohols are used primarily as solvents. Answer: False
              *Alcohols can be oxidized to produce aldehydes. Answer: True
              *Alcohols can be oxidized to produce ketones. Answer: True
              *Alcohols can be oxidized to produce carboxylic acids. Answer: True
              *Ethanol can be oxidized to produce acetaldehyde. Answer: True
              *Acetaldehyde can be further oxidized to produce acetic acid. Answer: True
              *Alcohols are polar compounds due to the presence of the hydroxyl group. Answer: True
              *Alcohols have the ability to dissolve many polar and ionic compounds. Answer: True
              *Alcohols have the ability to act as protic solvents. Answer: True
              *Alcohols are not an important class of organic compounds. Answer: False
              *Alcohols have a wide range of uses and applications in a variety of fields. Answer: True

             
          Text:${notes}
          Questions:         
          
  `
          let prompt2=`
          Generate 12 multiple choice questions from the given text
          
          Text:
              Organic chemistry is the study of compounds that contain carbon, and alcohols are a class of organic compounds that contain a hydroxyl group (*OH) bonded to a carbon atom. Alcohols are classified based on the number of carbon atoms bonded to the hydroxyl group, with the most common types being 1-carbon (methanol), 2-carbon (ethanol), and 3-carbon (propanol) alcohols.

              Alcohols can be either primary, secondary, or tertiary, depending on the number of carbon atoms bonded to the carbon atom that is bonded to the hydroxyl group. Primary alcohols have one carbon atom bonded to the carbon atom that is bonded to the hydroxyl group, secondary alcohols have two, and tertiary alcohols have three.

              Alcohols can be produced through a variety of methods, including the reduction of aldehydes and ketones, the fermentation of sugars, and the hydration of alkenes. They have a wide range of uses, including as solvents, fuels, and in the production of personal care and pharmaceutical products.

              Alcohols can also be oxidized to produce aldehydes, ketones, and carboxylic acids, depending on the conditions used. For example, ethanol can be oxidized to produce acetaldehyde, which can then be further oxidized to produce acetic acid.

              Alcohols are generally polar compounds due to the presence of the hydroxyl group, which can form hydrogen bonds with other molecules. This polarity gives them a number of unique properties, including the ability to dissolve many polar and ionic compounds and the ability to act as protic solvents, which means they can donate protons to reactants.

              Overall, alcohols are an important class of organic compounds with a wide range of uses and applications in a variety of fields.

          Questions:
            *What is the main characteristic of an alcohol?
            a) A carbonyl group (-CO) bonded to a carbon atom
            b) A hydroxyl group (-OH) bonded to a carbon atom
            c) A carboxyl group (-COOH) bonded to a carbon atom
            d) A methyl group (-CH3) bonded to a carbon atom
            Answer: b) A hydroxyl group (-OH) bonded to a carbon atom

            *What are the most common types of alcohols based on the number of carbon atoms bonded to the hydroxyl group?
            a) 1-carbon, 2-carbon, and 3-carbon
            b) 4-carbon, 5-carbon, and 6-carbon
            c) 7-carbon, 8-carbon, and 9-carbon
            d) 10-carbon, 11-carbon, and 12-carbon
            Answer: a) 1-carbon, 2-carbon, and 3-carbon

            *How many carbon atoms are bonded to the carbon atom that is bonded to the hydroxyl group in a primary alcohol?
            a) One
            b) Two
            c) Three
            d) Four
            Answer: a) One

            *How many carbon atoms are bonded to the carbon atom that is bonded to the hydroxyl group in a secondary alcohol?
            a) One
            b) Two
            c) Three
            d) Four
            Answer: b) Two

            *How many carbon atoms are bonded to the carbon atom that is bonded to the hydroxyl group in a tertiary alcohol?
            a) One
            b) Two
            c) Three
            d) Four
            Answer: c) Three

            *Which of the following is not a method of producing alcohols?
            a) Reduction of aldehydes and ketones
            b) Fermentation of sugars
            c) Hydration of alkenes
            d) Substitution of a halogen atom in a hydrocarbon
            Answer: d) Substitution of a halogen atom in a hydrocarbon

            *Which of the following is not a use of alcohols?
            a) Solvents
            b) Fuels
            c) Personal care products
            d) Industrial coatings
            Answer: d) Industrial coatings

            *Can alcohols be oxidized to produce aldehydes?
            a) Yes
            b) No
            Answer: a) Yes

            *Can alcohols be oxidized to produce ketones?
            a) Yes
            b) No
            Answer: a) Yes

            *Can alcohols be oxidized to produce carboxylic acids?
            a) Yes
            b) No
            Answer: a) Yes

            *Is ethanol an example of a primary alcohol?
            a) Yes
            b) No
            Answer: b) No

            *Is acetaldehyde an example of a primary alcohol?
            a) Yes
            b) No
            Answer: b) No




          Text:${notes}
          Questions:         
          
  `
    
        const response_true_false = await openai.createCompletion({
        model: "text-davinci-003",
        temperature: 0.3,//was 3
        max_tokens: 2048,
        prompt:prompt1,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        });
        let true_false_qs=response_true_false.data.choices[0].text;
        true_false_qs=parseTrueOrFalseQuestions(true_false_qs);
        
        const response_multiple_choice = await openai.createCompletion({
        model: "text-davinci-003",
        temperature: 0.3,//was 3
        max_tokens: 2048,
        prompt:prompt2,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        });
        let multiple_choice_qs=response_multiple_choice.data.choices[0].text;
        multiple_choice_qs=parseMultipleChoiceQuestions(multiple_choice_qs);
  
        let questions = true_false_qs.concat(multiple_choice_qs);
        
        return questions
  
}

module.exports={
  summarizeAndSimplify,
  generateNotes,
  generateQuestions,
  generateGuide,
  isFollowUp
}