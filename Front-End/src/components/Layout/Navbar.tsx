import React from 'react'
import Link from 'next/link'

const Navbar: React.FC = () => {
  return (
    <div className='w-[80%] fixed top-0 flex justify-between
    items-center h-12 left-[10%] max-[640px]:w-[90%] max-[650px]:left-[5%]'>
      <Link className='text-sm font-semibold text-[#E93A90]'
      href='/'>
        Chatbot de Tránsito
      </Link>
    </div>
  )
}

export default Navbar