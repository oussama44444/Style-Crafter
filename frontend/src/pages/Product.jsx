import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/Shopcontext";
import { useRef } from "react";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [selectedColorIdx, setSelectedColorIdx] = useState(null); // null = main images, 0+ = color idx
  const fadeTimeout = useRef(null);

  const loadProductData = () => {
    const foundProduct = products.find(item => item._id === productId);
    if (foundProduct) {
      setProductData(foundProduct);
      setSelectedColorIdx(null); // default to main images
      setSelectedImage(foundProduct.image[0]);
    }
  };

  const loadRelatedProducts = () => {
    if (productData) {
      const related = products.filter(item => 
        item.category === productData.category &&
        item.subCategory === productData.subCategory &&
        item._id !== productData._id
      );
      setRelatedProducts(related);
    }
  };

  // Helper to get current images array (main or color)
  const getCurrentImages = () => {
    if (selectedColorIdx !== null && productData && productData.colors && productData.colors[selectedColorIdx]) {
      return productData.colors[selectedColorIdx].images;
    }
    return productData ? productData.image : [];
  };

  const handlePrevImage = () => {
    setIsFading(true);
    fadeTimeout.current = setTimeout(() => {
      const imagesArr = getCurrentImages();
      setCurrentImageIndex((prev) =>
        prev === 0 ? imagesArr.length - 1 : prev - 1
      );
      setSelectedImage(imagesArr[
        currentImageIndex === 0 ? imagesArr.length - 1 : currentImageIndex - 1
      ]);
      setIsFading(false);
    }, 300);
  };

  const handleNextImage = () => {
    setIsFading(true);
    fadeTimeout.current = setTimeout(() => {
      const imagesArr = getCurrentImages();
      setCurrentImageIndex((prev) =>
        prev === imagesArr.length - 1 ? 0 : prev + 1
      );
      setSelectedImage(imagesArr[
        currentImageIndex === imagesArr.length - 1 ? 0 : currentImageIndex + 1
      ]);
      setIsFading(false);
    }, 300);
  };
  
  useEffect(() => {
    return () => {
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, []);
  useEffect(() => {
    loadProductData();
    setCurrentImageIndex(0);
  }, [productId]);

  useEffect(() => {
    if (productData) {
      loadRelatedProducts();
      const imagesArr = getCurrentImages();
      setSelectedImage(imagesArr[currentImageIndex] || imagesArr[0]);
    }
  }, [productData, currentImageIndex, selectedColorIdx]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColorIdx]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!productData) {
    return <div className="opacity-0"></div>;
  }

  return (
    <div className="bg-[#F0F0EFff] min-h-screen">
      <div className="flex flex-col sm:flex-row w-full min-h-[80vh]">
        <div className="sm:w-1/2 pl-24 w-full flex flex-col justify-center px-8 py-12 gap-6">
          <div className="uppercase text-xs text-gray-500 tracking-widest mb-2">{productData.category} {productData.subCategory}</div>
          <h1 className="text-5xl sm:text-7xl font-black leading-tight mb-4">{productData.name}</h1>
          <p className="text-gray-600 text-base mb-6 max-w-xl">{productData.description}</p>
       
          {productData.colors && productData.colors.length > 0 && (
            <div className="flex items-center gap-3 mb-6">
          
              {productData.colors.map((variant, idx) => (
                <button
                  key={idx}
                  className={`w-8 h-8 rounded-full border-2 ${selectedColorIdx === idx ? 'border-black' : 'border-gray-300'} focus:outline-none`}
                  style={{ background: variant.color }}
                  onClick={() => {
                    setSelectedColorIdx(idx);
                    setCurrentImageIndex(0);
                  }}
                  aria-label={`Select color ${variant.color}`}
                />
              ))}
             
              {productData.image && productData.image.length > 0 && productData.colors.length > 1 && (
                <button
                  className={`w-8 h-8 rounded-full border-2 ${selectedColorIdx === null ? 'border-black' : 'border-gray-300'} flex items-center justify-center bg-white text-xs`}
                  onClick={() => {
                    setSelectedColorIdx(null);
                    setCurrentImageIndex(0);
                  }}
                  aria-label="Show default images"
                >
                  <span className="block w-4 h-4 bg-gray-200 rounded-full border border-gray-400"></span>
                </button>
              )}
            </div>
          )}
          <div className="flex gap-4 mb-6">
            
            {Array.isArray(productData.sizes) && productData.sizes.length > 0 && (
              <div className="mb-6">
                <div className="text-2xl text-black mb-1">Size</div>
                <div className="flex gap-3 mb-6">
                  {productData.sizes.map((sizeOption, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSize(sizeOption)}
                      className={`px-5 py-2 border rounded-lg text-base font-semibold transition-all duration-150
                        ${selectedSize === sizeOption ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-400 hover:bg-gray-100'}`}
                    >
                      {sizeOption}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => addToCart(productData._id, selectedSize)}
              className="w-full bg-black text-white py-4 rounded-lg flex items-center justify-center gap-2 text-base font-semibold shadow hover:bg-gray-900 uppercase tracking-wide"
              style={{letterSpacing: '1px'}}
            >
              Add to Cart
            </button>
           
          </div>
        </div>
       
        <div className="sm:w-1/2 w-full flex items-center pt-24 justify-center relative bg-transparent">
       <button
    onClick={handlePrevImage}
    className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-400 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow hover:bg-gray-800 z-10"
    aria-label="Previous Image"
  >
    &#8592;
  </button>
  
      <img
        src={selectedImage}
        alt="Selected Product"
        className={`w-full h-[70vh] object-contain transition-opacity duration-300 ${isFading ? "opacity-0" : "opacity-100"}`}
        style={{ maxWidth: '100%', background: 'transparent' }}
      />
          
            <button
    onClick={handleNextImage}
    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-400 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow hover:bg-gray-800 z-10"
    aria-label="Next Image"
  >
    &#8594;
  </button>    
    </div>
      </div>
     
      <div className="pl-24 mt-12">
        <h2 className="text-2xl font-semibold text-center mb-6 font-serif">
          Related Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Link key={relatedProduct._id} to={`/product/${relatedProduct._id}`} className="text-gray-700 cursor-pointer group flex flex-col items-center">
  <div className="relative overflow-hidden w-64 h-80 mx-auto">
    <img
      className="w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
      src={relatedProduct.image[0]}
      alt={relatedProduct.name}
    />
    {relatedProduct.image[1] && (
      <img
        className="absolute top-0 left-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
        src={relatedProduct.image[1]}
        alt={`${relatedProduct.name} second view`}
      />
    )}
  </div>
  <h3 className="mt-4 text-lg font-medium text-center w-full">{relatedProduct.name}</h3>
  <p className="mt-1 text-sm text-gray-600 text-center w-full">{relatedProduct.price}{currency}</p>
</Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
