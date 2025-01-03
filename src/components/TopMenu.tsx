
import Link from 'next/link'
import React from 'react'

export const TopMenu = () => {
  return (
    <nav className='flex justify-center fixed top-0 left-0 right-0 bg-ivory'>
      <div className="max-w-4xl flex w-full justify-between items-center py-2">
        <div>
          <Link className='text-2xl font-bold text-terracotta' href={'/'}>LandingLab</Link>
        </div>
        <div className='flex items-center gap-2'>
         {/* <Link className='hover:text-terracotta transition duration-200 ease-in-out' href={'/login'}>Ingresar</Link>
          <Link className='px-6 py-2.5 flex items-center gap-2 text-white bg-terracotta hover:bg-terracotta-600 rounded-md transition duration-200 ease-in-out' href={'/login'}>Empieza Gratis</Link> */}
        </div>
      </div>
    </nav>
  )
}
