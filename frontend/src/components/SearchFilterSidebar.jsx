import { useState } from "react";

const SearchFilterSidebar = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  selectedSubCategory, 
  setSelectedSubCategory,
  categoriesLoading,
  categoriesError 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true); // Set to TRUE to show by default

  // Debug - log what we receive
  console.log("🔍 SearchFilterSidebar received:", {
    categoriesLength: categories?.length,
    categories: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    isMenuOpen: isMenuOpen
  });

  return (
    <div className="min-w-60">
      <button
        onClick={() => setIsMenuOpen((open) => !open)}
        className="text-xl flex items-center gap-2 border border-gray-300 rounded px-3 py-2 mb-4 bg-white hover:bg-gray-100 transition w-full sm:w-auto"
      >
        ☰ Categories
        <span className="text-sm">{isMenuOpen ? "▲" : "▼"}</span>
      </button>
      
      {isMenuOpen && (
        <div className="bg-white shadow-md p-3 border rounded max-h-96 overflow-y-auto">
          {categoriesLoading ? (
            <div className="text-gray-400 italic text-center py-4">Loading categories...</div>
          ) : categoriesError ? (
            <div className="text-red-500 italic text-center py-4">{categoriesError}</div>
          ) : !categories || categories.length === 0 ? (
            <div className="text-gray-400 italic text-center py-4">
              No categories available. Categories in DB: {categories?.length || 0}
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {/* All Categories option */}
              <li className="border-b pb-2 mb-2">
                <button
                  className="w-full text-left px-2 py-1 rounded hover:bg-blue-100 font-medium"
                  onClick={() => {
                    setSelectedCategory([]);
                    setSelectedSubCategory([]);
                    setIsMenuOpen(false);
                  }}
                >
                  All Categories
                </button>
              </li>
              
              {categories.map((category) => (
                <li key={category._id} className="mb-2">
                  <button
                    className={`w-full text-left px-2 py-1 rounded hover:bg-blue-100 ${
                      selectedCategory[0] === category.name ? 'bg-blue-50 font-semibold text-blue-600' : ''
                    }`}
                    onClick={() => {
                      setSelectedCategory([category.name]);
                      setSelectedSubCategory([]);
                    }}
                  >
                    {category.name} ({category.subCategories?.length || 0})
                  </button>
                  
                  {selectedCategory[0] === category.name && 
                   category.subCategories && 
                   category.subCategories.length > 0 && (
                    <ul className="ml-4 mt-2 flex flex-col gap-1">
                      {category.subCategories.map((type) => (
                        <li key={type}>
                          <label className="flex gap-2 items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <input
                              type="checkbox"
                              className="w-3 h-3"
                              value={type}
                              onChange={e => {
                                const subCategory = e.target.value;
                                setSelectedSubCategory((prev) =>
                                  prev.includes(subCategory)
                                    ? prev.filter((item) => item !== subCategory)
                                    : [...prev, subCategory]
                                );
                              }}
                              checked={selectedSubCategory.includes(type)}
                            />
                            <span className="text-sm">{type}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilterSidebar;