import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ScrollVelocity from "../../animations/scrollVelocity";
  
const CAROUSEL_INTERVAL = 3000;

const Model = () => {
  const [modelImages, setModelImages] = useState([]);
  const [linkedProducts, setLinkedProducts] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [error, setError] = useState("");
  const Velocity = 50;
  const intervalRef = useRef();

  const [prevIdx, setPrevIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('right'); 
  const [hasAnimated, setHasAnimated] = useState(false);

  const fetchModelImages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/model-images`);
      const data = await response.json();
      if (data.success && Array.isArray(data.images) && data.images.length > 0) {
        setModelImages(data.images);
    
        const productPromises = data.images.map(img =>
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/${img.productId}`)
            .then(res => res.json())
            .then(prodData => prodData.success ? prodData.product : null)
        );
        const products = await Promise.all(productPromises);
        setLinkedProducts(products);
        setError("");
      } else {
        setModelImages([]);
        setLinkedProducts([]);
        setError("No model images found.");
      }
    } catch (error) {
      setModelImages([]);
      setLinkedProducts([]);
      setError("Error fetching model images or products.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchModelImages();
  }, []);

  useEffect(() => {
    if (modelImages.length > 1) {
      intervalRef.current = setInterval(() => {
        const nextIdx = (currentIdx + 1) % modelImages.length;
        setPrevIdx(currentIdx);
        setDirection('right');
        setAnimating(true);
        setHasAnimated(true);
   
        const img = new window.Image();
        img.src = modelImages[nextIdx].url;
        setTimeout(() => {
          setCurrentIdx(nextIdx);
          setAnimating(false);
        }, 400);
      }, CAROUSEL_INTERVAL);
      return () => clearInterval(intervalRef.current);
    }
  }, [modelImages, currentIdx]);

  const handleDotClick = (idx) => {
    if (idx === currentIdx) return;
    setPrevIdx(currentIdx);
    setDirection(idx > currentIdx ? 'right' : 'left');
    setCurrentIdx(idx);
  };

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  const currentImage = modelImages[currentIdx];
  const currentProduct = linkedProducts[currentIdx];

  return currentImage && currentProduct ? (
    <div className="relative w-full h-screen overflow-hidden bg-black">
    
      {/* Background Images */}
      <div className="absolute inset-0 w-full h-full">
        {modelImages.map((img, idx) => {
          const isCurrent = idx === currentIdx;
          const isPrev = idx === prevIdx;
          const isNext = animating && idx === ((direction === 'right') ? (prevIdx + 1) % modelImages.length : (prevIdx - 1 + modelImages.length) % modelImages.length);
          if (!isCurrent && !isPrev && !isNext) return null;
          let transitionClass = '';
          if (!animating) {
            transitionClass = isCurrent ? 'opacity-100 translate-x-0 z-10' : 'opacity-0';
          } else {
            if (isPrev) {
              transitionClass = direction === 'right' ? 'opacity-100 z-10 transition-all duration-500 translate-x-0' : 'opacity-100 z-10 transition-all duration-500 translate-x-0';
            } else if (isNext) {
              transitionClass = direction === 'right' ? 'opacity-100 z-20 transition-all duration-500 translate-x-full' : 'opacity-100 z-20 transition-all duration-500 -translate-x-full';
            } else if (isCurrent) {
              transitionClass = 'opacity-100 translate-x-0 z-20';
            } else {
              transitionClass = 'opacity-0';
            }
          }
          return (
            <img
              key={img._id}
              src={img.url}
              alt={linkedProducts[idx]?.name || ''}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${transitionClass}`}
              style={{transitionProperty: 'opacity, transform'}}
            />
          );
        })}
      </div>

      {/* Centered Content - FIXED for mobile */}
      <div className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6 md:px-8">
        <Link 
          to={`/product/${currentProduct._id}`}
          className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-xl mx-auto"
        >
          <div className="text-center bg-black/60 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-2xl">
            {/* Top decorative line with scroll text */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 min-h-[30px] sm:min-h-[40px] mb-3 sm:mb-4">
              <span className="inline-block flex-shrink-0 w-6 sm:w-8 md:w-10 h-[1px] sm:h-[2px] bg-white/70 rounded-full"></span>
              <div className="max-w-[120px] sm:max-w-[200px] md:max-w-xs w-full overflow-hidden">
                <ScrollVelocity
                  texts={['Latest Edition \u00A0\u00A0\u00A0 ']} 
                  velocity={Velocity} 
                  className="custom-scroll-text text-white/80 text-xs sm:text-sm"
                  numCopies={2}
                />
              </div>
              <span className="inline-block flex-shrink-0 w-6 sm:w-8 md:w-10 h-[1px] sm:h-[2px] bg-white/70 rounded-full"></span>
            </div>

            {/* Product Name */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4 px-2">
              {currentProduct.name}
            </h1>

            {/* Bottom decorative line with scroll text */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 min-h-[30px] sm:min-h-[40px]">
              <span className="inline-block flex-shrink-0 w-6 sm:w-8 md:w-10 h-[1px] sm:h-[2px] bg-white/70 rounded-full"></span>
              <div className="max-w-[120px] sm:max-w-[200px] md:max-w-xs w-full overflow-hidden">
                <ScrollVelocity
                  texts={['Get Yours Now \u00A0\u00A0\u00A0']}
                  velocity={-Velocity} 
                  className="custom-scroll-text text-white/80 text-xs sm:text-sm"
                  numCopies={2}
                />
              </div>
              <span className="inline-block flex-shrink-0 w-6 sm:w-8 md:w-10 h-[1px] sm:h-[2px] bg-white/70 rounded-full"></span>
            </div>
          </div>
        </Link>
      </div>
    
      {/* Dot Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
        {modelImages.map((img, idx) => (
          <button
            key={img._id}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              idx === currentIdx 
                ? 'bg-white scale-110 shadow-lg' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => handleDotClick(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-2 border-white border-t-transparent"></div>
    </div>
  );
};

export default Model;