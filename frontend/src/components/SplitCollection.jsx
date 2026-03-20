import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import menBg from "../assets/d46a0236408e8154739ba0880381097e.jpg";
import womenBg from "../assets/bcefw-1.jpg";

import Title from "./Title";
const SplitCollections = () => {
  const menRef = useRef(null);
  const womenRef = useRef(null);
  const menInView = useInView(menRef, { amount: 0.05 });
  const womenInView = useInView(womenRef, { amount: 0.05 });

  return (
     <div className="text-center py-8">
              <h2 className="text-3xl font-semibold">
                <Title text1="Latest" text2="Editions" />
              </h2>
              <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum nobis fuga, delectus iste adipisci est vitae. Laborum quod rem eaque sequi, quidem suscipit porro omnis culpa. Debitis, quis? Suscipit, doloribus!
              </p>
          
    <div className="w-full flex flex-col sm:flex-row gap-8 my-16 px-4" style={{ minHeight: "100vh" }}>
     
      <motion.div
        ref={menRef}
        initial={{ x: -500, opacity: 0 }}
        animate={menInView ? { x: 0, opacity: 1, transition: { type: "spring", stiffness: 40, damping: 20 } } : { x: -500, opacity: 0, transition: { type: "spring", stiffness: 40, damping: 20 } }}
        className="flex-1 min-h-[250px] sm:min-h-[50vh] rounded-2xl shadow-lg cursor-pointer relative overflow-hidden group flex border-4 "
        style={{
          backgroundImage: `url(${menBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#e0f7fa",
        }}
      >
        <Link
          to="/collection?category=Men"
          className="absolute inset-0 flex items-center justify-center w-full h-full"
        >
          <div className="absolute inset-0  bg-opacity-40 transition-all duration-300" />
          <div className="relative z-10 text-white text-4xl sm:text-5xl font-bold">
           
              Latest Editions for Men
          
          </div>
        </Link>
      </motion.div>
      <motion.div
        ref={womenRef}
        initial={{ x: 500, opacity: 0 }}
        animate={womenInView ? { x: 0, opacity: 1, transition: { type: "spring", stiffness: 40, damping: 20 } } : { x: 500, opacity: 0, transition: { type: "spring", stiffness: 40, damping: 20 } }}
        className="flex-1 min-h-[250px] sm:min-h-[50vh] rounded-2xl shadow-lg cursor-pointer relative overflow-hidden group flex border-4 "
        style={{
          backgroundImage: `url(${womenBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#fce4ec",
        }}
      >
        <Link
          to="/collection?category=Women"
          className="absolute inset-0 flex items-center justify-center w-full h-full"
        >
          <div className="absolute inset-0  bg-opacity-40 transition-all duration-300" />
          <div className="relative z-10 text-white text-4xl sm:text-5xl font-bold">
          
              Latest Editions for Women
          
          </div>
        </Link>
      </motion.div>
    </div>
      </div>
  );
};

export default SplitCollections;