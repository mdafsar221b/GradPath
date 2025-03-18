import React from 'react'
import { RESOURCES } from './Footer/Menu'
import { div } from 'framer-motion/client'

const ImportantLinks = () => {
  return (
    
    <div className='flex items-center justify-center flex-wrap gap-4 mt-5'>
      {RESOURCES.map((RESOURCE, index) => (
        <div key={index}>
          <a 
            href={RESOURCE.link}
            {...(index === 4 ? { download: true } : {})} 
            target='_blank' 
            rel='noopener noreferrer'
            className='inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200'
          >
            {RESOURCE.name}
          </a>
        </div>
      ))}
    </div>
  )
}

export default ImportantLinks
