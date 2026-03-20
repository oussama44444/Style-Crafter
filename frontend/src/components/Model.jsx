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
      const response = await fetch("http://localhost:6009/api/product/model-images");
      const data = await response.json();
      if (data.success && Array.isArray(data.images) && data.images.length > 0) {
        setModelImages(data.images);
    
        const productPromises = data.images.map(img =>
          fetch(`http://localhost:6009/api/product/${img.productId}`)
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
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Link to={`/product/${currentProduct._id}`}
          className="flex flex-col items-center justify-center text-white p-6 w-full">
          <div className="text-center bg-black bg-opacity-50 p-6 rounded-lg max-w-xl mx-auto">
            <div className="flex items-center gap-4 justify-center min-h-[40px]">
              <span className="inline-block align-middle flex-shrink-0" style={{height:'2px',width:'40px',background:'#fff',borderRadius:'2px'}}></span>
              <div className="max-w-xs w-full overflow-hidden">
                <ScrollVelocity
                  texts={['Latest Edition \u00A0\u00A0\u00A0 ']} 
                  velocity={Velocity} 
                  className="custom-scroll-text"
                  numCopies={2}
                />
              </div>
            </div>
            <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
              {currentProduct.name}
            </h1>
            <div className="flex items-center gap-4 justify-center min-h-[40px]">
              <div className="max-w-xs w-full overflow-hidden">
                <ScrollVelocity
                  texts={['Get Yours Now \u00A0\u00A0\u00A0']}
                  velocity={-Velocity} 
                  className="custom-scroll-text inline-block"
                  numCopies={2}
                />
              </div>
              <span className="inline-block align-middle flex-shrink-0" style={{height:'2px',width:'40px',background:'#fff',borderRadius:'2px'}}></span>
            </div>
          </div>
        </Link>
      </div>
    
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {modelImages.map((img, idx) => (
          <button
            key={img._id}
            className={`w-3 h-3 rounded-full ${idx === currentIdx ? 'bg-white' : 'bg-gray-500'} transition-all`}
            onClick={() => handleDotClick(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Model;
