import { useCallback, useDebugValue, useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)
  const [moviename,setname] = useState(null);
  const [description,setdesc] = useState(null)
  const [videoURL,setURL] = useState(null);
  const [searchedMovie,setSearched] = useState(null)

  const Debounce = useCallback((callback,delay)=>{
    let timeout;

    return (...args)=>{
      clearTimeout(timeout);
      timeout = setTimeout(() => {
          callback(...args);
      }, delay);
    }
  })

  const updateDebounce = Debounce((val)=>{
    setSearched(val)
  },1000)

  const handleChange = (e)=>{
    const val = e.target.value;
    updateDebounce(val);
  }



  

  




  const handleSubmit = async(e)=>{
    e.preventDefault();

    const formData = new FormData;
    formData.append('movieName',moviename);
    formData.append('description',description);
    formData.append('file',count);

    try{
      await axios.post('http://localhost:5000/postData',formData,{
        headers:{
          "Content-Type":'multipart/form-data'
        }
      })
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    const getvideo = async()=>{
      const res = await axios.get(`http://localhost:5000/getmovie/${searchedMovie}`,{responseType:'blob'})
      const videoBlob = new Blob([res.data],{type:'video/mp4'});
      const videourl = URL.createObjectURL(videoBlob);
      setURL(videourl)
    }
    getvideo();
  },[searchedMovie])

  return (
    <>
      <form onSubmit={handleSubmit}>
          <input type="text" placeholder='movie name' required onChange={(e)=>{setname(e.target.value)}}/>
          <input type="text" placeholder='description' required onChange={(e)=>{setdesc(e.target.value)}}/>
          <input type="file" required onChange={(e)=>{setCount(e.target.files[0])}}/>
          <button type='submit'>save</button>
      </form>
      <video src={videoURL} controlsList='nodownload' controls></video>
      <input type="text" onChange={handleChange} />
    </>
  )
}


export default App
