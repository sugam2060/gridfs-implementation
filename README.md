## description
    - npm install mongodb@5.9.1 (to fix cannot read f._id error we have to degrade mongodb version to work with multer gridfs storage so use this command)
    -today we are implementing Grid file system in mongoDB database. Grid fs is basically used to store large files such as video, images, large games etc. Normal mongoDB document only allows max 16mb of files to get uploaded. So to upload large files we use GridFS.

- GridFS allows use to retrieve files in a chunks . so memory will never get overwhelmed by the retrieval of large files as data is retrieve in a chunks. each chunks size is just 255 KB. 

-I have created a server which store movies with its name and description. I used multer-gridfs-storage,gridfs-stream,multer packages to store and retrieve files from the database
- to retrieve data I have also introduced searching functionality with debouncing. 

-As it is just a test there is no proper error handling in the system to prevent crashing. Only video storing and retrieval functionality is implemented.


- for frontend I have used react for easy implementation

- to run the app pull the repo to your local machine go to program directory(for both backend and frontend) run 'npm i' command in your terminal

- after that at frontend directory run 'npm run dev'

-again at backend directory run 'npm run dev'

-that's all . thanks you
