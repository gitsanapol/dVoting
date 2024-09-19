import React from 'react'
import Link from 'next/link'

function navbar() {
  return (
    <nav className='bg-slate-900 text-white p-5'>
        <div className="container mx-auto">
            <div className='flex justify-between items-center'>
                <div>
                    <Link href="/">Home</Link> 
                </div>
            
                <ul className='flex'>
                    <li className='mx-3'><Link href="./login">Sign In</Link></li>
                    <li className='mx-3'><Link href="./register">Register</Link></li>
                </ul>
            </div>

        </div>
    </nav>
  )
}

export default navbar