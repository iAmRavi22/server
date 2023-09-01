const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const url = require('url');

const app = express();
const cors = require('cors')
let Parser = require("rss-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.use(cors());

let parser = new Parser();  
app.get('/*', wrapAsync( async function(req, res, next) {
  // This middleware throws an error, so Express will go straight to
  // the next error handler
  const name = req.query.name; 
  console.log(name)      
  console.log(typeof(name)) 
let feed = await parser.parseURL(name);
   // if(feed){console.log("feed>>>>>>>>>>>>>>>>>>>>",feed)}
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(feed))
}));

app.use(function(err, req, res, next) {
          
  console.log('**************************');
  console.log('* [Error middleware]: err:', err);
  console.log('**************************');
  next(err);
  res.send(JSON.stringify(329))
  
  
});

// Error handler B: Node's uncaughtException handler
process.on('uncaughtException', function (err) {
  console.log('**************************');
  console.log('* [process.on(uncaughtException)]: err:', err);
  console.log('**************************');
  res.status(400).send({
    message: 'This is an error!'
 });
});



// app.get('/test', (req, res) => {
//   res.send("errolr");

// });
// app.get('/api/greeting', (req, res) => {
//   try{
//     (async () => {
//       const name = req.query.name; 
//       console.log(name)      
//       console.log(typeof(name)) 
//    let feed = await parser.parseURL(name);
//         //if(feed){console.log("feed>>>>>>>>>>>>>>>>>>>>",feed)}
//         res.setHeader('Content-Type', 'application/json');
//         if(feed){res.send(JSON.stringify(feed))}
//         //else{console.log(res.statusCode)};
//         process.on('uncaughtException', function(ex) {
//           console.log("error occured>>>>>>>>"+ex)
          
//           res.send(res.statusCode);

//       });
//     })()
//   }catch(error){
    
//     res.send("errolr")
//     console.log(error);
  
  
//   }
    
 
// });

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);

function wrapAsync(fn) {
  return function(req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
}