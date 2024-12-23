import axios from "axios";
import { ChangeEvent, FormEvent, useState,useEffect } from "react";


const App: React.FC = () => {
  

  return (
    <div className="p-6 max-w-4xl mx-auto">
        <PostData/>
        <ImageGallery/>
    </div>
  );
};



const PostData = () => {
  const [imageFile,setImage] = useState<FileList| null>(null)

  


  const onSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData();

    Array.from(imageFile as FileList).forEach((file,index)=>{
      formData.append(`image`,file)
    })
   
    
    const res = await axios.post('http://localhost:3000/upload',formData);
    console.log(res.data)
  }

  const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
    setImage(e.target.files)
  }

  
  
  
  return(
    <div>
        <form  onSubmit={onSubmit}>
            <input type='file' multiple accept="image?*" onChange={handleChange}/>
            <button type="submit">save</button>
        </form>
    </div>
  )
}



const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<string[]>([]); // Store URLs for blob objects

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get<string[]>('http://localhost:3000/images',{
          params:{
            fileIds:[
              "6769887308e452598ca4ae20",
              "6769887308e452598ca4ae21",
              "6769887308e452598ca4ae22",
              "6769887308e452598ca4ae23",
              "6769887308e452598ca4ae24",
              "67698b3e5d6b92b06dd5643e",
              "67698b3e5d6b92b06dd5643f",
              "67698b3e5d6b92b06dd56440",
              "67698b3e5d6b92b06dd56441",
              "67698b3e5d6b92b06dd56442"
          ]
          }
        }); // Adjust to your backend URL

        const base64Images = response.data;

        // Convert base64 data to Blob URLs
        const blobUrls = base64Images.map(base64 => {
          const byteCharacters = atob(base64);
          const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          return URL.createObjectURL(blob);
        });

        setImages(blobUrls);
        console.log(blobUrls)
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {images.length > 0 ? (
        images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
          />
        ))
      ) : (
        <p>Loading images...</p>
      )}
    </div>
  );
};

export default App;