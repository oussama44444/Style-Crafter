import userModel from "../models/userModel.js";


const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

   
    if (cartData[itemId]) {
      cartData[itemId][size] = cartData[itemId][size] ? cartData[itemId][size] + 1 : 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

   
    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;

   
    if (cartData[itemId] && cartData[itemId][size]) {
      cartData[itemId][size] = quantity;
      await userModel.findByIdAndUpdate(userId, { cartData });
      res.json({ success: true, message: "Cart updated" });
    } else {
      res.json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

   
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {};

    res.json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
