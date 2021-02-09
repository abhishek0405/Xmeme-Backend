const express = require('express');
const router = express.Router();
const Meme = require('../models/memeModel'); // Meme Model
//memes routes
router.get("/",(req,res,next)=>{
    Meme.find()
        .sort({_id:-1}) //THIS SORTS IN FROM NEWEST TO OLDEST
        .limit(100) // to get only 100 max
        .exec()
        .then(result=>{
            //result is arr of objects
            if(result.length==0){
                return res.status(404).json({
                    message:'NO MEME FOUND'
                })
            }
            //console.log(result);
            const newResult = result.map(item=>{
                return{
                    id:item._id,
                    name:item.name,
                    url:item.url,
                    caption:item.caption
                }
            }) 
                
            res.status(200).json(newResult);
        })
        .catch(err=>{
            console.log(err);
        })


})

router.post("/",(req,res,next)=>{
    //work on duplicate post requests later
    console.log(req.body);
    const meme = new Meme({
        name:req.body.name,
        url:req.body.url,
        caption:req.body.caption
    })
    meme.save()
        .then(result=>{
            console.log('MEME POSTED SUCCESFULLY');
            res.status(201).json({
                id: result._id
            })

        })
        .catch(err=>{
            console.log('POST FAILED');
            console.log(err);
            res.status(500).json({
                message:"FAILED TO POST"
            })
        })
    
})

//get specific meme
router.get("/:id",(req,res,next)=>{
    const id = req.params.id;
    Meme.findById(id)
        .exec()
        .then(foundMeme=>{
            if(foundMeme){
                const returnMeme = {
                    id:foundMeme._id,
                    name:foundMeme.name,
                    url:foundMeme.url,
                    caption:foundMeme.caption
                }
                res.status(200).json(returnMeme);
            } else{
                res.status(404).json({
                    message:"MEME DOES NOT EXIST"
                })
            }

        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                message:"server error while fetching meme"
            })
        })
})

//patch
//TODO REQRITE THIS AS PER NEED
router.patch("/:id",(req,res,next)=>{
    const id = req.params.id;
    const updatedMeme = {};
    //Check if name given to update
    if(req.body.name==undefined){
        if(req.body.caption!=undefined){
            updatedMeme.caption = req.body.caption;
        }
        if(req.body.url!=undefined){
            updatedMeme.url = req.body.url;
        }

       //Update now
        console.log(updatedMeme)
        Meme.updateOne({_id:id},{$set:updatedMeme})
            .exec()
            .then(result=>{
            console.log("Succesful update");
            res.status(200).json({
                message:"UPDATED SUCCESFULLY"
                })
            })
            .catch(err=>{
            console.log(err);
            res.status(500).json({
                message:"Server error failed to update"
            })
        })

    } else{
        console.log("CANNOT UPDATE NAME");
            return res.status(403).json({
                message:"You are not permitted to change the name of the meme post."
            })
    }
    

})
module.exports = router;