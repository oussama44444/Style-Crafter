import React from "react";
import { Link } from "react-router-dom";
import bracelet from "../assets/bracelet.png";
import jewelry from "../assets/jewelry.png";
import sunglasses from "../assets/sunglasses.png";
import Title from "./Title";

const SpeceficCollections = () => {
  const collections = [
    {
      id: 1,
      title: "The Men's Stack",
      image: bracelet,
      link: "/collection?category=Men&subCategory=Bracelets",
      bgColor: "#e0f7fa"
    },
    {
      id: 2,
      title: "The Optic Line",
      image: sunglasses,
      link: "/collection?subCategory=Sun%20Glasses",
      bgColor: "#fce4ec"
    },
    {
      id: 3,
      title: "The Sparkle Edit",
      image: jewelry,
      link: "/collection?category=Women&subCategory=Accessories",
      bgColor: "#e0f7fa"
    }
  ];

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 my-12 sm:my-16">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-semibold">
          <Title text1="Shop by" text2="Collection" />
        </h2>
        <p className="w-full sm:w-3/4 md:w-1/2 mx-auto text-xs sm:text-sm text-gray-600 mt-4 px-4">
          Discover our curated collections designed to elevate your style
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="flex-1 min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[350px] rounded-2xl shadow-lg cursor-pointer relative overflow-hidden group border-2 sm:border-4"
            style={{
              backgroundImage: `url(${collection.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: collection.bgColor,
            }}
          >
            <Link
              to={collection.link}
              className="absolute inset-0 flex items-center justify-center w-full h-full"
            >
              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300" />
              
              {/* Title */}
              <div className="relative z-10 text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center px-4 transform group-hover:scale-110 transition-transform duration-300">
                {collection.title}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeceficCollections;