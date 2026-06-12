import { assets } from "../assets/assets";
import SubscribeBox from "../components/SubscribeBox";
import Title from "../components/Title";
import { FiAward, FiHeart, FiTruck, FiShield, FiStar, FiUsers } from "react-icons/fi";

const About = () => {
  const features = [
    { icon: FiAward, title: "Premium Quality", description: "Highest quality materials and craftsmanship" },
    { icon: FiHeart, title: "Eco-Friendly", description: "Sustainable and ethical practices" },
    { icon: FiTruck, title: "Fast Delivery", description: "Worldwide shipping available" },
    { icon: FiShield, title: "Secure Shopping", description: "100% payment protection" }
  ];

  const stats = [
    { value: "500+", label: "Products", icon: FiStar },
    { value: "50K+", label: "Happy Customers", icon: FiUsers },
    { value: "30+", label: "Countries", icon: FiTruck },
    { value: "4.9", label: "Rating", icon: FiStar }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title text1={'About'} text2={'Us'} />
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-2"></div>
        </div>

        {/* Main Content */}
        <div className="my-10 flex flex-col lg:flex-row gap-12 items-center">
          {/* Image Section */}
          <div className="lg:w-1/2 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <img 
              src={assets.aboutus}  
              alt="About Style Crafter" 
              className="relative rounded-2xl shadow-2xl w-full object-cover transform group-hover:scale-105 transition duration-500"
            />
          </div>
          
          {/* Text Section */}
          <div className="lg:w-1/2 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800">Our Story</h3>
              <p className="text-gray-600 leading-relaxed">
                Welcome to Style Crafter, where fashion meets passion. Founded with a vision to bring 
                exceptional style and quality to fashion enthusiasts worldwide, we've grown into a 
                community of creative individuals who believe that clothing is more than just fabric—it's 
                an expression of who you are.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our journey began with a simple idea: to create clothing that combines contemporary 
                design with timeless elegance. Today, we're proud to offer collections that inspire 
                confidence and celebrate individuality. Every piece is carefully crafted with attention 
                to detail, ensuring you look and feel your best.
              </p>
            </div>
            
            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
              <p className="text-gray-700 italic text-center">
                "To empower individuals through style, creating clothing that tells your unique story 
                while maintaining the highest standards of quality and sustainability."
              </p>
              <p className="text-center text-purple-600 font-semibold mt-3">— Our Mission</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Why Choose Us</h3>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-white text-2xl" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h4>
                  <p className="text-gray-500 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl py-12 px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="text-purple-400 text-xl" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
       
        {/* Newsletter Section */}
        <div className="mt-20">
          <SubscribeBox />
        </div>
      </div>
    </div>
  );
};

export default About;