"use client"
import React from 'react'
import Navbar from '../components/Navbar'

export default function welcomePage() {
  return (
    <div>
        <Navbar />
        <div className='container mx-auto'>
            <h3 className='text-3xl my-3'>Welcome User</h3>
            <hr className='my-3'/>
            <p>Paragraph</p>
        </div>
    </div>
  )
}

