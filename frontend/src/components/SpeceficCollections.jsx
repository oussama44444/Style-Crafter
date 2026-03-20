import React from "react";
import { Link } from "react-router-dom";
import bracelet from "../assets/bracelet.png";
import jewelry from "../assets/jewelry.png";
import sunglasses from "../assets/sunglasses.png";
import Title from "./Title";
 
const speceficCollections=() => {
  
 
  return (

    
           
    <div className="w-full flex pr-20 pl-20 flex-col sm:flex-row gap-8 my-16 px-4" style={{ minHeight: "20vh" }}>
        
         <div
           className="flex-1 min-h-[250px] sm:min-h-[50vh] scale-100 hover:scale-95  shadow-lg cursor-pointer relative overflow-hidden group flex border-4 "
           style={{
             backgroundImage: `url(${bracelet})`,
             backgroundSize: "cover",
             backgroundPosition: "center",
             backgroundColor: "#e0f7fa",
           }}
         >
           <Link
             to="/collection?category=Men&subCategory=Bracelets"
             className="absolute inset-0 flex items-center justify-center w-full h-full"
           >
             <div className="absolute inset-0  bg-opacity-40 transition-all duration-300" />
             <div className=" relative z-10 text-white text-4xl sm:text-5xl font-bold">
               The Men's Stack
             </div>
           </Link>
         </div>
          <div
           className="flex-1 min-h-[250px] sm:min-h-[50vh] scale-100 hover:scale-95 shadow-lg cursor-pointer relative overflow-hidden group flex border-4 "
           style={{
             backgroundImage: `url(${sunglasses})`,
             backgroundSize: "cover",
             backgroundPosition: "center",
             backgroundColor: "#fce4ec",
           }}
         >
           <Link
             to="/collection?subCategory=Sun%20Glasses"
             className="absolute inset-0 flex items-center justify-center w-full h-full"
           >
             <div className="absolute inset-0  bg-opacity-40 transition-all duration-300" />
             <div className="relative z-10 text-white text-4xl sm:text-5xl font-bold ">
                 The Optic Line
             </div>
           </Link>
         </div>
         <div
           className="flex-1 min-h-[250px] sm:min-h-[50vh] scale-100 hover:scale-95  shadow-lg cursor-pointer relative overflow-hidden group flex border-4 "
           style={{
             backgroundImage: `url(${jewelry})`,
             backgroundSize: "cover",
             backgroundPosition: "center",
             backgroundColor: "#e0f7fa",
           }}
         >
           <Link
             to="/collection?category=Women&subCategory=Accessories"
             className="absolute inset-0 flex items-center justify-center w-full h-full"
           >
             <div className="absolute inset-0  bg-opacity-40 transition-all duration-300" />
             <div className="relative z-10 text-white text-4xl sm:text-5xl font-bold">
                 The Sparkle Edit
             </div>
           </Link>
         </div>
        
       </div>
        
  )

}

export default speceficCollections;