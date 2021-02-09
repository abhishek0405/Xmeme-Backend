const mongoose = require('mongoose');
const memeSchema = mongoose.Schema({
    name:{type:String,requried:true},
    url:{type:String,required:true},
    caption:{type:String, required:true}

})

module.exports = mongoose.model('Meme',memeSchema); 