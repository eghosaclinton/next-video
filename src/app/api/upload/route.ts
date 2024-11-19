// see: https://github.com/vercel/next.js/tree/canary/examples/with-mux-video
import Mux from '@mux/mux-node'
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    try {
      const body = await req.json()

      const { formData } = body

      if (!formData) {
          return NextResponse.json({ message: 'No URL provided', })
      }

      const mux = new Mux({
          tokenId: process.env.NEXT_PUBLIC_MUX_TOKEN_ID,
          tokenSecret: process.env.NEXT_PUBLIC_MUX_TOKEN_SECRET
      })

      const asset = await mux.video.assets.create({
          input: formData,
          playback_policy: ['public'],
      })

      const { playback_ids } = asset

      if (!playback_ids){
        return NextResponse.json("invalid credentials")
      }

      const { id } = playback_ids[0]
      
      return NextResponse.json(id)

    } catch (e) {
      console.error('Request error', e)
      return NextResponse.json({ error: 'Error creating upload' })
    }
}