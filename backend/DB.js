const mongoose = require('mongoose');
require('dotenv').config();

const connect = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
    }catch(err){
        console.log(err);
    }
}

const MovieSchema = new mongoose.Schema({
    movieName:String,
    Description:String,
    video_ID :{type: mongoose.Schema.Types.ObjectId},
})


const MovieModel = mongoose.model('movies',MovieSchema);


const createMovie = async (movieName,Description,video_ID)=>{
    const movie = new MovieModel({
        movieName:movieName,
        Description:Description,
        video_ID:video_ID,
    })
    await movie.save();
}


module.exports= {
    MovieModel,
    connect,
    createMovie
}