import React from 'react'
import Form from '../components/form'

function AdminLoginpage() {
  return (
    <div className="lg:mx-32 md:mx-12">
        <div className="md:flex">
            <div className="md:w-2/3 my-44 hidden md:block">
                 <h1 className="text-8xl font-bold text-blue-500">Zeak Media</h1>
                 <p className="text-slate-500 mt-3">Connect with people everywhere in the world, bringing everyone together no matter where they are</p>
            </div>
            <div className="md:w-1/2 my-56 mx-16">
               <Form page={false} admin={true}/>
            </div>
        </div>
    </div>
  )
}

export default AdminLoginpage