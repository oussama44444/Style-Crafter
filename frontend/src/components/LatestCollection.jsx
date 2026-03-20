import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/Shopcontext.jsx";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  useEffect(() => {
    if (products.length > 0) {
      let sorted = [...products].reverse();
      if (selectedCategory !== "All") {
        sorted = sorted.filter(p => p.category === selectedCategory);
      }
      setLatestProducts(sorted.slice(0, 5));
    }
  }, [products, selectedCategory]);

  return (
    <section className="my-10">
      <div className="text-center py-8">
        <h2 className="text-3xl font-semibold">
          <Title text1="Latest" text2="Additions" />
        </h2>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-4">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum nobis fuga, delectus iste adipisci est vitae. Laborum quod rem eaque sequi, quidem suscipit porro omnis culpa. Debitis, quis? Suscipit, doloribus!
        </p>
      </div>

      {/* Filter Navbar */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full border transition-all ${
              selectedCategory === cat
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedCategory(cat)}
            style={{ fontWeight: selectedCategory === cat ? 'bold' : 'normal' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((product) => (
          <ProductItem
            key={product._id}
            id={product._id}
            image={product.image}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </section>
  );
};

export default LatestCollection;