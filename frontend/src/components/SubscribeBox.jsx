import  {useContext} from 'react';
import { ShopContext } from "../context/Shopcontext.jsx";


function SubscribeBox() {
    const onSubmitHandler = (event)=>{event.preventDefault()}
  return (
    <div className='text-center'>
        <p className="text-2xl font-medium text-gray-800 ">Subscribe and get 30% off</p>
      <p className="text-gray-400 mt-3">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem inventore quas, commodi quo dolorum corrupti, ipsum incidunt libero laborum adipisci iure vitae nisi odio deleniti eaque, voluptatibus at. Atque, dolorem.</p>
      <form onSubmit={onSubmitHandler} className="w-full sm:w-1/2 flex items-center gap-3 mx-auto m-6 border p1-3">
        <input className='w-full sm:flex-1 outline-none pl-4' type="email"  placeholder="Enter your email" required/>
        <button type='submit' className="bg-black text-white text-xs px-5 py-4">Subscribe</button>
      </form>
    </div>
  )
}

export default SubscribeBox
