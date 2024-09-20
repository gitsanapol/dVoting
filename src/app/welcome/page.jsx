"use client"
import React from 'react'
import Navbar from '../components/Navbar'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'


export default function welcomePage() {

    const { data: session } = useSession();
    console.log(session);

    if(!session) redirect("/login") ;

  return (
    <div>
        <Navbar session={session} />
        <div className='container mx-auto'>
            <h3 className='text-3xl my-3'>Welcome User</h3>
            <hr className='my-3'/>
            <p>User:{session?.user?.name}</p>
            <p>Email:{session?.user?.email}</p>
        </div>
    </div>
  )
}

