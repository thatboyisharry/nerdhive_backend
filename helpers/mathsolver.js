const mathsteps = require('mathsteps');

module.exports=function(mathproblem){
  
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

    if(char==='*'||char==='/'){
      return true;
    }

    if(char==='('||char===')'){
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
  if(parsedProblem.isExpression){
    const {problem}=parsedProblem
    
    const steps=mathsteps.simpilifyExpression(problem);
    
  }
  
  if(parsedProblem.isEquation){
    const {problem}=parsedProblem
    
    const steps=mathsteps.solveEquation(problem);
    steps.forEach(step => {
      console.log("before change: " + step.oldEquation.ascii());  // e.g. before change: 2x + 3x = 35
      console.log("change: " + step.changeType);                  // e.g. change: SIMPLIFY_LEFT_SIDE
      console.log("after change: " + step.newEquation.ascii());   // e.g. after change: 5x = 35
      console.log("# of substeps: " + step.substeps.length);      // e.g. # of substeps: 2

      console.log("\n")
    });
  }
 
}