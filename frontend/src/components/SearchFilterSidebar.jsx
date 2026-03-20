import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import axios from "axios";
import { backendUrl } from "../App";

const PAGE_SIZE = 16;
const normalize = (str) => (str || '').toLowerCase().replace(/\s+/g, ' ').trim();

const SearchFilterSidebar = ({ categories, selectedCategory, setSelectedCategory, selectedSubCategory, setSelectedSubCategory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="min-w-60">
      <button
        onClick={() => setIsMenuOpen((open) => !open)}
        className="text-xl flex items-center gap-2 border border-gray-300 rounded px-3 py-2 mb-4 bg-white hover:bg-gray-100 transition"
      >
        ☰ Categories
      </button>
      {isMenuOpen && (
        <div className="bg-white shadow-md p-3 border rounded">
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
                {selectedCategory[0] === category.name && Array.isArray(category.subCategories) && category.subCategories.length > 0 ? (
                  <ul className="ml-4 mt-2 flex flex-col gap-1">
                    {category.subCategories.map((type) => (
                      <li key={type}>
                        <label className="flex gap-2 items-center">
                          <input
                            type="checkbox"
                            className="w-3"
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
        </div>
      )}
    </div>
  );
};

export default SearchFilterSidebar;
