import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import axios from "axios";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff, FiShoppingBag } from "react-icons/fi";

const SignIn = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    currentAction: 'Sign In'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { name, email, password, currentAction } = formState;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleActionSwitch = () => {
    setFormState((prevState) => ({
      ...prevState,
      currentAction: currentAction === 'Sign In' ? 'Sign Up' : 'Sign In',
      name: '', // Reset name when switching
      email: '',
      password: '',
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = currentAction === 'Sign In'
      ? `${backendUrl}/api/user/login`
      : `${backendUrl}/api/user/register`;

    const userData = currentAction === 'Sign In' 
      ? { email, password } 
      : { name, email, password };

    try {
      const response = await axios.post(url, userData);
      
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        
        // Store user ID if available
        if (response.data.user?._id) {
          localStorage.setItem('userId', response.data.user._id);
        }
        
        toast.success(currentAction === 'Sign In' ? 'Welcome !' : 'Account created successfully!');
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FiShoppingBag className="text-white text-3xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {currentAction === 'Sign In' ? 'Welcome!' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {currentAction === 'Sign In' 
              ? 'Sign in to your account to continue' 
              : 'Join Style Crafter for exclusive fashion deals'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Name Field - Only for Sign Up */}
            {currentAction === 'Sign Up' && (
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    onChange={handleInputChange}
                    value={name}
                    name="name"
                    type="text"
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  onChange={handleInputChange}
                  value={email}
                  name="email"
                  type="email"
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  onChange={handleInputChange}
                  value={password}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Forgot Password Link - Only for Sign In */}
          {currentAction === 'Sign In' && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => toast.info("Reset link sent to your email")}
                className="text-sm text-purple-600 hover:text-purple-500 font-medium"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                {currentAction === 'Sign In' ? 'Sign In' : 'Create Account'}
                <FiArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Switch Action Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {currentAction === 'Sign In' ? "Don't have an account?" : "Already have an account?"}
              {' '}
              <button
                type="button"
                onClick={handleActionSwitch}
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
              >
                {currentAction === 'Sign In' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-500">
              Secure authentication
            </span>
          </div>
        </div>

        {/* Guest Checkout Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/collection')}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Continue as Guest →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;