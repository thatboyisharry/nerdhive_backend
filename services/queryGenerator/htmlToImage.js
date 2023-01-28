const puppeteer = require("puppeteer");

async function htmlToImage(query) {
  let html
  if(query.lead){
    let lead= query.lead
    let questionnaireTranscript =query.user.session.data.report.questionnaire_transcript.replace(/\n/g,"<br/>");
    html = `
    <html>
        <head>
        <style>
            body {
                height: max-content;
                font-size: 35px;
                width: 900px;
                border: 2px solid white;
                padding: 10px;
                color: black;
            }

            h1 {
                margin: 0;
                padding: 0;
            }
        </style>
        
        </head>
        
        <body>
        
       
        <h1>Query Information</h1>
        <div id='lead-info'>
          <h5>Name: ${lead.name}</h5>
          <h5>Type: ${lead.isParent?"Parent":"Learner"}</h5>
          <h5>Learner's name: ${lead.learnerName}</h5>
          <h5>Gender: ${lead.isBoy?"Male":"Female"}</h5>
          <h5>Budget: ${lead.budget}<h5/>
        </div>
        <div id='summary'>
          <h3>Summary</h3>
          <h5>Coaching Score: ${query.user.session.data.report.coaching_score}</h5>
          <h5>Struggle with more than TWO subject: ${query.user.session.data.report.more_than_two_subjects?"Yes":"No"}</h5>
        </div>
        <div id='questionnaire-transcript'>
          <h3>Questionnaire</h3>
          <p>${questionnaireTranscript}</p>
        </div>
        
        </body>
    </html>
    `;
  }
  

  const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  const page = await browser.newPage();
  await page.goto(`data:text/html,${html}`);
  const content = await page.$("body");
  await page.waitForTimeout(1000);

  if (content != null) {
    let imageBuffer = await content.screenshot({
      omitBackground: true,
    });
    
//   if (content != null) {
//    await content.screenshot({
//       path:'solution.jpeg',
//       omitBackground: true,
//     });

    await page.close();
    await browser.close();
    return imageBuffer
  }

  
}

module.exports={
  htmlToImage
}
