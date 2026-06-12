import { assets } from "../assets/assets";
import Title from "../components/Title";
import SubscribeBox from "../components/SubscribeBox";
import { FiMapPin, FiPhone, FiMail, FiFacebook, FiInstagram, FiTwitter, FiSend, FiClock, FiGlobe } from "react-icons/fi";

function Contact() {
  const contactInfo = [
    { icon: FiMapPin, label: "Address", value: "MSB Hall, South Mediterranean University, Lac 2, Tunis", color: "text-purple-500" },
    { icon: FiPhone, label: "Phone", value: "+216 25 994 500", color: "text-pink-500" },
    { icon: FiMail, label: "Email", value: "contact@stylecrafter.com", color: "text-blue-500" },
    { icon: FiClock, label: "Business Hours", value: "Mon - Fri: 9:00 AM - 6:00 PM", color: "text-green-500" }
  ];

  const socialLinks = [
    { icon: FiFacebook, url: "https://facebook.com", label: "Facebook", color: "hover:bg-[#1877f2]" },
    { icon: FiInstagram, url: "https://instagram.com", label: "Instagram", color: "hover:bg-[#e4405f]" },
    { icon: FiTwitter, url: "https://twitter.com", label: "Twitter", color: "hover:bg-[#1da1f2]" }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title text1={'Contact'} text2={'Us'} />
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side - Contact Form */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
              
              <form className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Message</label>
                  <textarea
                    rows="5"
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <FiSend size={18} />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Contact Info */}
          <div className="lg:w-1/2">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                We're here to help and answer any questions you might have. We look forward to hearing from you!
              </p>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className={`${info.color} text-xl`} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">{info.label}</p>
                        <p className="text-white font-medium">{info.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-gray-400 mb-4">Follow Us</p>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 ${social.color}`}
                      >
                        <Icon className="text-white text-lg" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiGlobe className="text-purple-500" />
                Find Us On Map
              </h4>
              <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center">
                <div className="text-center">
                  <FiMapPin className="text-purple-500 text-4xl mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Map View - South Mediterranean University</p>
                  <p className="text-gray-400 text-xs mt-1">Lac 2, Tunis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-20">
          <SubscribeBox />
        </div>
      </div>
    </div>
  );
}

export default Contact;