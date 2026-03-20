import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, getTotalPrice, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const updatedCartData = Object.keys(cartItems).flatMap(itemId => 
        Object.entries(cartItems[itemId])
          .filter(([size, quantity]) => quantity > 0)
          .map(([size, quantity]) => ({ _id: itemId, size, quantity }))
      );
      setCartData(updatedCartData);
    }
  }, [cartItems, products]);

  const productTotal = getTotalPrice();
  const total = productTotal + 10;  

  const handleQuantityChange = (itemId, size, value) => {
    const quantity = value === '' || value === '0' ? 0 : Number(value);
    updateQuantity(itemId, size, quantity);
  };

  return (
    <div className="border-t pt-13 relative pb-20">
      <div className="text-2xl mb-3">
        <Title text1="My" text2="Cart" />
      </div>

     
      {cartData.map((item, index) => {
        const productData = products.find(product => product._id === item._id);
        if (!productData) return null;

        const totalPrice = productData.price * item.quantity;

        return (
          <div key={index} className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] items-center gap-4">
            <div className="flex items-start gap-4">
              <img
                className="w-16"
                src={productData.image[0]}
                alt={productData.name || "Product image"}
              />
              <div>
                <p className="text-xs font-medium">{productData.name}</p>
                <p className="text-sm">{item.size}</p>
                <p className="text-sm">Quantity: {item.quantity}</p>
                <div className="flex items-center gap-5 mt-2">
                  <p>{totalPrice} {currency}</p>
                </div>
              </div>
            </div>
            <input
              onChange={(e) => handleQuantityChange(item._id, item.size, e.target.value)}
              className="border max-w-10 px-1"
              type="number"
              min={1}
              value={item.quantity}
            />
            <img
              onClick={() => updateQuantity(item._id, item.size, 0)}
              src={assets.bin}
              className="w-4 mr-4 cursor-pointer"
              alt="Remove item"
            />
          </div>
        );
      })}

     
      <div className="bg-white p-4 shadow-lg border rounded-md w-[200px] fixed right-4 bottom-4">
        <table className="w-full text-right text-sm">
          <tbody>
            <tr>
              <td className="py-1">Products Total</td>
              <td className="py-1">{productTotal} {currency}</td>
            </tr>
            <tr>
              <td className="py-1">Delivery Fee</td>
              <td className="py-1">10 {currency}</td>
            </tr>
            <tr className="border-t border-b">
              <td className="py-1 font-bold">Total Price</td>
              <td className="py-1 font-bold">{total} {currency}</td>
            </tr>
          </tbody>
        </table>
        <div className="w-full text-end">
          <button className="bg-black text-white my-8 px-8 py-3" onClick={() => navigate('/place-order')}>
            Finalize Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
