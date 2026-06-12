import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import SignIn from './pages/SignIn'
import Placeorder from './pages/PlaceOrder.jsx'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchResults from './pages/SearchResults';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
const App = () => {
  return (
    <div className='w-full min-h-screen bg-white'>
        <ToastContainer/>
        <Navbar/>
        <SearchBar/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact />}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/SignIn' element={<SignIn/>}/>
        <Route path='/place-order' element={<Placeorder/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/search' element={<SearchResults/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
