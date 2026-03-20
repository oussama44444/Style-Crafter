import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connect } from 'mongoose'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import categoryRoute from './routes/categoryRoute.js'


const app= express()
const port = process.env.port || 6009
connectDB()
connectCloudinary

app.use(express.json())
app.use(cors())


app.use('/api/user' , userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/category', categoryRoute)

app.get('/',(req,res)=>{
    res.send("YOUR API IS WORKING")
})

app.listen(port, ()=> console.log(`Server started on PORT: ${port}`))