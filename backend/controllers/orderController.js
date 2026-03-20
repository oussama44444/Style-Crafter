import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
const placeOrder=async(req,res) =>{
try {
    const{userId,items,amount,address} = req.body

    const orderData = {
        userId,
        items,
        amount,
        address,
        paymentMethod:"PUA",
        payment:false,
        date: Date.now()
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save()
    await userModel.findByIdAndUpdate(userId,{cartData:{}})

    res.json({success:true,message:"Order Placed"})
} catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
}
}


const placeOrderVisa=async(req,res) =>{
    try {
        const{userId,items,amount,address} = req.body
    
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod:"visa",
            payment:true,
            date: Date.now()
        }
    
        const newOrder = new orderModel(orderData)
        await newOrder.save()
        await userModel.findByIdAndUpdate(userId,{cartData:{}})
    
        res.json({success:true,message:"Order Placed"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


const placeOrderD17=async(req,res) =>{
    try {
        const{userId,items,amount,address} = req.body
    
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod:"d17",
            payment:true,
            date: Date.now()
        }
    
        const newOrder = new orderModel(orderData)
        await newOrder.save()
        await userModel.findByIdAndUpdate(userId,{cartData:{}})
    
        res.json({success:true,message:"Order Placed"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


const allOrders = async (req,res) =>{
    try {
        const orders = await orderModel.find({})
        res.json({success:true , orders})
    } catch (error) {
        console.log(error)  
    res.json({success:false,message:error.message})  
    }
}
const userOrders = async (req,res) =>{
try {
    
    const{userId}=req.body
    const orders = await orderModel.find({userId})
    res.json({success:true,orders})
} catch (error) {
    console.log(error)  
    res.json({success:false,message:error.message})  
}
}

const updateStatus = async(req,res) =>{
    try {
        const {orderId,status}= req.body
        await orderModel.findByIdAndUpdate(orderId,{status})
        res.json({success:true,message:'statusUpdated'})
    } catch (error) {
        onsole.log(error)  
    res.json({success:false,message:error.message})
    }
}


export {placeOrder,placeOrderVisa,placeOrderD17,allOrders,userOrders,updateStatus}