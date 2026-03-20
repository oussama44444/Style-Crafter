import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  
  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { token } }
      );

      if (response.data.success) {
        await fetchAllOrders(); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Orders List</h3>

      <div>
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex flex-row items-center justify-between bg-gray-100 border border-gray-300 p-4 w-full h-full text-center"
          >
            <img className="w-20 h-20" src={assets.parcel_icon} alt="Parcel" />

            <div>
              <div>
                {order.items.map((item, index) => (
                  <p key={index}>
                    {item.name} x {item.quantity} <span>{item.size}</span>
                    {index < order.items.length - 1 && ','}
                  </p>
                ))}
              </div>

              <p>
                {order.address.firstName} {order.address.lastName}
              </p>

              <div>
                <p>{order.address.street},</p>
                <p>
                  {order.address.city}, {order.address.state},{' '}
                  {order.address.country}, {order.address.zipcode}
                </p>
              </div>

              <p>{order.address.phone}</p>
            </div>

            <div>
              <p>Items: {order.items.length}</p>
              <p>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>

            <p>{order.amount}{currency}</p>

            <select
              value={order.status}
              onChange={e => statusHandler(e, order._id)}
              className="border px-2 py-1 rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => {/* cancel logic */}}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded font-bold shadow ml-2"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
