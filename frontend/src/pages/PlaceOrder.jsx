import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useState, useContext } from "react";
import { ShopContext } from "../context/Shopcontext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Placeorder = () => {
  const [method, setMethod] = useState("pua");
  const { navigate, token, cartItems, setCartItems, delivery_fey, getTotalPrice, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const orderItems = [];

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = { ...products.find(product => product._id === itemId) };
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemId][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getTotalPrice(),
      };

      let response;
      switch (method) {
        case 'pua':
          response = await axios.post('http://localhost:6009/api/order/place', orderData, { headers: { token } });
          break;
        case 'visa':
          response = await axios.post('http://localhost:6009/api/order/visa', orderData, { headers: { token } });
          break;
        case 'd17':
          response = await axios.post('http://localhost:6009/api/order/D17', orderData, { headers: { token } });
          break;
        default:
          break;
      }

      if (response?.data?.success) {
        setCartItems({});
        navigate('/orders');
      } else {
        toast.error(response?.data?.message || 'An error occurred');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-row justify-between gap-4 pt-5">
 
      <div className="flex flex-col gap-4 w-full max-w-[50%]">
        <div className="text-xl my-3">
          <Title text1={"Delivery"} text2={"Status"} />
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        <div className="flex gap-3">
          <input
            type="text"
            name="city"
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="postalCode"
            placeholder="Postal Code"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            value={formData.postalCode}
            onChange={handleInputChange}
            required
          />
        </div>
        <input
          type="number"
          name="phoneNumber"
          placeholder="Phone Number"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
        />
      </div>

     
      <div className="w-full max-w-[45%] border border-gray-300 rounded p-9">
        <Title text1={"Order"} text2={"Summary"} />
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-medium">Products Price</td>
              <td className="py-2 text-right">200 dt</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium">Delivery Fee</td>
              <td className="py-2 text-right">10 dt</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium">Total Price</td>
              <td className="py-2 text-right">210 dt</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-13">
          <Title text1="Payment" text2="Method" />
          <div className="flex gap-9 flex-row">
            {['d17', 'visa', 'pua'].map(paymentMethod => (
              <div
                key={paymentMethod}
                onClick={() => setMethod(paymentMethod)}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${method === paymentMethod ? 'bg-green-400' : ''}`}
                ></p>
                <img className="h-20 mx-1" src={assets[paymentMethod]} alt={`${paymentMethod} Payment`} />
              </div>
            ))}
          </div>

         
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </form>
  );
};

export default Placeorder;
