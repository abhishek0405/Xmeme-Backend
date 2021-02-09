const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const uri='mongodb+srv://abhishek:abhishek54321@cluster0.dfvfh.mongodb.net/MemeDB?retryWrites=true&w=majority';
const uri   = process.env.DB_URL || "mongodb://localhost/meme_app";

mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=>console.log('CONNECTED WITH MONGO ATLAS'))
        .catch((err)=>{
            console.log('COULD NOT CONNECT WITH MONGO ATLAS');
            console.log(err);
        });

/*
mongoose.connect("mongodb://localhost/meme_app")
        .then(()=>{
            console.log("Connected to local db succesfully");
        })
        .catch("failed to connnect to local db");
*/

const memeRoutes = require('./routes/meme')

//body parser config
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());//to read json from posterquests

//CORS ALLOW
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');// * means all resources.
    res.header('Access-Control-Allow-Headers','*');
    if(req.method === 'OPTIONS'){//for post requests   
        res.header('Access-Control-Allow-Methods','GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});
// anything with /memes  handled by memeroute
app.use('/memes',memeRoutes); 

app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error); 
})

//whatever error redirected and  handled here
app.use((error,req,res,next)=>{
    res.status(error.status||500).json({
        error:{
            message:error.message
        }
    });
});
module.exports = app;