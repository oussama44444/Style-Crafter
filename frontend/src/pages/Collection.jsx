import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";

const PAGE_SIZE = 16;

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlCategory = params.get("category");
  const urlSubCategory = params.get("subCategory");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory ? [urlCategory] : []);
  const [selectedSubCategory, setSelectedSubCategory] = useState(urlSubCategory ? [urlSubCategory] : []);
  const [sortOrder, setSortOrder] = useState("relavent");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError("");
      try {
        const res = await axios.get(`${backendUrl}/api/category`);
        setCategories(res.data.categories);
      } catch (err) {
        console.error(err);
        setCategories([]);
        setCategoriesError("Failed to load categories. Please try again later.");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let productsToDisplay = [...products];


    const normalize = (str) => (str || '').toLowerCase().replace(/\s+/g, ' ').trim();

    if (selectedCategory.length > 0) {
      productsToDisplay = productsToDisplay.filter((product) =>
        selectedCategory.some(
          (cat) => normalize(product.category) === normalize(cat)
        )
      );
    }

    if (selectedSubCategory.length > 0) {
      productsToDisplay = productsToDisplay.filter((product) =>
        selectedSubCategory.some(
          (sub) => normalize(product.subCategory) === normalize(sub)
        )
      );
    }

    if (search.trim()) {
      const lowercasedSearch = search.toLowerCase();
      productsToDisplay = productsToDisplay.filter((product) =>
        product.name.toLowerCase().includes(lowercasedSearch)
      );
    }

    setFilteredProducts(productsToDisplay);
  }, [selectedCategory, selectedSubCategory, products, search, showSearch]);

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory([urlCategory]);
    } else {
      setSelectedCategory([]);
    }
    if (urlSubCategory) {
      setSelectedSubCategory([urlSubCategory]);
    } else {
      setSelectedSubCategory([]);
    }
  }, [urlCategory, urlSubCategory]);

  const handleSubCategoryToggle = (event) => {
    const subCategory = event.target.value;
    setSelectedSubCategory((prevSubCategories) =>
      prevSubCategories.includes(subCategory)
        ? prevSubCategories.filter((item) => item !== subCategory)
        : [...prevSubCategories, subCategory]
    );
  };

  const sortFilteredProducts = (products, sortOrder) => {
    const productsCopy = [...products];
    switch (sortOrder) {
      case "ascending":
        return productsCopy.sort((a, b) => a.price - b.price);
      case "descending":
        return productsCopy.sort((a, b) => b.price - a.price);
      default:
        // Sort by date descending (newest first)
        return productsCopy.sort((a, b) => (b.date || 0) - (a.date || 0));
    }
  };

  const sortedProducts = sortFilteredProducts(filteredProducts, sortOrder);

 
  const totalPages = Math.ceil(sortedProducts.length / PAGE_SIZE);
  const paginatedProducts = sortedProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

 
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [sortedProducts, totalPages, page]);

  useEffect(() => {
    if (showSearch) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-36 border-t px-10 pb-8">
      <div className="min-w-60">
      
        <button
          onClick={() => setIsMenuOpen((open) => !open)}
          className="text-xl flex items-center gap-2 border border-gray-300 rounded px-3 py-2 mb-4 bg-white hover:bg-gray-100 transition"
        >
          ☰ Categories
        </button>
       
        {isMenuOpen && (
          <div className="bg-white shadow-md p-3 border rounded">
            {categoriesLoading ? (
              <div className="text-gray-400 italic">Loading categories...</div>
            ) : categoriesError ? (
              <div className="text-red-500 italic">{categoriesError}</div>
            ) : (
              <ul className="flex flex-col gap-2">
                {categories.map((category) => (
                  <li key={category._id}>
                    <button
                      className={`w-full text-left px-2 py-1 rounded hover:bg-blue-100 ${selectedCategory[0] === category.name ? 'bg-blue-50 font-semibold' : ''}`}
                      onClick={() => {
                        setSelectedCategory([category.name]);
                        setSelectedSubCategory([]);
                        setIsMenuOpen(false);
                      }}
                    >
                      {category.name}
                    </button>
                    {/* Subcategories shown only for selected category */}
                    {selectedCategory[0] === category.name && Array.isArray(category.subCategories) && category.subCategories.length > 0 ? (
                      <ul className="ml-4 mt-2 flex flex-col gap-1">
                        {category.subCategories.map((type) => (
                          <li key={type}>
                            <label className="flex gap-2 items-center">
                              <input
                                type="checkbox"
                                className="w-3"
                                value={type}
                                onChange={handleSubCategoryToggle}
                                checked={selectedSubCategory.includes(type)}
                              />
                              {type}
                            </label>
                          </li>
                        ))}
                      </ul>
                    ) : selectedCategory[0] === category.name && (
                      <div className="ml-4 text-gray-400 italic mt-2">No subcategories available.</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"All"} text2={"Collections"} />
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
           
            <option value="ascending"> Ascending</option>
            <option value="descending"> Descending</option>
          </select>
        </div>
        <div className="grid grid-col-4 md:grid-cols-4 gap-4 gap-y-6">
          {paginatedProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
    
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
