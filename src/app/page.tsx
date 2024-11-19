"use client"
import MuxPlayer from '@mux/mux-player-react';
import Image from 'next/image';
import loaderImg from "@/app/loading-svgrepo-com (1).svg"
import { FormEvent, useState } from 'react';
import Mux from '@mux/mux-node';


function Loader(){
  return (
    <div className='loader'>
      <Image src={loaderImg} alt='loader' />
    </div>
  )
}


export default function Page() {
  const [formData, setFormData] = useState("")
  const [showLoader, setShowLoader] = useState(false)
  const [videoPlayId] = useState("")

  function changeHandler(inputElement: HTMLInputElement){
    const { value } = inputElement
    setFormData(value)
  }
  

  async function submitHandler(form: FormEvent){
    form.preventDefault()
    setShowLoader(true)

    const mux = new Mux({
      tokenId: process.env.NEXT_PUBLIC_MUX_TOKEN_ID,
      tokenSecret: process.env.NEXT_PUBLIC_MUX_TOKEN_SECRET
    });

    try {
      const asset = await mux.video.assets.create({
        input: [{ url: `${formData}` }],
        playback_policy: ['public'],
        video_quality: 'basic',
      });

      console.log(asset)


      setShowLoader(false)
    } catch (error) {
      alert(error)
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
            playbackId=""
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