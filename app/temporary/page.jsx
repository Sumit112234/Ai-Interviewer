"use client"

import RealisticAIAvatar from "@/components/RealisticAiAvatar"
import { useEffect, useState } from "react"

export default function temporary(){

    const [loading , setLoading] = useState(false)
    const [speak , setSpeak] = useState(false)
    const [text , setText] = useState('')


    useEffect(()=>{
        setTimeout(()=>{
            setSpeak(true)
            setLoading(true)
            setText("hello how are you , what are you doing and what is your name")

            setTimeout(()=>{
                setLoading(false)
                setSpeak(false)
                setText("")
            },3000)
        },3000)
    },[])


    return (
         <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg overflow-hidden">
                          <RealisticAIAvatar
                            
                            isSpeaking={speak}
                            isLoading={loading}
                           
                            
                            currentText={text}
                          />
             </div>
    )
}