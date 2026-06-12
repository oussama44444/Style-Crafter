import { useContext, useState } from 'react';
import { ShopContext } from "../context/Shopcontext.jsx";
import { FiMail, FiSend, FiGift, FiTag, FiBell, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

function SubscribeBox() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.warning('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call - Replace with your actual API endpoint
    try {
      // const response = await axios.post(`${backendUrl}/api/subscribe`, { email });
      // if (response.data.success) {
      //   toast.success('Subscribed successfully! Check your email for the discount code.');
      //   setEmail('');
      //   setIsSubmitted(true);
      // }
      
      // Simulated success
      setTimeout(() => {
        toast.success('Subscribed successfully! Check your email for 30% off code.');
        setEmail('');
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
      }, 1000);
      
    } catch (error) {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-500 to-white py-16 px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content Container */}
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1 mb-6 animate-fadeInUp">
          <FiGift className="text-purple-400" size={16} />
          <span className="text-white text-sm font-medium">Limited Time Offer</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fadeInUp animation-delay-100">
          Subscribe & Get{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            30% OFF
          </span>
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 animate-fadeInUp animation-delay-200">
          Join our fashion community and receive exclusive offers, early access to new collections, 
          and a special 30% discount on your first purchase!
        </p>

        {/* Benefits */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fadeInUp animation-delay-300">
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1">
            <FiTag className="text-purple-400" size={14} />
            <span className="text-gray-300 text-xs">Exclusive Deals</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1">
            <FiBell className="text-pink-400" size={14} />
            <span className="text-gray-300 text-xs">Early Access</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1">
            <FiMail className="text-blue-400" size={14} />
            <span className="text-gray-300 text-xs">Weekly Updates</span>
          </div>
        </div>

        {/* Subscription Form */}
        <form onSubmit={onSubmitHandler} className="max-w-md mx-auto animate-fadeInUp animation-delay-400">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center pl-4 text-gray-400">
                <FiMail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-4 outline-none text-gray-700 placeholder-gray-400"
                placeholder="Enter your email address"
                required
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <FiSend size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Success Message */}
        {isSubmitted && (
          <div className="mt-4 animate-slideDown">
            <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm text-green-400 px-4 py-2 rounded-lg">
              <FiCheckCircle size={18} />
              <span className="text-sm">Thanks for subscribing! Check your email for the discount code.</span>
            </div>
          </div>
        )}

        {/* Trust Indicator */}
        <p className="text-gray-500 text-xs mt-6">
          No spam, unsubscribe anytime. We respect your privacy.
        </p>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default SubscribeBox;