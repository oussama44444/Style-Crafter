import { useContext, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../context/Shopcontext";
import ProductItem from "../components/ProductItem";
import Title from "../components/Title";

const PAGE_SIZE = 16;

const normalize = (str) => (str || "").toLowerCase().replace(/\s+/g, " ").trim();


const normalizePlural = (str) => {
  if (!str) return "";
  const s = normalize(str);
  if (s.endsWith("s")) return [s, s.slice(0, -1)];
  return [s, s + "s"];
};

const SearchResults = () => {
  const { products } = useContext(ShopContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = normalize(params.get("query") || "");
  const [page, setPage] = useState(1);

  const { categories, subCategories } = useMemo(() => {
    const cats = new Set();
    const subs = new Set();
    products.forEach((p) => {
      if (p.category) cats.add(normalize(p.category));
      if (p.subCategory) subs.add(normalize(p.subCategory));
    });
    return { categories: Array.from(cats), subCategories: Array.from(subs) };
  }, [products]);

  let filtered = products;
  const queryWords = query.split(" ").filter(Boolean);

 
  let detectedCategory = null;
  let detectedSubCategory = null;
  for (const cat of categories) {
    const catForms = normalizePlural(cat);
    for (const qw of queryWords) {
      const qwForms = normalizePlural(qw);
      if (catForms.some((c) => qwForms.includes(c))) {
        detectedCategory = cat;
        break;
      }
    }
    if (detectedCategory) break;
  }
  for (const sub of subCategories) {
    const subForms = normalizePlural(sub);
    for (const qw of queryWords) {
      const qwForms = normalizePlural(qw);
      if (subForms.some((s) => qwForms.includes(s))) {
        detectedSubCategory = sub;
        break;
      }
    }
    if (detectedSubCategory) break;
  }

  let filteredByBoth = [];
  let filteredByCategory = [];
  let filteredBySubCategory = [];
  if (detectedCategory && detectedSubCategory) {
    filteredByBoth = products.filter(
      (p) =>
        normalize(p.category) === detectedCategory &&
        normalize(p.subCategory) === detectedSubCategory
    );
  }
  if (detectedCategory) {
    filteredByCategory = products.filter(
      (p) => normalize(p.category) === detectedCategory
    );
  }
  if (detectedSubCategory) {
    filteredBySubCategory = products.filter(
      (p) => normalize(p.subCategory) === detectedSubCategory
    );
  }
  if (filteredByBoth.length > 0) {
    filtered = filteredByBoth;
  } else if (filteredByCategory.length > 0) {
    filtered = filteredByCategory;
  } else if (filteredBySubCategory.length > 0) {
    filtered = filteredBySubCategory;
  } else {
    filtered = products.filter((p) =>
      queryWords.some(
        (qw) =>
          (p.name && normalize(p.name).includes(qw)) ||
          (p.category && normalize(p.category).includes(qw)) ||
          (p.subCategory && normalize(p.subCategory).includes(qw))
      )
    );
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedProducts = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  if (page > totalPages && totalPages > 0) setPage(1);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-36 border-t px-10 pb-8 min-h-screen">
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"Search"} text2={"results:"} />
        </div>
        <div className="grid grid-col-4 md:grid-cols-4 gap-4 gap-y-6">
          {paginatedProducts.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            paginatedProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
              />
            ))
          )}
        </div>
        {/* Pagination Controls */}
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

export default SearchResults;
