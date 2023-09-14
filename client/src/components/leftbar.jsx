import React from 'react'

function Leftbar() {
  return (
    <div>
      <p className="mt-6 mb-3"><span className="font-semibold">John</span> and <span className="font-semibold">John</span> is celebrating birthday today </p>
        <img src={process.env.PUBLIC_URL + '/images/birthday.png'} className='w-11/12 rounded-lg h-56 mb-6'/>
        <hr/>
        <div className="mt-7">
            <p data-testid='test' className='text-xl font-semibold mb-5'>Close Friends</p>
            <div className='flex items-center mb-5'>
            <img src={process.env.PUBLIC_URL + '/images/photo1.jpeg'} className='rounded-full w-10 h-10 mx-2'/>
            <p>James John</p>
            </div>
            <hr className='mb-4'/>
            <div className='flex items-center mb-5'>
            <img src={process.env.PUBLIC_URL + '/images/photo1.jpeg'} className='rounded-full w-10 h-10 mx-2'/>
            <p>James John</p>
            </div>
            <hr className='mb-4'/>
            <div className='flex items-center mb-5'>
            <img src={process.env.PUBLIC_URL + '/images/photo1.jpeg'} className='rounded-full w-10 h-10 mx-2'/>
            <p>James John</p>
            </div>
            <hr className='mb-4'/>
        </div>
    </div>
  )
}

export default Leftbar