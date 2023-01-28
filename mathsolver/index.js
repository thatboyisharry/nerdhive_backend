const mathsteps = require('mathsteps');
const asciimath2latex= require('asciimath-to-latex').default;
const {Change}=require('./changes')
const {generateLatexImage}=require('./latexToImage');

const mathsolver =async(mathproblem)=>{
  console.log("math problem................")
  console.log(mathproblem)
  
  function charIsLetter(char) {
  
  if (typeof char !== 'string') {
    return false;
  }

    return /^[a-zA-Z]+$/.test(char);
  }

  function charIsNotLetter(char) {

    if(char==='-'||char==='+'){
      return true;
    }

    if(char==='*'||char==='/'){
      return true;
    }

    if(char==='('||char===')'){
      return true;
    }

    if(char==='.'){
      return true;
    }
    if(char*1){
      return true
    }
    char=char*1;
    if (typeof char === 'string') {
      return false;
    }

    return true
  }


  function charIsOperator(char) {

    if(char==='-'||char==='+'){
      return true;
    }

    if(char==='*'||char==='/'||char==='^'){
      return true;
    }

    if(char==='('||char===')'||char==='='){
      return true;
    }

    if(char==='.'){
      return true;
    }


    return false
  }
  
  const parseMathProblem=(math_string)=>{
    const stringArray=math_string.split('');
    for(let i = 0;i<stringArray.length;i++){
      if(stringArray[i]===' '){
        stringArray.splice(i, 1)
      }
    }

    for(let i=0;i<stringArray.length-1;i++){
      let char=stringArray[i];
      let nextChar=stringArray[i+1];
      if(charIsLetter(char)){
        if(charIsNotLetter(nextChar)&&!charIsOperator(nextChar)){
          stringArray.splice(i+1,0,"^")
        }
      }

    }
  let problem = stringArray.join("")
  let isExpression=false;
  let isEquation=false;
  if(problem.includes('=')){
    isEquation=true
  }else{
    isExpression=true
  }
  console.log(problem)
  return {
      problem,
      isEquation,
      isExpression
    }
    
  }
  
  let parsedProblem = parseMathProblem(mathproblem);
  
  //check if problem is a 3rd degree polynomial
  if((/(\w\^3)/g.test(parsedProblem.problem))){
    //return false because we can't currently solve these kind of problems
    return false;
  }
  
  let fact_steps=mathsteps.factor(parsedProblem.problem);
  console.log(fact_steps)
  
  if(parsedProblem.isExpression){
    const {problem}=parsedProblem
    
    let steps=mathsteps.simplifyExpression(problem);
    if(!steps[0]){
      
      console.log("invalid expression")
      steps=mathsteps.factor(problem)
      if(steps.length<1){
        return false
      }
      
    }
    console.log(steps)
    let solution=''
    solution=`$$${steps[0].oldNode.toString()}$$`
     if(steps.length===1&&(steps[0].substeps.length===0)){
       
       steps.forEach(step => {
        solution=solution + `$$${Change.formatChange(step)}$$`
        solution= solution +`$$${step.newNode.toString()}$$`
    
      });
      
    }
    else if(steps.length===1&&steps[0]){
       steps[0].substeps.forEach(step => {
        solution=solution + `$$${Change.formatChange(step)}$$`
        solution= solution +`$$${step.newNode.toString()}$$`
    
      });
    } else if(steps.length>=1){
      steps.forEach(step => {
        solution=solution + `$$${Change.formatChange(step)}$$`
        solution= solution +`$$${step.newNode.toString()}$$`
    
      });
    }else{
      return false
    }
    
    let solutionImage=await generateLatexImage(solution)
    return solutionImage
  }
  
  
  if(parsedProblem.isEquation){
    const {problem}=parsedProblem
    
    const steps=mathsteps.solveEquation(problem);
    if(!steps[0]){
      
      console.log("invalid equation")
      return false
    }
    console.log(steps)
    let solution=''
    solution=`$$${asciimath2latex(steps[0].oldEquation.ascii())}$$`;
    if(steps.length===1){
        let substeps=steps[0].substeps
        substeps.forEach(step => {

        // console.log("before change: " + step.oldEquatio{n.ascii());  // e.g. before change: 2x + 3x = 35
        solution=solution+`$$${Change.formatChange(step)}$$`;

        solution=solution+`$$${asciimath2latex(step.newEquation.ascii())}$$`;   // e.g. after 


      });
    }else{
        steps.forEach(step => {

        // console.log("before change: " + step.oldEquatio{n.ascii());  // e.g. before change: 2x + 3x = 35
        solution=solution+`$$${Change.formatChange(step)}$$`;

        solution=solution+`$$${asciimath2latex(step.newEquation.ascii())}$$`;   // e.g. after 


      });
    }
    
  
    let solutionImage=await generateLatexImage(solution)
    console.log(solution);
    return solutionImage
  }
 
}

module.exports={
  mathsolver
}
