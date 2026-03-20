import express from 'express'
import  {placeOrder,placeOrderVisa,placeOrderD17,allOrders,userOrders,updateStatus} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)


orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/D17',authUser,placeOrderD17)
orderRouter.post('/visa',authUser,placeOrderVisa)


orderRouter.post('/userorders',authUser,userOrders)

export default orderRouter