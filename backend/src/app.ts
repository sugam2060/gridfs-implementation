import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import multer from 'multer'
import { ObjectId } from 'mongodb'
import { GridFSServices } from './GridFSDB/GridFsServices'


const app = express()

app.use(express.json())

app.use(cors())


const connect = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/Object')
        console.log("connected to object store")
    } catch (e) {
        throw e
    }
}
connect()


const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024 //20MB
    }
})


app.post('/upload', upload.array('image', 6), async (req, res) => {
    try {
        const image = req.files as Express.Multer.File[]
    const gridService = new GridFSServices('mongodb://localhost:27017/', 'File');
    
    await gridService.connect();

    if (!image) {
        res.json({ message: 'no image found' })
    } else {
        const fileIDs = await gridService.uploadFile(image as Express.Multer.File[])
        res.json(fileIDs)
    }
    } catch (error) {
        throw error
    }
})




// for single file fetching

// app.get('/download',async(req,res)=>{
//     const {fileid} = req.query
//     const gridfsService = new GridFSServices('mongodb://localhost:27017/','File')

//     try {
//         const {fileStream,jsonData} = await gridfsService.FetchData(fileid as string)

//         res.setHeader('Content-Type','image/jpeg')


//         fileStream.on('end',()=>{
//             res.write('\n')
//             res.write(JSON.stringify(jsonData))
//             res.end();
//         })

//         fileStream.pipe(res,{end:false})
//     } catch (error) {
//         throw new Error('some thing went wrong')
//     }
// })



app.get('/images', async (req, res) => {
    const fileIds = req.query.fileIds as string[];
    const fileIdsObject = fileIds.map((fileid) => new ObjectId(fileid))
    const gridFSService = new GridFSServices('mongodb://localhost:27017/', 'File')

    await gridFSService.connect();

    try {
        const imageBuffers = await gridFSService.fetchData(fileIdsObject);

        // Convert buffers to base64 and return them
        
            const base64Images = imageBuffers.map(buffer => buffer.toString('base64'));
            res.status(200).json(base64Images)
        


    } catch (error) {
        res.status(400).send('Failed to fetch images');
    }
});

app.listen(3000, () => {
    console.log('server up')
})