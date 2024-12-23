import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "stream";





export class GridFSServices {
    private client: MongoClient | null = null;
    private dbName: string | null = null;
    private bucketName: string | null = null;
    private bucket: GridFSBucket | null = null;


    constructor(uri: string, dbName: string, bucketName = 'fs') {
        this.client = new MongoClient(uri)
        this.dbName = dbName,
            this.bucketName = bucketName
        this.bucket = null
    }

    //connect to mongoDB and Initialize the bucket
    async connect(): Promise<void> {
        try {
            await this.client?.connect();
            console.log('connected to fileDB')

            const db = this.client?.db(this.dbName as string)
            if (db) {
                this.bucket = new GridFSBucket(db, {
                    bucketName: this.bucketName as string
                })
            }

            console.log(`GridFSBucket ${this.bucketName} is initialized`)
        } catch (err) {
            console.log(err)
            throw err
        }
    }


    async uploadFile(files: Express.Multer.File[]): Promise<string[]> {

        // to store single file

        // const filename = files.originalname
        // const fileBuffer = files.buffer

        // return new Promise<ObjectId>(async (resolve,reject)=>{
        //     if(!this.bucket){
        //         await this.connect()
        //         if(!this.bucket){
        //             throw new Error("Bucket failed to initialized")
        //         }
        //     }

        //     const readStream = Readable.from(fileBuffer)
        //     const uploadStream = this.bucket.openUploadStream(filename)


        //     const fileid = uploadStream.id

        //      readStream.pipe(uploadStream)

        //     uploadStream.on('finish',async ()=>{
        //        if(fileid){
        //         await this.disconnect()
        //         resolve(fileid)
        //        }else{
        //         reject(new Error('failed to get file id'))
        //        }
        //     })
        //     uploadStream.on('error',(err)=>{
        //         reject(err)
        //     })
        // })


        // to store multiple file

        const fileIds: string[] = []
        try {
            for (const file of files) {
                const uploadStream = this.bucket?.openUploadStream(file.originalname, {
                    contentType: file.mimetype
                })
                if (uploadStream) {
                    uploadStream?.write(file.buffer)
                    uploadStream.end()

                    fileIds.push(uploadStream.id.toString())
                }
            }
            return fileIds
        } catch (err) {
            throw err
        }
    }

    async fetchData(fileIds: ObjectId[]): Promise<Buffer[]> {
        try {
            const imagePromise = fileIds.map((fileid:ObjectId)=>{
                return new Promise<Buffer>((resolve,reject)=>{
                    const chunks: any[] = []
                const downloadStream = this.bucket?.openDownloadStream(fileid)
    
                downloadStream?.on('data',(chunk)=>{
                    chunks.push(chunk)
                })
                downloadStream?.on('end',()=>{
                    resolve(Buffer.concat(chunks))
                })
                downloadStream?.on('error',(err)=>{
                    reject(err)
                })
                })
            })
    
            return Promise.all(imagePromise)
        } catch (error) {
            throw error
        }
    }


    public async disconnect(): Promise<void> {
        try {
            await this.client?.close()
            console.log('disconnected from image DB')
        } catch (err) {
            throw err
        }
    }

}