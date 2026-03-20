import React from 'react'
import { assets } from '../assets/assets'

function Footer() {
  return (
    <div className=''>
    <div className='flex flex-row items-center justify-between gap-14 my-10 mt-40 text-sm'>

      <div className='flex items-center gap-5'>
        <img src={assets.logo} className='w-16' alt="logo" />
        <p className='text-gray-600 text-justify'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia distinctio! Facilis qui consequuntur rerum repudiandae eius porro voluptatem modi optio dignissimos perferendis illo nisi maxime impedit magni, necessitatibus, asperiores libero.
        </p>
      </div>
   
      <div>
        <p className='text-xl font-medium mb-2'>COMPANY</p>
        <ul className='flex flex-col gap-1 text-gray-600'>
          <li>Home</li>
          <li>About us</li>
          <li>Delivery</li>
          <li>Privacy policy</li>
        </ul>
      </div>
      <div>
        <p className='text-xl font-medium mb-5'>Contact Us </p>
        <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+216-21-456-789</li>
            <li>contact@stylecrafter.com</li>
            <li>Our facebook page : "style crafter"</li>
        </ul>
      </div>
    </div>
    <div >
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2024@ stylecrafter.com</p>
    </div>
  </div>
  
  
  )
}

export default Footer
