const puppeteer = require("puppeteer");
const asciimath2latex= require('asciimath-to-latex').default;
const {Change}=require('./changes')

async function generateLatexImage(solution) {
  let html = `
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
        
        <script type="text/x-mathjax-config">
          MathJax.Hub.Config({
            extensions: ["tex2jax.js"],
            jax: ["input/TeX", "output/HTML-CSS"],
            tex2jax: {
              inlineMath: [ ['$','$'], ["\\(","\\)"] ],
              displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
              processEscapes: false
            },
           
            CommonHTML: { linebreaks: { automatic: true } },
            "HTML-CSS": { linebreaks: { automatic: true } },
            SVG: { linebreaks: { automatic: true } }
          });
          MathJax.Hub.Queue(["Rerender",MathJax.Hub])
        </script>
        <script type="text/javascript"
           src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js">
        </script>
        <body>
        
       
        <h1>Solution</h1>
        <div id='solution'>
          ${solution}
        </div>
        
        </body>
    </html>
    `;

  const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  const page = await browser.newPage();
  await page.goto(`data:text/html,${html}`);
  const content = await page.$("body");
  await page.waitForTimeout(5000);

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
  generateLatexImage
}
