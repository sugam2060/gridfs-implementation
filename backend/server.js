const express = require('express');
const {connect,MovieModel,createMovie} = require('./DB')
const {GridFsStorage} = require('multer-gridfs-storage');
const mongoose = require('mongoose')
const multer = require('multer');
const Grid = require('gridfs-stream');
const {GridFSBucket} = require('mongodb')
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');
const { read } = require('fs');
const app = express();

//middlewares
app.use(express.json({limit:'16mb'}));
app.use(cors());

connect();

const url = 'mongodb://localhost:27017/DB'


const conns = mongoose.connection;

//initializing gfs

let gfs
let gridfsbucket

conns.once('open',()=>{
    gfs = Grid(conns.db,mongoose.mongo);
    gfs.collection('moviesCollection')


    //init gridFsBucket
    gridfsbucket = new GridFSBucket(conns.db,{
        bucketName:'moviesCollection'
    })
})


//initialize storage engine

const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/DB',
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'moviesCollection',
          };
          resolve(fileInfo);
        });
      });
    },
  });

const upload = multer({storage});


app.post('/postData',upload.single('file'),async(req,res)=>{
    const {movieName,description} = req.body;
    const videoName = req.file.filename;
    
    try{
        const file = await gfs.files.findOne({filename:videoName});
        if(!file){
            res.status(404).send('no file found')
        }
        createMovie(movieName,description,file._id);
    }catch(err){
        console.log(err);
    }

    res.send('done')
})


//lets check if it works or not
//let me build the front end too

//to retrive data we need to establish readStream so to do so

app.get('/getmovie/:moviename',async(req,res)=>{
    try{
        
        const movie = await MovieModel.findOne({movieName:req.params.moviename})
        console.log(movie)
        if(!movie || movie.length === 0){
            return res.status(404).send('no movie found')
        }
        const readStream = gridfsbucket.openDownloadStream(movie.video_ID)
        readStream.pipe(res);

    }catch(err){
        console.log(err);
    }
})

app.listen(5000)