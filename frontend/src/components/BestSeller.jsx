import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/Shopcontext.jsx";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);


  useEffect(() => {
    const bestProducts = products.filter((product) => product.bestseller);
    setBestSeller(bestProducts.slice(0, 20)); 
  }, [products]);

  return (
    <section className="my-10">
     
      <div className="text-center py-8">
        <h2 className="text-3xl font-semibold">
          <Title text1="Highly" text2="Recommended" />
        </h2>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-4">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora commodi sapiente voluptas aliquid doloribus saepe mollitia laborum quas perferendis officia quod dignissimos nulla voluptates, atque neque impedit, tenetur eius voluptatem.
        </p>
      </div>

     
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.map((product) => (
          <ProductItem
            key={product._id}
            id={product._id}
            name={product.name}
            image={product.image}
            price={product.price}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSeller;
