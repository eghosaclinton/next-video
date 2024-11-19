"use client"
import MuxPlayer from '@mux/mux-player-react';
import Image from 'next/image';
import loaderImg from "@/app/loading-svgrepo-com (1).svg"
import { FormEvent, useState } from 'react';


function Loader(){
  return (
    <div className='loader'>
      <Image src={loaderImg} alt='loader' />
    </div>
  )
}


export default function Page() {
  const [ formData, setFormData] = useState("")
  const [ showLoader, setShowLoader] = useState(false)
  const [ videoPlayId, setVideoPlayId  ] = useState("")

  function changeHandler(inputElement: HTMLInputElement){
    const { value } = inputElement
    setFormData(value)
  }


  async function submitHandler(form: FormEvent){
    form.preventDefault()
    setShowLoader(true)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formData })
      })
  
      const result = await response.json()

      if (response.ok) {
        setTimeout(()=>{
          setShowLoader(false)
          setVideoPlayId(result)
        }, 10000)
      } else {
        console.error(`Failed to Upload`)
      }

      
    } catch (error) {
      console.error(error)
      setShowLoader(false)
    }
  }

  return (
    <main>
      <h1>Stream your google drive videos, on web</h1>
      <form onSubmit={(e)=>submitHandler(e)}>
        <input type="text" value={formData} onChange={(e)=>changeHandler(e.target)} placeholder='enter link to video on google drive' />
        <button>Get Video</button>
      </form>
      {showLoader && <Loader />}
      {(videoPlayId !== "") &&  
        <div className="video">
          <MuxPlayer
            streamType="on-demand"
            playbackId={videoPlayId}
            metadataVideoTitle="Placeholder (optional)"
            metadataViewerUserId="Placeholder (optional)"
            primaryColor="#FFFFFF"
            secondaryColor="#000000"
          />
        </div>
      }
    </main>
  )
}