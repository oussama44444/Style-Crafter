import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/Shopcontext";
import { useRef } from "react";
import { 
  FiChevronLeft, FiChevronRight, FiHeart, FiShare2, 
  FiShoppingBag, FiTruck, FiRefreshCw, FiShield, FiStar,
  FiCheck, FiMinus, FiPlus
} from "react-icons/fi";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [selectedColorIdx, setSelectedColorIdx] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const fadeTimeout = useRef(null);

  const features = [
    { icon: FiTruck, text: "Free Shipping", subtext: "On orders over 100dt" },
    { icon: FiRefreshCw, text: "Easy Returns", subtext: "30-day return policy" },
    { icon: FiShield, text: "Secure Payment", subtext: "100% secure transactions" }
  ];

  const loadProductData = () => {
    const foundProduct = products.find(item => item._id === productId);
    if (foundProduct) {
      setProductData(foundProduct);
      setSelectedColorIdx(null);
      setSelectedImage(foundProduct.image[0]);
      setSelectedQuantity(1);
    }
  };

  const loadRelatedProducts = () => {
    if (productData) {
      const related = products.filter(item => 
        item.category === productData.category &&
        item.subCategory === productData.subCategory &&
        item._id !== productData._id
      ).slice(0, 4);
      setRelatedProducts(related);
    }
  };

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

  const handleAddToCart = () => {
    if (!selectedSize && productData?.sizes?.length > 0) {
      toast.warning("Please select a size");
      return;
    }
    for (let i = 0; i < selectedQuantity; i++) {
      addToCart(productData._id, selectedSize);
    }
    toast.success(`Added ${selectedQuantity} item(s) to cart`);
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setSelectedQuantity(prev => prev + 1);
    } else if (type === 'decrease' && selectedQuantity > 1) {
      setSelectedQuantity(prev => prev - 1);
    }
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
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/collection" className="hover:text-purple-600 transition-colors">Collection</Link>
            <span>/</span>
            <span className="text-gray-800">{productData.name}</span>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side - Image Gallery - TALLER VERSION */}
          <div className="lg:w-1/2">
            <div className="relative group">
              {/* Main Image - Increased height */}
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl" style={{ minHeight: '600px', height: '70vh', maxHeight: '800px' }}>
                <img
                  src={selectedImage}
                  alt={productData.name}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${isFading ? "opacity-0" : "opacity-100"}`}
                />
                
                {/* Navigation Buttons */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 justify-center">
                {getCurrentImages().map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentImageIndex(idx);
                      setSelectedImage(img);
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      currentImageIndex === idx ? 'border-purple-500 shadow-md' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="lg:w-1/2">
            {/* Category */}
            <div className="mb-2">
              <span className="text-sm text-purple-600 font-medium uppercase tracking-wider">
                {productData.category} / {productData.subCategory}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {productData.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-4 h-4 fill-current text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500">(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {currency}{productData.price}
              </span>
              {productData.oldPrice && (
                <span className="ml-2 text-lg text-gray-400 line-through">
                  {currency}{productData.oldPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {productData.description}
            </p>

            {/* Color Variants */}
            {productData.colors && productData.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                <div className="flex items-center gap-3 flex-wrap">
                  {productData.colors.map((variant, idx) => (
                    <button
                      key={idx}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        selectedColorIdx === idx ? 'border-gray-900 scale-110 shadow-md' : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ background: variant.color }}
                      onClick={() => {
                        setSelectedColorIdx(idx);
                        setCurrentImageIndex(0);
                      }}
                    />
                  ))}
                  {productData.image && productData.image.length > 0 && productData.colors.length > 1 && (
                    <button
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center bg-white ${
                        selectedColorIdx === null ? 'border-gray-900 scale-110 shadow-md' : 'border-gray-300 hover:scale-105'
                      }`}
                      onClick={() => {
                        setSelectedColorIdx(null);
                        setCurrentImageIndex(0);
                      }}
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full"></div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {productData.sizes && productData.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <button className="text-xs text-purple-600 hover:text-purple-700">Size Guide</button>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {productData.sizes.map((sizeOption, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(sizeOption)}
                      className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedSize === sizeOption
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {sizeOption}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
                >
                  <FiMinus size={16} />
                </button>
                <span className="w-12 text-center font-medium text-lg">{selectedQuantity}</span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                <FiShoppingBag size={20} />
                Add to Cart
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                  isWishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-400'
                }`}
              >
                <FiHeart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
              <button className="w-14 h-14 rounded-xl border-2 border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all duration-200">
                <FiShare2 size={20} />
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-3 gap-4">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={idx} className="text-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon className="text-gray-600" size={18} />
                      </div>
                      <p className="text-xs font-medium text-gray-800">{feature.text}</p>
                      <p className="text-xs text-gray-400">{feature.subtext}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                You May Also Like
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
              <p className="text-gray-500 mt-4">Discover similar styles you'll love</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct._id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-xl bg-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={relatedProduct.image[0]}
                        alt={relatedProduct.name}
                      />
                      {relatedProduct.image[1] && (
                        <img
                          className="absolute top-0 left-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          src={relatedProduct.image[1]}
                          alt={`${relatedProduct.name} second view`}
                        />
                      )}
                      {relatedProduct.bestseller && (
                        <span className="absolute top-3 left-3 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full shadow-md">
                          ⭐ Bestseller
                        </span>
                      )}
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-purple-600 font-bold">
                        {currency}{relatedProduct.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;