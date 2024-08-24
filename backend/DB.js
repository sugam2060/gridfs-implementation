const mongoose = require('mongoose');

const connect = async()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/DB')
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