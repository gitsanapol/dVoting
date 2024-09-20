"use client"

import React from 'react'
import Navbar from '../components/Navbar'


function register() {
  return (
    <div>
      <Navbar />
      <div className='container mx-auto py-5'>
        <h3>login form</h3>
        <hr className='my-3' />
        <form action="">
          <input className='block bg-gray-300 p-2 my-2 rounded-md' type="email" placeholder='Enter your email;' />
          <input className='block bg-gray-300 p-2 my-2 rounded-md' type="password" placeholder='Enter your password' />
          <button type='submit' className='bg-green-500 p-2 rounded-md text-white'>Sign in</button>
        </form>
      </div>
    </div>
  )
}

export default register