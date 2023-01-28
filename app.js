/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

"use strict";

/// Imports dependencies and set up http server
const request = require("request"),
express = require("express"),

body_parser = require("body-parser"),
axios = require("axios").default,
app = express().use(body_parser.json()); // creates express http server
const path = require('path');
const fs = require('fs')
const session = require('express-session');
const passport =require('passport');
const cors=require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const User = require('./models/user.model');


const multer = require('multer')


const multerMid = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    })
    
app.disable('x-powered-by')
app.use(multerMid.single('file'))






//Basic configuration
const oneDay=1000*60*60*24;

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended:false}));
// app.use(express.json());

// app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'/public')));
app.use(session({
  secret:"cats",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:oneDay }
}));
app.use(cookieParser());
app.use(passport.initialize()); //authentication related
app.use(passport.session());// authentication related





// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

routes(app,User);

