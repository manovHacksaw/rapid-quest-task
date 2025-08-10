'use client'

import { useEffect, useState } from 'react'

export function WhatsAppLoading() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-[#111B21] flex flex-col items-center justify-center">
      {/* WhatsApp Logo */}
      <div className="mb-8 flex flex-col justify-center items-center">
       <div className="w-[250px] h-[52px] flex items-center justify-center mb-8">
         <img 
           src="/logo-whatsapp.svg" 
           alt="WhatsApp Logo" 
           className="w-full h-full"
           style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(95%)' }}
         />
        </div>
        
        <h1 className="text-[#E9EDEF] text-3xl font-light text-center mb-8">WhatsApp</h1>
        
        {/* Progress Bar */}
        <div className="w-80 h-1 bg-[#3C4043] rounded-full overflow-hidden mb-8">
          <div 
            className="h-full bg-[#25D366] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        {/* End-to-end encrypted */}
        <div className="flex items-center justify-center gap-2 text-[#8696A0] text-sm mb-16">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>End-to-end encrypted</span>
        </div>
      </div>
    </div>
  )
}