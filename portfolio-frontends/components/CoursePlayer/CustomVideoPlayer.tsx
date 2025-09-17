'use client'

import React, { useRef, useEffect, useState } from 'react'

interface Props {
  src: string
  onComplete?: () => void
}

const CustomVideoPlayer: React.FC<Props> = ({ src, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const percent = (video.currentTime / video.duration) * 100
      setProgress(percent)
    }

    const handleEnded = () => {
      if (onComplete) onComplete()
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [onComplete])

  return (
    <div className='bg-black rounded-xl overflow-hidden'>
      <video
        ref={videoRef}
        src={src}
        controls
        controlsList='nodownload'
        disablePictureInPicture
        className='w-full aspect-video'
      />

      <div className='h-1 bg-gray-200'>
        <div className='h-full bg-blue-600' style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default CustomVideoPlayer
