import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { token, currency } = useContext(ShopContext); 
  const [orderData, setOrderData] = useState([]); 

  
  const loadOrderData = async () => {
    try {
  
      if (!token) {
        return null;
      }

     
      const response = await axios.post('http://localhost:6009/api/order/userorders', {}, { headers: { token } });

      if (response.data.success) {
        let allOrdersItem = [];

       
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status; 
            item['payment'] = order.payment; 
            item['paymentMethod'] = order.paymentMethod; 
            item['date'] = order.date; 
            allOrdersItem.push(item); 
          });
        });

       
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error(error); 
    }
  };

 
  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"My"} text2={"Orders"} /> 
      </div>
      <div>
       
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-row justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16" src={item.image[0]} alt={item.name} /> 
              <div>
                <p className="text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                  <p className="text-lg">
                    {item.price}
                    {currency} 
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p> 
                </div>
                <p className="mt-2">
                  Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span> 
                </p>
                <p className="mt-2">
                  Payment: <span className="text-gray-400">{item.paymentMethod}</span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm">{item.status}</p>
              </div>
              <button
                onClick={loadOrderData}
                className="bg-gray-400 border px-6 py-3 text-base font-medium rounded-md"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
