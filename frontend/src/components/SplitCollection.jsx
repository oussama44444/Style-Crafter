import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import menBg from "../assets/d46a0236408e8154739ba0880381097e.jpg";
import womenBg from "../assets/bcefw-1.jpg";
import Title from "./Title";

const SplitCollections = () => {
  const menRef = useRef(null);
  const womenRef = useRef(null);
  const menInView = useInView(menRef, { amount: 0.1, once: true });
  const womenInView = useInView(womenRef, { amount: 0.1, once: true });

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 my-12 sm:my-16">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <Title text1="Latest" text2="Editions" />
        <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-2"></div>
        <p className="w-full sm:w-3/4 md:w-1/2 mx-auto text-xs sm:text-sm md:text-base text-gray-600 mt-4 px-4">
          Discover our newest arrivals for men and women. From casual essentials 
          to statement pieces, find your perfect look for every occasion.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
        {/* Men's Collection */}
        <motion.div
          ref={menRef}
          initial={{ x: -300, opacity: 0 }}
          animate={menInView ? { x: 0, opacity: 1, transition: { type: "spring", stiffness: 50, damping: 20, duration: 0.6 } } : { x: -300, opacity: 0 }}
          className="flex-1 min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] rounded-2xl shadow-xl cursor-pointer relative overflow-hidden group"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${menBg})` }}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-300" />
          
          {/* Content */}
          <Link
            to="/collection?category=Men"
            className="absolute inset-0 flex flex-col items-center justify-end sm:justify-center pb-12 sm:pb-0"
          >
            <div className="relative z-10 text-center px-4 transform group-hover:scale-105 transition-transform duration-300">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                Men's Collection
              </h2>
              <div className="w-12 h-0.5 bg-white mx-auto mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <p className="text-white/80 text-xs sm:text-sm md:text-base opacity-0 group-hover:opacity-100 transition-all duration-300">
                Shop Latest Arrivals
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Women's Collection */}
        <motion.div
          ref={womenRef}
          initial={{ x: 300, opacity: 0 }}
          animate={womenInView ? { x: 0, opacity: 1, transition: { type: "spring", stiffness: 50, damping: 20, duration: 0.6 } } : { x: 300, opacity: 0 }}
          className="flex-1 min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] rounded-2xl shadow-xl cursor-pointer relative overflow-hidden group"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${womenBg})` }}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-300" />
          
          {/* Content */}
          <Link
            to="/collection?category=Women"
            className="absolute inset-0 flex flex-col items-center justify-end sm:justify-center pb-12 sm:pb-0"
          >
            <div className="relative z-10 text-center px-4 transform group-hover:scale-105 transition-transform duration-300">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                Women's Collection
              </h2>
              <div className="w-12 h-0.5 bg-white mx-auto mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <p className="text-white/80 text-xs sm:text-sm md:text-base opacity-0 group-hover:opacity-100 transition-all duration-300">
                Discover New Styles
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default SplitCollections;