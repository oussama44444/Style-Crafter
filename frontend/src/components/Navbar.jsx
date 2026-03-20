import { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/Shopcontext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

  useEffect(() => {
    if (!visible) return;
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target)
      ) {
        setVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible]);

  const SignOut = () => {
    navigate('/SignIn')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }
  return (
    <div className="relative">
      {/* Navbar */}
      <div className="w-full flex items-center justify-between py-4 h-20 backdrop-blur-md shadow-lg font-semibold fixed pr-6 top-0 left-0 right-0 z-[60]">
      <Link to="/" className="flex items-center h-20 w-32">
        <p className="relative text-5xl font-[cursive] italic text-gray-100 whitespace-nowrap shimmer pl-6 " style={{fontFamily: 'Dancing Script, cursive'}}>
          Style Crafter
        </p>
      </Link>
      <div className="flex items-center  gap-7">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search}
          className="w-7  cursor-pointer hover:scale-125 transition-all duration-200"
          alt="Search"
        />
        <div className="group relative">
          <img onClick={() => token ? null : navigate('/SignIn')}
            className="w-7   hover:scale-125 cursor-pointer transition-all duration-200"
            src={assets.profile}
            alt="Profile"
          />
          {token &&
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-2">
              <div className="flex flex-col gap-3 w-40 py-3 px-5 bg-slate-100 text-gray-400 rounded shadow-lg">
                <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-black">Orders</p>
                <p onClick={SignOut} className="cursor-pointer hover:text-black">Sign Out</p>
              </div>
            </div>}
        </div> 
        <div className="hover:scale-125">
        <Link to="/cart" className="relative">
          <img
            src={assets.cart}
            className="w-7 hover:scale-125 min-w-5 cursor-pointer  transition-all duration-200"
            alt="Cart"
          />
          <p className="absolute right-[-5px] bottom-[-5px] w-5 text-center  leading-4 bg-black text-white aspect-square rounded-full text-[10px]">
            {getCartCount()}
          </p>
        </Link>
        </div>
        <div  onClick={() => setVisible(true)} className="flex flex-row hover:scale-110" ref={burgerRef}>
        <img
          src={assets.menu}
          className="w-8 cursor-pointer hover:scale-110 transition-all duration-200"
          alt="Menu"
        />
        <p className="pt-1 cursor-pointer pr-10">Menu</p>
      </div>
     </div>
    </div>
  
      {visible && (
        <div
          className="fixed inset-0 z-[90] bg-black/10 backdrop-blur-sm transition-all duration-300"
          onClick={() => setVisible(false)}
        />
      )}
    
      <div
        ref={menuRef}
        className={`fixed top-0 right-0  z-[100] bg-white shadow-lg transition-all duration-300 ${visible ? 'w-1/2' : 'w-0'} overflow-x-hidden`}
        style={{overflowY: visible ? 'visible' : 'hidden'}}
      >
        <div className="flex flex-col text-gray-600 ">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer hover:text-black hover:font-bold border-b"
          >
            <img src={assets.dropdown} alt="Back" />
            <p>Back</p>
          </div>
          {visible && (
            <>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-3 px-6 border-b text-lg hover:bg-gray-100"
                to="/"
              >
                Home
              </NavLink>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-3 px-6 border-b text-lg hover:bg-gray-100"
                to="/collection"
              >
                Collection
              </NavLink>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-3 px-6 border-b text-lg hover:bg-gray-100"
                to="/about"
              >
                About
              </NavLink>
              <NavLink
                onClick={() => setVisible(false)}
                className="py-3 px-6 border-b text-lg hover:bg-gray-100"
                to="/contact"
              >
                Contact
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
