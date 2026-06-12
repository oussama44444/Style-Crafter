import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import axios from "axios";
import { backendUrl } from "../App";
import { FiFilter, FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";

const PAGE_SIZE = 16;

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [sortOrder, setSortOrder] = useState("relavent");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError("");
      try {
        const res = await axios.get(`${backendUrl}/api/categories`);
        console.log("API Response:", res.data);
        
        if (res.data.success && res.data.categories) {
          console.log("Setting categories:", res.data.categories);
          setCategories(res.data.categories);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Error:", err);
        setCategoriesError(err.message);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Set loading to false when products are available
  useEffect(() => {
    if (products && Array.isArray(products)) {
      setIsLoading(false);
    }
  }, [products]);

  // Filter products
  useEffect(() => {
    if (!products || !Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }
    
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

    if (search && search.trim()) {
      const lowercasedSearch = search.toLowerCase();
      productsToDisplay = productsToDisplay.filter((product) =>
        product.name && product.name.toLowerCase().includes(lowercasedSearch)
      );
    }

    setFilteredProducts(productsToDisplay);
    setPage(1);
  }, [selectedCategory, selectedSubCategory, products, search]);

  const sortFilteredProducts = (products, sortOrder) => {
    if (!products || !Array.isArray(products)) return [];
    const productsCopy = [...products];
    switch (sortOrder) {
      case "ascending":
        return productsCopy.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "descending":
        return productsCopy.sort((a, b) => (b.price || 0) - (a.price || 0));
      default:
        return productsCopy.sort((a, b) => (b.date || 0) - (a.date || 0));
    }
  };

  const sortedProducts = sortFilteredProducts(filteredProducts, sortOrder);
  const totalPages = Math.ceil(sortedProducts.length / PAGE_SIZE);
  const paginatedProducts = sortedProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalPages, page]);

  const handleSubCategoryToggle = (subCategory) => {
    setSelectedSubCategory(prev =>
      prev.includes(subCategory)
        ? prev.filter(item => item !== subCategory)
        : [...prev, subCategory]
    );
  };

  const clearFilters = () => {
    setSelectedCategory([]);
    setSelectedSubCategory([]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center pt-36 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Our Collection</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          <p className="text-gray-500 mt-4">Discover our latest fashion collection</p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="w-full flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-md"
          >
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-600" />
              <span className="font-medium text-gray-700">Filter & Sort</span>
            </div>
            {isFilterVisible ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar - Desktop always visible, Mobile conditional */}
          <div className={`${isFilterVisible ? 'block' : 'hidden'} lg:block lg:w-72 flex-shrink-0`}>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                {(selectedCategory.length > 0 || selectedSubCategory.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <FiX size={14} /> Clear all
                  </button>
                )}
              </div>
              
              {/* Loading State */}
              {categoriesLoading && (
                <div className="text-gray-400 py-4 text-center">Loading categories...</div>
              )}
              
              {/* Error State */}
              {categoriesError && (
                <div className="text-red-500 py-4 text-center">Error: {categoriesError}</div>
              )}
              
              {/* Categories List */}
              {!categoriesLoading && !categoriesError && (
                <div className="space-y-4">
                  {/* All Categories Button */}
                  <button
                    onClick={() => {
                      setSelectedCategory([]);
                      setSelectedSubCategory([]);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-200 ${
                      selectedCategory.length === 0 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Products
                  </button>
                  
                  {/* Individual Categories */}
                  {categories.map((category) => (
                    <div key={category._id} className="border-b border-gray-100 pb-3">
                      <button
                        onClick={() => {
                          setSelectedCategory([category.name]);
                          setSelectedSubCategory([]);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-200 flex justify-between items-center ${
                          selectedCategory[0] === category.name 
                            ? 'bg-purple-50 text-purple-700 font-semibold' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="text-xs text-gray-400">{category.subCategories.length}</span>
                      </button>
                      
                      {/* Subcategories */}
                      {selectedCategory[0] === category.name && (
                        <div className="ml-6 mt-2 space-y-2">
                          {category.subCategories.map((sub) => (
                            <label key={sub} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <input
                                type="checkbox"
                                checked={selectedSubCategory.includes(sub)}
                                onChange={() => handleSubCategoryToggle(sub)}
                                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-600 group-hover:text-gray-800">{sub}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Products */}
          <div className="flex-1">
            {/* Sort and Results Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <p className="text-gray-500 text-sm">
                Showing <span className="font-semibold text-gray-700">{paginatedProducts.length}</span> of{' '}
                <span className="font-semibold text-gray-700">{sortedProducts.length}</span> products
              </p>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
              >
                <option value="relavent">Sort by: Relevant</option>
                <option value="ascending">Price: Low to High</option>
                <option value="descending">Price: High to Low</option>
              </select>
            </div>
            
            {/* Active Filters Display */}
            {(selectedCategory.length > 0 || selectedSubCategory.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory.map(cat => (
                  <span key={cat} className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {cat}
                    <button onClick={() => setSelectedCategory([])} className="hover:text-purple-900">
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
                {selectedSubCategory.map(sub => (
                  <span key={sub} className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                    {sub}
                    <button onClick={() => setSelectedSubCategory(prev => prev.filter(s => s !== sub))} className="hover:text-pink-900">
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductItem
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <div className="text-6xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria</p>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-10">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-5 py-2 border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 bg-white shadow-sm"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-xl transition-all duration-200 ${
                          page === pageNum
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-5 py-2 border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200 bg-white shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;